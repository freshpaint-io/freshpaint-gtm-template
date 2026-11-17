import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { migratedTag, planMigration, triggerResource, variableResource } from './plan.js';

const ALL_PAGES = '2147479553';

const consentGated = (...signals) => ({
  consentStatus: 'needed',
  consentType: { type: 'list', list: signals.map((value) => ({ type: 'template', value })) },
});

const tag = (overrides) => ({
  tagId: overrides.name,
  type: 'html',
  firingTriggerId: [ALL_PAGES],
  consentSettings: consentGated('ad_storage'),
  ...overrides,
});

const pageView = { triggerId: '10', name: 'Pricing page', type: 'pageview' };
const click = { triggerId: '11', name: 'CTA click', type: 'click' };

function existingFpSetup() {
  const variable = {
    ...variableResource('ad_storage'),
    variableId: '20',
    name: 'FP GCM ad_storage',
  };
  const trigger = {
    ...triggerResource(['ad_storage'], { ad_storage: variable.name }),
    triggerId: '21',
    name: 'fp_consent_update',
  };
  return { variable, trigger };
}

describe('planMigration', () => {
  it('migrates consent-gated tags on unconditioned page-load triggers', () => {
    const plan = planMigration({
      tags: [
        tag({ name: 'Pixel', consentSettings: consentGated('ad_user_data', 'ad_storage') }),
        tag({
          name: 'Heatmap',
          firingTriggerId: ['12'],
          consentSettings: consentGated('analytics_storage'),
        }),
      ],
      triggers: [{ triggerId: '12', name: 'DOM Ready', type: 'domReady' }],
      variables: [],
    });

    assert.deepEqual(
      plan.migrate.map(({ tag, signals }) => [tag.name, signals]),
      [
        ['Pixel', ['ad_storage', 'ad_user_data']],
        ['Heatmap', ['analytics_storage']],
      ],
      'signals should be sorted in GCM order',
    );
    assert.deepEqual(
      plan.triggers.map((t) => [t.key, t.existing]),
      [
        ['ad_storage+ad_user_data', undefined],
        ['analytics_storage', undefined],
      ],
    );
    assert.deepEqual(
      plan.variables.map((v) => v.signal),
      ['ad_storage', 'ad_user_data', 'analytics_storage'],
    );
  });

  it('shares one trigger between tags that require the same signals in any order', () => {
    const plan = planMigration({
      tags: [
        tag({ name: 'A', consentSettings: consentGated('ad_storage', 'ad_user_data') }),
        tag({ name: 'B', consentSettings: consentGated('ad_user_data', 'ad_storage') }),
      ],
      triggers: [],
      variables: [],
    });

    assert.equal(plan.triggers.length, 1);
  });

  it('leaves tags alone that are not consent-gated, Google, paused, or never fire', () => {
    const plan = planMigration({
      tags: [
        tag({ name: 'No checks', consentSettings: { consentStatus: 'notSet' } }),
        tag({ name: 'GA4', type: 'gaawe' }),
        tag({ name: 'Paused', paused: true }),
        tag({ name: 'Orphan', firingTriggerId: [] }),
      ],
      triggers: [],
      variables: [],
    });

    assert.deepEqual(plan.migrate, []);
    assert.deepEqual(plan.review, []);
    assert.deepEqual(plan.skipped, {
      notConsentGated: 1,
      googleTag: 1,
      paused: 1,
      noFiringTriggers: 1,
    });
  });

  it('sends tags to review when moving them would change when they fire', () => {
    const plan = planMigration({
      tags: [
        tag({ name: 'Mixed', firingTriggerId: [ALL_PAGES, click.triggerId] }),
        tag({ name: 'Conditioned', firingTriggerId: [pageView.triggerId] }),
        tag({ name: 'Excepted', blockingTriggerId: [pageView.triggerId] }),
        tag({ name: 'Sequenced', setupTag: [{ tagName: 'Setup' }] }),
        tag({ name: 'Custom consent', consentSettings: consentGated('ad_storage', 'vendor_x') }),
      ],
      triggers: [{ ...pageView, filter: [{ type: 'contains' }] }, click],
      variables: [],
    });

    assert.deepEqual(plan.migrate, []);
    assert.deepEqual(
      plan.review.map(({ tag, reasons }) => [tag.name, reasons.length]),
      [
        ['Mixed', 1],
        ['Conditioned', 1],
        ['Excepted', 1],
        ['Sequenced', 1],
        ['Custom consent', 1],
      ],
    );
    assert.match(plan.review[0].reasons[0], /CTA click.*isn't a page-load trigger/);
    assert.match(plan.review[4].reasons[0], /vendor_x/);
  });

  it('reuses an existing fp_gcm variable and matching trigger, and recognizes tags already on it', () => {
    const { variable, trigger } = existingFpSetup();
    const plan = planMigration({
      tags: [tag({ name: 'Done', firingTriggerId: [trigger.triggerId] }), tag({ name: 'Todo' })],
      triggers: [trigger],
      variables: [variable],
    });

    assert.deepEqual(
      plan.alreadyMigrated.map((t) => t.name),
      ['Done'],
    );
    assert.deepEqual(
      plan.migrate.map(({ tag }) => tag.name),
      ['Todo'],
    );
    assert.equal(plan.variables[0].existing, variable);
    assert.equal(plan.triggers[0].existing, trigger);
  });

  it('does not reuse an fp_consent_update trigger that also checks other conditions', () => {
    const { variable, trigger } = existingFpSetup();
    const narrowed = {
      ...trigger,
      filter: [
        ...trigger.filter,
        { type: 'contains', parameter: [{ key: 'arg0', value: '{{Page Path}}' }] },
      ],
    };
    const plan = planMigration({
      tags: [tag({ name: 'Todo' })],
      triggers: [narrowed],
      variables: [variable],
    });

    assert.equal(plan.triggers[0].existing, undefined);
  });
});

describe('migratedTag', () => {
  it('replaces the firing triggers and fires once per page, keeping everything else', () => {
    const original = tag({ name: 'Pixel', tagFiringOption: 'oncePerEvent', notes: 'keep me' });

    assert.deepEqual(migratedTag(original, '21'), {
      ...original,
      firingTriggerId: ['21'],
      tagFiringOption: 'oncePerLoad',
    });
  });
});
