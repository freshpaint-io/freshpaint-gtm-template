# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Template Testing

Before merging changes:
- Import the generated `template.tpl` into GTM UI
- Test functionality thoroughly  
- Verify no parsing errors on import
- Template changes won't appear if there are parsing errors

## Gallery Updates

After merging template changes to main:
- Update `metadata.yaml` with new SHA and change notes
- Check "Updated Date" at the GTM Community Template Gallery to confirm changes are live