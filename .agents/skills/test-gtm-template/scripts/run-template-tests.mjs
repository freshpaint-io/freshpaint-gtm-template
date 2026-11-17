#!/usr/bin/env node
// Imports a template into a new, unsaved tag template in a GTM workspace,
// runs its Tests tab, and closes the tab without saving.
//
// Usage: node run-template-tests.mjs --container-url <url> [--workspace "Default Workspace"]
//   [--template template.tpl] [--cdp http://127.0.0.1:9222]

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const { values } = parseArgs({
  options: {
    'container-url': { type: 'string' },
    workspace: { type: 'string', default: 'Default Workspace' },
    template: { type: 'string', default: 'template.tpl' },
    cdp: { type: 'string', default: 'http://127.0.0.1:9222' },
  },
});

const containerMatch = values['container-url']?.match(/^.*\/accounts\/\d+\/containers\/\d+/);
if (!containerMatch) {
  console.error(
    'Pass --container-url https://tagmanager.google.com/#/container/accounts/<a>/containers/<c>',
  );
  process.exit(2);
}

const browser = await chromium.connectOverCDP(values.cdp);
const context = browser.contexts()[0];
const page = await context.newPage();
let exitCode = 1;
try {
  // Publishing replaces Default Workspace with a new workspace ID, so pick the workspace by name.
  await page.goto(`${containerMatch[0]}/workspaces/`);
  try {
    await page.getByText(values.workspace, { exact: true }).click({ timeout: 30000 });
  } catch (err) {
    if (page.url().includes('accounts.google.com')) {
      throw new Error(
        'Chrome is not signed in to Google. Sign in to GTM in that Chrome window, then rerun.',
      );
    }
    throw err;
  }
  await page.waitForURL(/\/workspaces\/\d+/);
  const workspaceUrl = page.url().match(/^.*\/workspaces\/\d+/)[0];
  console.log(`Workspace: ${values.workspace} (${workspaceUrl})`);

  await page.goto(`${workspaceUrl}/templates`);
  await page.getByText('Tag Templates', { exact: true }).waitFor({ timeout: 30000 });
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await page.getByText('Template Editor', { exact: true }).waitFor();

  // The editor adds its .tpl file input only once the overflow menu holding Import has been opened.
  await page.locator('.wd-vteditor-overflow [role=button]').click();
  await page.locator('input[type=file][accept=".tpl"]').setInputFiles(resolve(values.template));
  await page
    .getByRole('button', { name: 'Freshpaint Custom Template' })
    .waitFor({ timeout: 15000 });
  // Escape would open the editor's unsaved-changes dialog, so close the menu by clicking outside it.
  const menuOverlay = page.locator('.md-panel-outer-wrapper.md-panel-is-showing');
  if (await menuOverlay.isVisible()) {
    await menuOverlay.click({ position: { x: 5, y: 5 } });
    await menuOverlay.waitFor({ state: 'hidden' });
  }

  await page.getByRole('tab', { name: 'Tests' }).click();
  await page.getByRole('button', { name: 'Run Tests' }).click();
  const result = page.getByText(/Executed \d+ tests \((SUCCESS|FAILURE)\)/);
  await result.waitFor({ timeout: 60000 });
  const summary = await result.innerText();

  const consoleText = await page.evaluate(() => {
    const text = document.body.innerText;
    const start = text.lastIndexOf('Template preview refreshed at');
    return start === -1 ? '' : text.slice(start);
  });
  console.log(consoleText.trim());
  exitCode = summary.includes('SUCCESS') ? 0 : 1;
} finally {
  await page.close({ runBeforeUnload: false });
  await browser.close();
}
process.exit(exitCode);
