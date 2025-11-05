---
description: Add a new integration to the Freshpaint GTM Template
input: prompt
prompt: |
  What is the integration name? (e.g., "Nextdoor", "Meta Ads")
  What is the commonInstanceId name for logging)
---

# Add New Integration

See @src/README.md for full details. This command will:

1. Ask for integration details (display name, SDK key, required fields)
2. Update `src/parameters/integration.ts` (add constant and select items)
3. Create `src/parameters/integrations/{name}.ts` (use `commonInstanceId()`, reference existing integrations)
4. Update `src/web.js` (add case statement and processor function). Make sure to use the proper commonInstanceId for the log message.
5. Run `npm run build` to regenerate `template.tpl`
6. Print post-run instructions

Reference similar integrations: `basis.ts`, `snapchat.ts`, `spotifyCAPI.ts`

Unless specified otherwise, the implementation should use only common properties like `spotifyCAPI.ts`.

# Post-run instructions

After running `npm run build`, you can test your `template.tpl` changes by importing the updated template into your GTM account. See [Testing GTM template changes locally](https://www.notion.so/freshpaintio/Testing-GTM-template-changes-locally-2731ea732c1e803e9bcccb3fc075f71e) for detailed instructions.
