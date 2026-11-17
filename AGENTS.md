# AGENTS.md

This file is the source of truth for coding agents working in this repository. `CLAUDE.md` is a symlink to it.

## Project Overview

This is the Freshpaint Google Tag Manager (GTM) Template repository. The template enables sending events to Freshpaint and various server-side destinations including Facebook Conversions API, Google Ads, TikTok Ads, and 20+ other advertising platforms.

## Development Commands

### Build Commands

- `npm run build` - Full build process (builds parameters then template)
- `npm run build:params` - Build parameters only from TypeScript sources
- `npm run build:test` - Build and run diff test to compare changes

### Code Formatting

- `npm run format` - Format code with Prettier

## Architecture

### File Structure

- `src/` - Source files that generate the final template
- `template.tpl` - Generated GTM template file (DO NOT edit directly)
- `metadata.yaml` - Gallery metadata for GTM Community Template Gallery

### Key Source Files

- `src/web.js` - Main template logic with event processing
- `src/parameters/` - TypeScript files defining template UI parameters
- `src/permissions.json` - GTM template permissions
- `src/metadata.json` - Template metadata
- `src/terms.md` - Terms of service

### Build Process

The build system compiles TypeScript parameter definitions into JSON and assembles multiple source files into the final `template.tpl`:

1. `npm run build:params` compiles TypeScript files from `src/parameters/` into `src/generatedParameters.json`
2. `npm run build` combines sections in this order:
   - Terms of service (`terms.md`)
   - Template metadata (`metadata.json`)
   - Generated parameters (`generatedParameters.json`)
   - Web template code (`web.js`)
   - Permissions (`permissions.json`)
   - Template tests (`tests.yaml`)

### Parameter System

Parameters are modular TypeScript files that define the GTM template UI:

- `src/parameters/root.ts` - Root event type selection
- `src/parameters/track.ts` - Track event parameters
- `src/parameters/identify.ts` - Identify event parameters
- `src/parameters/addEventProperties.ts` - Event properties parameters
- `src/parameters/integrations/` - Individual destination parameter definitions
- `src/parameters/integration.ts` - Central registry of all integration event types
- `src/parameters/common.ts` - Shared parameter definitions
- `src/parameters/helpers.ts` - Parameter builder utilities

## Adding New Integrations

To add a new destination integration:

1. **Define event type** in `src/parameters/integration.ts`:
   - Add const for new integration event type
   - Add entries to `rootParamSelectItems`, `trackDestinationSelectItems`, and `identifyDestinationSelectItems`

2. **Create parameter definition** in `src/parameters/integrations/[name].ts`:
   - Export default function returning array of parameter objects
   - Follow field ordering convention: instance name → Freshpaint event name → destination-specific fields → event properties → user properties
   - Use common fields from `src/parameters/common.ts`

3. **Add event processing** in `src/web.js`:
   - Add case statement in `processEvent` function
   - Implement custom event processor function

4. **Build template**: Run `npm run build`

A new destination also needs changes in `perfalytics` and sometimes `perfalytics-js` before the GTM tag works. See "Other repositories" in `src/README.md`.

## Template Testing

Before merging changes:

- Import the generated `template.tpl` into GTM UI
- Run the scenarios from `src/tests.yaml` in the template editor's Tests tab. They only run in GTM's sandbox; there is no local runner.
- Test functionality thoroughly
- Verify no parsing errors on import
- Template changes won't appear if there are parsing errors

### Naming in the built template

Use bracket notation, never dot notation, when a name in the built template refers to an object path. For example, name a test `cookie without data[gcm]`, not `cookie without data.gcm`. GTM rejects a test name that contains `.`, and the whole template fails to load in the editor.

## Gallery Updates

After merging template changes to main:

- Update `metadata.yaml` with new SHA and change notes
- Check "Updated Date" at the GTM Community Template Gallery to confirm changes are live
