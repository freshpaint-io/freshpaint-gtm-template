#!/usr/bin/env node
// Walks a site through first visit, "Accept all", and reload in a fresh browser context, and screenshots each
// step with an overlay of GTM's consent state, the fpconsent cookie's data.gcm, and fp_consent_update events.
//
// Usage: node capture-consent-flow.mjs --url <site> --out <dir> [--sdk built-freshpaint.js] [--label text]
//   [--accept-selector css] [--cdp http://127.0.0.1:9222]

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const { values } = parseArgs({
  options: {
    url: { type: 'string' },
    out: { type: 'string' },
    sdk: { type: 'string' },
    label: { type: 'string' },
    'accept-selector': { type: 'string', default: "#cc-main [data-role='all']" },
    cdp: { type: 'string', default: 'http://127.0.0.1:9222' },
  },
});

if (!values.url || !values.out) {
  console.error('Pass --url <site> and --out <dir>');
  process.exit(2);
}

const SDK_URL = 'https://perfalytics.com/static/js/freshpaint.js*';
const sdkBody = values.sdk ? readFileSync(values.sdk, 'utf8') : null;
const label = values.label ?? (sdkBody ? `SDK from ${values.sdk}` : 'Production SDK');
const acceptSelector = values['accept-selector'];
mkdirSync(values.out, { recursive: true });

const SIGNALS = [
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
  'analytics_storage',
  'personalization_storage',
  'functionality_storage',
  'security_storage',
];

function readState(page) {
  return page.evaluate((signals) => {
    const ics = window.google_tag_data?.ics ?? { entries: {} };
    const raw = document.cookie.split('; ').find((c) => c.startsWith('fpconsent='));
    let cookie = null;
    if (raw) {
      const value = raw.slice('fpconsent='.length);
      try {
        cookie = JSON.parse(value);
      } catch {
        cookie = JSON.parse(decodeURIComponent(value));
      }
    }
    const updates = (window.dataLayer || []).filter((e) => e?.event === 'fp_consent_update');
    const fmt = (v) => (v === true ? 'granted' : v === false ? 'denied' : '—');
    return {
      rows: signals.map((s) => {
        const e = ics.entries[s] || {};
        return { signal: s, default: fmt(e.default), update: ics.usedUpdate ? fmt(e.update) : '—' };
      }),
      waitPeriodTimedOut: ics.waitPeriodTimedOut,
      cookieCategories: cookie?.categories ?? null,
      cookieGcm: cookie?.data?.gcm ?? null,
      hasCookie: !!cookie,
      fpConsentUpdates: updates.length,
      lastFpGcm: updates.at(-1)?.fp_gcm ?? null,
      sdkConsentConfig: window.freshpaint?._consent_management_configs ?? null,
    };
  }, SIGNALS);
}

async function overlay(page, title) {
  const state = await readState(page);
  await page.evaluate(
    ({ title, label, state }) => {
      document.getElementById('__gcm_overlay')?.remove();
      const color = (v) => (v === 'granted' ? '#027a48' : v === 'denied' ? '#b42318' : '#667085');
      const bg = (v) => (v === 'granted' ? '#d1fadf' : v === 'denied' ? '#fee4e2' : '#f2f4f7');
      const pill = (v) =>
        `<span style="display:inline-block;min-width:64px;text-align:center;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600;color:${color(v)};background:${bg(v)}">${v}</span>`;
      const rows = state.rows
        .map(
          (r) =>
            `<tr><td style="padding:4px 8px 4px 0;font-family:ui-monospace,Menlo,monospace;font-size:12px">${r.signal}</td><td style="padding:4px 8px">${pill(r.default)}</td><td style="padding:4px 0 4px 8px">${pill(r.update)}</td></tr>`,
        )
        .join('');
      const gcmRows = state.cookieGcm
        ? Object.entries(state.cookieGcm)
            .map(
              ([k, v]) =>
                `<div style="display:flex;justify-content:space-between;margin:2px 0"><code style="font-size:12px">${k}</code>${pill(v)}</div>`,
            )
            .join('')
        : `<div style="color:#667085;font-size:13px">${state.hasCookie ? 'Cookie has no <code>data.gcm</code>' : 'No <code>fpconsent</code> cookie'}</div>`;
      const el = document.createElement('div');
      el.id = '__gcm_overlay';
      el.style.cssText =
        'position:fixed;top:16px;right:16px;width:500px;z-index:2147483647;background:#fff;border:2px solid #3f51b5;border-radius:12px;box-shadow:0 12px 32px rgba(16,24,40,.18);padding:16px 18px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Inter,sans-serif;color:#101828';
      el.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.06em;color:#3f51b5;text-transform:uppercase">${label}</div>
        <div style="font-size:17px;font-weight:600;margin:4px 0 12px">${title}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">GTM consent state <span style="font-weight:400;color:#667085">(google_tag_data.ics)</span></div>
        <table style="border-collapse:collapse;width:100%;margin-bottom:12px">
          <tr style="font-size:11px;color:#667085;text-align:left"><th style="font-weight:500;padding-bottom:4px">Signal</th><th style="font-weight:500;padding:0 8px 4px">Default (Consent Init)</th><th style="font-weight:500;padding:0 0 4px 8px">Update (SDK)</th></tr>
          ${rows}
        </table>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px"><code>fpconsent</code> cookie <code>data.gcm</code>${state.cookieCategories ? ` <span style="font-weight:400;color:#667085">· categories: ${state.cookieCategories.join(', ')}</span>` : ''}</div>
        ${gcmRows}
        <div style="font-size:12px;color:#667085;margin-top:10px">fp_consent_update events: ${state.fpConsentUpdates} · wait timed out: ${state.waitPeriodTimedOut}</div>`;
      document.body.appendChild(el);
    },
    { title, label, state },
  );
  return state;
}

async function waitForUpdates(page, count) {
  await page.waitForFunction(
    (n) => (window.dataLayer || []).filter((e) => e?.event === 'fp_consent_update').length >= n,
    count,
    { timeout: 15000 },
  );
  await page.waitForTimeout(1500);
}

const browser = await chromium.connectOverCDP(values.cdp);
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
if (sdkBody) {
  await context.route(SDK_URL, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: sdkBody }),
  );
}
const results = {};
try {
  const page = await context.newPage();
  await page.goto(values.url, { waitUntil: 'load' });
  await waitForUpdates(page, 1);
  await page.waitForSelector(acceptSelector, { state: 'visible', timeout: 10000 });
  results.firstVisit = await overlay(page, '1. First visit, no consent cookie');
  await page.screenshot({ path: `${values.out}/1-first-visit.png` });

  await page.click(acceptSelector);
  await waitForUpdates(page, 2);
  results.acceptAll = await overlay(page, '2. Accept all');
  await page.screenshot({ path: `${values.out}/2-accept-all.png` });

  await page.reload({ waitUntil: 'load' });
  await waitForUpdates(page, 1);
  results.reload = await overlay(page, '3. Next page view');
  await page.screenshot({ path: `${values.out}/3-reload.png` });
} finally {
  await context.close();
  await browser.close();
}
writeFileSync(`${values.out}/results.json`, JSON.stringify(results, null, 1));
console.log(JSON.stringify(results, null, 1));
