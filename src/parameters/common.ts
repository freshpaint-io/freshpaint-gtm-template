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

export const commonInstanceName = (
  displayName: string,
  help: string = 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
  enablingConditions: Array<EnablingCondition> = [],
) => {
  return text({
    name: 'commonInstanceName',
    displayName,
    help,
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
