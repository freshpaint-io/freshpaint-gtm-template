---
name: test-gtm-template
description: Test a change to the Freshpaint GTM template before merging. Runs the src/tests.yaml scenarios in GTM's template editor, and for consent changes checks GTM's consent state on the demo site with screenshots. Use when changing src/web.js, src/tests.yaml, permissions or parameters, or when asked to test, validate or screenshot the GTM template.
---

# Test a GTM template change

The template's tests run only in GTM's sandbox, and tag-firing and consent behavior can only be seen on a real page. Test in three stages, and stop at the first failure:

1. Build and check the generated file.
2. Run the template tests in GTM.
3. For changes to consent or to what reaches Google tags, check the flow on the demo site.

The scripts drive a Chrome you are signed in to, over the DevTools protocol. Start Chrome with `--remote-debugging-port=9222`, or reuse the agent's Chrome on that port. Sign in to GTM in that window first: if the Google session has expired, the scripts stop and say so. A sign-in needs the user's 2-Step Verification, so ask them to do it.

Run `npm install` once so `playwright-core` is available.

## 1. Build

```bash
npm run build
git status --short
```

`template.tpl` is generated. Never edit it by hand. After `npm run build`, `git status` must show no change to `template.tpl` beyond the commit you're testing. When a rebase conflicts in `template.tpl`, resolve the sources under `src/`, then run `npm run build` and stage the result.

Names in the built template that refer to an object path use bracket notation (`data[gcm]`, not `data.gcm`). GTM rejects a test name containing `.`, and the whole template then fails to load.

## 2. Template tests

```bash
node .agents/skills/test-gtm-template/scripts/run-template-tests.mjs \
  --container-url "https://tagmanager.google.com/#/container/accounts/6227933664/containers/229922177"
```

The script picks the workspace by name (`--workspace`, default `Default Workspace`), because each publish replaces Default Workspace with one that has a new ID. It opens a new, unsaved template in that workspace, imports `template.tpl` (or `--template <path>`), runs the Tests tab, prints the editor console, and closes without saving. It exits non-zero unless GTM reports `Executed N tests (SUCCESS)`.

- Check the test count matches the scenarios in `src/tests.yaml`.
- A test that feeds a malformed cookie logs one `JSON.parse` console error by design. Any other error is a failure.
- These tests mock GTM APIs. They cover what the template calls, not whether tags fire.

## 3. Demo site

Use this stage when a change affects consent defaults, `wait_for_update`, `fp_consent_update`, or anything else Google tags read.

| Item           | Value                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| Demo site      | https://ci-test-sites.s3-us-west-2.amazonaws.com/demos/gatekeeper/index.html |
| Freshpaint env | `ef6e2b92-1177-4298-9771-07bb5609231a` (`test-linkedin-capi`)                |
| GTM container  | `GTM-5XX3T7FC` (account `6227933664`, container `229922177`)                 |

### Publish the template to the test container

The demo site loads the live container, so the template under test must be published to it.

1. Use a workspace with no pending changes, usually Default Workspace. Publishing a workspace with other people's changes ships those too.
2. Open Templates → Freshpaint Custom Template → ⋮ → Import, choose `template.tpl`, and save.
3. Submit. The Submit dialog must list only the template. Name the version `freshpaint-gtm-template#<PR> @ <short sha>`.
4. Confirm the live container serves the change. Pick a string that only the new code contains:

   ```bash
   curl -s "https://www.googletagmanager.com/gtm.js?id=GTM-5XX3T7FC" | rg -c "<string from the change>"
   ```

Other workspaces fall behind the published version and need updating in GTM before their next publish. Tell the owner.

### Check the SDK and consent config

The demo site's Shield script loads the SDK from `https://perfalytics.com/static/js/freshpaint.js`.

- If the change depends on an unreleased `perfalytics-js` change, build that branch (`npx vite build` in `perfalytics-js`, output `build/freshpaint.iife.js`) and pass it with `--sdk`. The script swaps it in for this browser context only.
- Otherwise check the production SDK already contains what you need, e.g. `curl -s https://perfalytics.com/static/js/freshpaint.js | rg -c <identifier>`.
- Read the env's consent config before judging results. The script records it as `sdkConsentConfig` in `results.json` (from `freshpaint._consent_management_configs`). The category-to-signal mapping decides which signals "Accept all" grants, and a signal mapped to `null` stays denied.

### Capture the flow

```bash
node .agents/skills/test-gtm-template/scripts/capture-consent-flow.mjs \
  --url https://ci-test-sites.s3-us-west-2.amazonaws.com/demos/gatekeeper/index.html \
  --sdk ../perfalytics-js/build/freshpaint.iife.js --label "SDK with perfalytics-js#<PR>" \
  --out /tmp/gtm-consent-shots
```

In a fresh browser context, the script screenshots three steps: first visit, after "Accept all", and the next page view. Each screenshot has an overlay showing every signal's GTM default and update, the `fpconsent` cookie's `data.gcm`, and the number of `fp_consent_update` events. It writes the same data to `results.json`. To compare with the production SDK, run it again without `--sdk` and a different `--out`.

- Read consent state from `window.google_tag_data.ics` (`entries[signal].default` / `.update`, `waitPeriodTimedOut`), as the overlay does. `setDefaultConsentState` doesn't push to `dataLayer`, so the dataLayer can't show the defaults.
- `waitPeriodTimedOut: true` means the SDK's update arrived after `wait_for_update` and Google tags fired on the defaults.
- `--accept-selector` defaults to the banner's "Accept all" button (`#cc-main [data-role='all']`). Change it for other sites.

### Attach the screenshots to the PR

`gh` 2.103 or later uploads local images referenced in the body:

```bash
gh pr edit <PR> --body-file /tmp/gtm-consent-shots/body.md \
  --attach /tmp/gtm-consent-shots/1-first-visit.png \
  --attach /tmp/gtm-consent-shots/2-accept-all.png \
  --attach /tmp/gtm-consent-shots/3-reload.png
```

Repeat `--attach` for each file. Reference each image as `![...](./1-first-visit.png)` in `body.md`, and `gh` rewrites the reference to the uploaded asset. Ask the user before posting a comment or editing a PR description.
