#!/usr/bin/env node
// Walks a site through first visit, "Accept all", and reload in a fresh browser context, and screenshots each
// step with an overlay of GTM's consent state, the fpconsent cookie's data.gcm, and fp_consent_update events.
// --remap and --bump-revision add steps that reload after a simulated consent config publish, by rewriting the
// SDK's event-definitions response in this browser context only.
//
// Usage: node capture-consent-flow.mjs --url <site> --out <dir> [--sdk built-freshpaint.js] [--label text]
//   [--remap signal=category|null,...] [--bump-revision] [--accept-selector css] [--cdp http://127.0.0.1:9222]

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const { values } = parseArgs({
  options: {
    url: { type: 'string' },
    out: { type: 'string' },
    sdk: { type: 'string' },
    label: { type: 'string' },
    remap: { type: 'string' },
    'bump-revision': { type: 'boolean', default: false },
    'accept-selector': { type: 'string', default: "#cc-main [data-role='all']" },
    cdp: { type: 'string', default: 'http://127.0.0.1:9222' },
  },
});

if (!values.url || !values.out) {
  console.error('Pass --url <site> and --out <dir>');
  process.exit(2);
}

const SDK_URL = 'https://perfalytics.com/static/js/freshpaint.js*';
const EVENT_DEFINITIONS_URL = 'https://perfalytics.com/event-definitions/**';
const sdkBody = values.sdk ? readFileSync(values.sdk, 'utf8') : null;
const label = values.label ?? (sdkBody ? `SDK from ${values.sdk}` : 'Production SDK');
const acceptSelector = values['accept-selector'];
const remap = values.remap
  ? Object.fromEntries(
      values.remap.split(',').map((pair) => {
        const [signal, category] = pair.split('=').map((s) => s.trim());
        return [signal, category === 'null' ? null : category];
      }),
    )
  : null;
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
  return page.evaluate(
    ({ signals, acceptSelector }) => {
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
      const config = window.freshpaint?._consent_management_configs?.freshpaint ?? null;
      const fmt = (v) => (v === true ? 'granted' : v === false ? 'denied' : '—');
      return {
        rows: signals.map((s) => {
          const e = ics.entries[s] || {};
          const mapped = config?.gcmCategoryMapping?.[s];
          return {
            signal: s,
            mappedTo: mapped === undefined ? '—' : String(mapped),
            default: fmt(e.default),
            update: ics.usedUpdate ? fmt(e.update) : '—',
          };
        }),
        waitPeriodTimedOut: ics.waitPeriodTimedOut,
        bannerShown:
          document
            .querySelector(acceptSelector)
            ?.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ?? false,
        configRevision: config?.revision ?? null,
        cookieRevision: cookie?.revision ?? null,
        cookieCategories: cookie?.categories ?? null,
        cookieGcm: cookie?.data?.gcm ?? null,
        hasCookie: !!cookie,
        fpConsentUpdates: updates.length,
        lastFpGcm: updates.at(-1)?.fp_gcm ?? null,
        sdkConsentConfig: window.freshpaint?._consent_management_configs ?? null,
      };
    },
    { signals: SIGNALS, acceptSelector },
  );
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
      const cell = 'padding:4px 6px';
      const rows = state.rows
        .map(
          (r) =>
            `<tr><td style="${cell};padding-left:0;font-family:ui-monospace,Menlo,monospace;font-size:12px">${r.signal}</td><td style="${cell};font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#475467">${r.mappedTo}</td><td style="${cell}">${pill(r.default)}</td><td style="${cell};padding-right:0">${pill(r.update)}</td></tr>`,
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
      const cookieMeta = state.hasCookie
        ? ` <span style="font-weight:400;color:#667085">· revision ${state.cookieRevision} · categories: ${(state.cookieCategories || []).join(', ')}</span>`
        : '';
      const el = document.createElement('div');
      el.id = '__gcm_overlay';
      el.style.cssText =
        'position:fixed;top:16px;right:16px;width:580px;z-index:2147483647;background:#fff;border:2px solid #3f51b5;border-radius:12px;box-shadow:0 12px 32px rgba(16,24,40,.18);padding:16px 18px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Inter,sans-serif;color:#101828';
      el.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.06em;color:#3f51b5;text-transform:uppercase">${label}</div>
        <div style="font-size:17px;font-weight:600;margin:4px 0 12px">${title}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">GTM consent state <span style="font-weight:400;color:#667085">(google_tag_data.ics) · config revision ${state.configRevision} · banner ${state.bannerShown ? 'shown' : 'hidden'}</span></div>
        <table style="border-collapse:collapse;width:100%;margin-bottom:12px">
          <tr style="font-size:11px;color:#667085;text-align:left"><th style="font-weight:500;padding:0 6px 4px 0">Signal</th><th style="font-weight:500;padding:0 6px 4px">Mapped to</th><th style="font-weight:500;padding:0 6px 4px">Default (Consent Init)</th><th style="font-weight:500;padding:0 0 4px 6px">Update (SDK)</th></tr>
          ${rows}
        </table>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px"><code>fpconsent</code> cookie <code>data.gcm</code>${cookieMeta}</div>
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

let configEdit = null;
await context.route(EVENT_DEFINITIONS_URL, async (route) => {
  const response = await route.fetch();
  const body = await response.json();
  const config = body?.consentManagementConfigs?.freshpaint;
  if (configEdit && config) {
    configEdit(config);
  }
  await route.fulfill({ response, json: body });
});

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

  if (remap) {
    configEdit = (config) => Object.assign(config.gcmCategoryMapping, remap);
    await page.reload({ waitUntil: 'load' });
    await waitForUpdates(page, 1);
    results.remap = await overlay(page, '4. Mapping changed and published without prompting again');
    await page.screenshot({ path: `${values.out}/4-mapping-changed.png` });
  }

  if (values['bump-revision']) {
    const previousEdit = configEdit;
    configEdit = (config) => {
      previousEdit?.(config);
      config.revision += 1;
    };
    await page.reload({ waitUntil: 'load' });
    await waitForUpdates(page, 1);
    results.bumpRevision = await overlay(
      page,
      '5. Published with "prompt again" (revision bumped)',
    );
    await page.screenshot({ path: `${values.out}/5-revision-bumped.png` });

    await page.waitForSelector(acceptSelector, { state: 'visible', timeout: 10000 });
    await page.click(acceptSelector);
    await waitForUpdates(page, 2);
    results.reacceptAll = await overlay(page, '6. Accept all again on the new revision');
    await page.screenshot({ path: `${values.out}/6-reaccept-all.png` });
  }
} finally {
  await context.close();
  await browser.close();
}
writeFileSync(`${values.out}/results.json`, JSON.stringify(results, null, 1));
console.log(JSON.stringify(results, null, 1));
