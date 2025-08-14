import { EnablingCondition, TextParam, text, nonEmpty, simpleTable } from './helpers';

export const commonEventName = (enablingConditions: Array<EnablingCondition> = []): TextParam => {
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
  return text({
    name: 'commonEventPropertiesJSONValue',
    displayName: 'Event Properties',
    help: 'Props named value, quantity, item_count, price, total, revenue, or num_items will be converted to numeric if possible; those named contents, products, or items will be converted to a JSON object / array if possible (keys must be quoted).',
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
