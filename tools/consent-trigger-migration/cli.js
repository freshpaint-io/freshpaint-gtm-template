#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { createGtmClient, DEFAULT_MIN_INTERVAL_MS } from './gtm-api.js';
import {
  migratedTag,
  planMigration,
  triggerName,
  triggerResource,
  variableName,
  variableResource,
} from './plan.js';

const USAGE = `Moves consent-gated, page-load tags that aren't Google tags onto Freshpaint fp_consent_update triggers.

Usage:
  GTM_ACCESS_TOKEN=... node tools/consent-trigger-migration/cli.js --container GTM-XXXXXXX [options]

Each migrated tag fires on an fp_consent_update trigger that only fires when every signal in the tag's
additional consent checks is granted, and is set to fire once per page. Tags this can't migrate safely are
listed for review. Nothing is published.

Options:
  --container <GTM-ID>    Container public ID (required)
  --account <id>          GTM account ID, to skip searching every account for the container
  --workspace <id>        Workspace to read and, with --apply, write to. Without it, a dry run reads the
                          first workspace and --apply creates a new one.
  --apply                 Make the changes. Without it, only report what would change.
  --report <file>         Also write the plan as JSON
  --min-interval-ms <n>   Minimum time between API requests (default ${DEFAULT_MIN_INTERVAL_MS})
  --help

The access token needs the https://www.googleapis.com/auth/tagmanager.edit.containers scope.
The API allows 25 requests per 100 seconds and 10,000 per day per Google Cloud project, so --apply takes
about 4 seconds per migrated tag. Rerun with --workspace to resume an interrupted run.`;

const { values: args } = parseArgs({
  options: {
    container: { type: 'string' },
    account: { type: 'string' },
    workspace: { type: 'string' },
    apply: { type: 'boolean', default: false },
    report: { type: 'string' },
    'min-interval-ms': { type: 'string', default: String(DEFAULT_MIN_INTERVAL_MS) },
    help: { type: 'boolean', default: false },
  },
});

if (args.help || !args.container) {
  console.log(USAGE);
  process.exit(args.help ? 0 : 1);
}
const accessToken = process.env.GTM_ACCESS_TOKEN;
if (!accessToken) {
  console.error(
    'Set GTM_ACCESS_TOKEN to an OAuth access token with the tagmanager.edit.containers scope.',
  );
  process.exit(1);
}

const log = (message) => console.error(message);
const gtm = createGtmClient({ accessToken, minIntervalMs: Number(args['min-interval-ms']), log });

async function chooseWorkspace(container) {
  const workspaces = await gtm.listWorkspaces(container.path);
  if (args.workspace) {
    const workspace = workspaces.find((w) => w.workspaceId === args.workspace);
    if (!workspace)
      throw new Error(`Container ${container.publicId} has no workspace ${args.workspace}`);
    return workspace;
  }
  if (!args.apply) return workspaces[0];
  return gtm.createWorkspace(container.path, {
    name: `Freshpaint consent triggers ${new Date().toISOString().slice(0, 10)}`,
    description: 'Moves consent-gated page-load tags onto Freshpaint fp_consent_update triggers.',
  });
}

function printPlan(plan) {
  const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;
  const { skipped } = plan;
  console.log(`\nTo migrate: ${count(plan.migrate.length, 'tag')}`);
  for (const { tag, signals } of plan.migrate)
    console.log(`  ${tag.name}  [${signals.join(', ')}]`);
  console.log(`\nAlready migrated: ${count(plan.alreadyMigrated.length, 'tag')}`);
  console.log(`\nNeeds review: ${count(plan.review.length, 'tag')}`);
  for (const { tag, reasons } of plan.review) {
    console.log(`  ${tag.name}`);
    for (const reason of reasons) console.log(`    - ${reason}`);
  }
  console.log(
    `\nLeft alone: ${skipped.notConsentGated} without additional consent checks, ${skipped.googleTag} Google, ` +
      `${skipped.paused} paused, ${skipped.noFiringTriggers} without firing triggers`,
  );
  const describe = (items, name) =>
    items.map(
      (item) => `  ${item.existing ? 'reuse' : 'create'} ${item.existing?.name ?? name(item)}`,
    );
  console.log(
    `\nVariables:\n${describe(plan.variables, (v) => variableName(v.signal)).join('\n') || '  none'}`,
  );
  console.log(
    `Triggers:\n${describe(plan.triggers, (t) => triggerName(t.signals)).join('\n') || '  none'}`,
  );
}

function reportJson(plan, workspace) {
  const tagSummary = (tag) => ({ tagId: tag.tagId, name: tag.name, type: tag.type });
  return {
    workspace: {
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      url: workspace.tagManagerUrl,
    },
    migrate: plan.migrate.map(({ tag, signals }) => ({ ...tagSummary(tag), signals })),
    alreadyMigrated: plan.alreadyMigrated.map(tagSummary),
    review: plan.review.map(({ tag, reasons }) => ({ ...tagSummary(tag), reasons })),
    skipped: plan.skipped,
  };
}

async function apply(plan, workspace) {
  const variableNameBySignal = {};
  for (const { signal, existing } of plan.variables) {
    const variable =
      existing ?? (await gtm.createVariable(workspace.path, variableResource(signal)));
    if (!existing) log(`Created variable "${variable.name}"`);
    variableNameBySignal[signal] = variable.name;
  }

  const triggerIdBySignalSet = {};
  for (const { key, signals, existing } of plan.triggers) {
    const trigger =
      existing ??
      (await gtm.createTrigger(workspace.path, triggerResource(signals, variableNameBySignal)));
    if (!existing) log(`Created trigger "${trigger.name}"`);
    triggerIdBySignalSet[key] = trigger.triggerId;
  }

  let done = 0;
  for (const { tag, signals } of plan.migrate) {
    await gtm.updateTag(migratedTag(tag, triggerIdBySignalSet[signals.join('+')]));
    log(`[${++done}/${plan.migrate.length}] Migrated "${tag.name}"`);
  }
}

const container = await gtm.findContainer(args.container, args.account);
const workspace = await chooseWorkspace(container);
log(`Reading ${container.publicId} workspace "${workspace.name}" (${workspace.workspaceId})`);

const plan = planMigration({
  tags: await gtm.listTags(workspace.path),
  triggers: await gtm.listTriggers(workspace.path),
  variables: await gtm.listVariables(workspace.path),
});
printPlan(plan);
if (args.report) writeFileSync(args.report, JSON.stringify(reportJson(plan, workspace), null, 2));

if (!args.apply) {
  console.log('\nDry run. Rerun with --apply to make these changes in a new workspace.');
} else {
  await apply(plan, workspace);
  console.log(
    `\nDone. Review and publish workspace "${workspace.name}": ${workspace.tagManagerUrl}`,
  );
}
