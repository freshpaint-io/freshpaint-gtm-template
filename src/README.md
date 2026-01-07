# How to add a new integration to the Freshpaint GTM Template

### In `./parameters/integration.ts`:

- add a `const` for the new integration event type
- add an entry to each of the following for the new event type:
  - `rootParamSelectItems`
  - `trackDestinationSelectItems`
  - `identifyDestinationSelectItems`

### Create a new file in `./parameters/integrations/`

This file will define the UI fields that the customer will need to fill for this integration event type. Referencing an existing integration file will be helpful at this step. The new file needs to default export a function that returns an array of objects.

For the integration's primary account/instance/pixel identifier, we want to use `commonInstanceId()`. While this provides a less desireable, generic name and help text, there is a limit to the maximum number of custom fields allowed in a GTM template and we are [quickly approaching that limit](https://www.notion.so/freshpaintio/RFC-GTM-Template-Number-of-UI-Fields-limit-Proposed-solution-2841ea732c1e80908320e2d5805645a1).

follow the existing conventions on ordering of the UI fields:

- if used, the common field for the instance name of the destination should come first
- if used, the common field for Freshpaint Event Name should come next
- all other destination-specific UI fields should be defined next
- if used, the common field for Event Properties should come next
- if used, the common field for User Properties should come last

**WARNING:** due to the usage of common fields and constraints imposed by GTM, the order of UI fields as defined in this file is not necessarily completely 1:1 with how they will show up in the UI. If there are any surprises when testing locally, please refer to `scripts/paramSortOrder.js` to understand the final global ordering.

### In `web.js`:

- add a case statement for the new integration in `processEvent`
- create a new custom event processer called in the conditional case statement above

### Updating `template.tpl`

Run `npm run build` to update the `template.tpl` generated file

Import the updated `template.tpl` into your own GTM account to ensure there are no errors upon import. [See the guide here](https://www.notion.so/freshpaintio/GTM-Template-Migration-Running-locally-4289e7168c694ddfb72896b2ef44512e#4289e7168c694ddfb72896b2ef44512e) for testing your GTM changes locally.
