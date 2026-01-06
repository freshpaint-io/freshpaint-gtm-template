import {
  EnablingCondition,
  Text,
  text,
  nonEmpty,
  simpleTable,
  radio,
  paramTable,
  select,
} from './helpers';
import { trackDestinationSelectItems } from './integration';

export const commonEventName = (enablingConditions: Array<EnablingCondition> = []): Text => {
  return text({
    name: 'commonEventName',
    displayName: 'Freshpaint Event Name',
    help: 'This will be the event name that you see in Freshpaint - it is sent to only certain destinations, including Google Analytics 4 (Proxy).',
    simpleValueType: true,
    valueValidators: [nonEmpty()],
    enablingConditions,
  });
};
export const commonEventProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonEventProperties',
    displayName: 'Event Properties',
    enablingConditions,
  });
};
export const commonUserProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonUserProperties',
    displayName: 'User Properties',
    enablingConditions,
  });
};

export const commonEventPropertiesJSONValue = (
  enablingConditions: Array<EnablingCondition> = [],
) => {
  return simpleTable({
    name: 'commonEventPropertiesJSONValue',
    displayName: 'Event Properties',
    help: 'Props named value, quantity, item_count, price, total, revenue, or num_items will be converted to numeric if possible; those named contents, products, or items will be converted to a JSON object / array if possible (keys must be quoted).',
    enablingConditions,
  });
};

export const commonEventPropsVariable = (enablingConditions: Array<EnablingCondition> = []) => {
  // This variable is either a Javascript object or a 'Google Tag: Event Settings' variable.
  // The name ga4EventPropsVariable is left over from when this was only supported for GA4.
  // For backwards compatibility, the name remains the same, but this is not GA4-specific.
  return text({
    name: 'ga4EventPropsVariable',
    displayName: 'Event Properties Variable',
    help: 'If specified, must be a variable returning an object, such as a Google Tag: Event Settings or Custom JavaScript variable, in {{varname}} format',
    simpleValueType: true,
    enablingConditions,
  });
};

// displayName and help cannot be passed in. They are overridden by the last-called instance of the function. :/
export const commonInstanceId = (enablingConditions: Array<EnablingCondition> = []) => {
  return text({
    name: 'commonInstanceId',
    displayName: 'Instance ID',
    help: 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
    simpleValueType: true,
    enablingConditions,
  });
};

export const commonGoogleAdsConversionLabel = (
  enablingConditions: Array<EnablingCondition> = [],
) => {
  return text({
    name: 'googleAdsConversionLabel',
    displayName: 'Conversion Label',
    simpleValueType: true,
    valueValidators: [nonEmpty()],
    enablingConditions,
  });
};

export const commonOptinOptOut = (enablingConditions: Array<EnablingCondition> = []) => {
  return radio({
    name: 'commonOptinOptOut',
    displayName: 'Opt-in / Opt-out',
    radioItems: [
      {
        value: 'OPTIN',
        displayValue: 'Opt-in',
        help: 'Deliver only to destination types / instances specified',
      },
      {
        value: 'OPTOUT',
        displayValue: 'Opt-out',
        help: 'Deliver to all but the destination types / instances specified',
      },
    ],
    simpleValueType: true,
    enablingConditions,
  });
};

export const commonOptinOptOutInstances = (enablingConditions: Array<EnablingCondition> = []) => {
  const destinationTypeKeySelect = select({
    name: 'param_table_key_column',
    displayName: 'Destination Type',
    macrosInSelect: false,
    selectItems: trackDestinationSelectItems,
    simpleValueType: true,
  });

  const destinationInstanceIdText = text({
    name: 'param_table_value_column',
    displayName: 'Instance ID (optional)',
    help: 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
    simpleValueType: true,
  });

  return paramTable({
    name: 'commonOptinOptOutInstances',
    displayName: 'Specific Destination Types / Instance IDs',
    help: "An Instance ID is required only when there are multiple instances configured for a destination type which supports multiple instance IDs, and you don't want to deliver to all.",
    paramTableColumns: [
      {
        param: destinationTypeKeySelect,
        isUnique: false,
      },
      {
        param: destinationInstanceIdText,
        isUnique: false,
      },
    ],
    enablingConditions,
  });
};
