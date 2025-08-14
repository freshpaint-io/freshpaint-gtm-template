import { commonOptinOptOut, commonUserProperties } from './common';
import { equals, paramTable, select, text } from './helpers';

export default function IdentifyParams() {
  const isIdentifyTag = equals('tagType', 'identify');
  const onlyForIdentify = [isIdentifyTag];

  const destinationTypeKeySelect = select({
    name: 'param_table_key_column',
    displayName: 'Destination Type',
    macrosInSelect: false,
    selectItems: [
      { value: 'Google Analytics 4 Proxy', displayValue: 'Google Analytics 4 (Proxy)' },
      { value: 'Amplitude', displayValue: 'Amplitude' },
      { value: 'impactdotcom', displayValue: 'impact.com' },
      { value: 'Mixpanel', displayValue: 'Mixpanel' },
      { value: 'Webhooks', displayValue: 'Webhooks' },
    ],
    simpleValueType: true,
  });

  const destinationInstanceIdText = text({
    name: 'param_table_value_column',
    displayName: 'Instance ID (optional)',
    help: 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
    simpleValueType: true,
  });

  return [
    text({
      name: 'identifyIdentifier',
      displayName: 'Identifier (recommended)',
      simpleValueType: true,
      enablingConditions: onlyForIdentify,
    }),
    commonUserProperties(onlyForIdentify),
    commonOptinOptOut(onlyForIdentify),
    paramTable({
      name: 'identifyOptinOptOutInstances',
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
      enablingConditions: onlyForIdentify,
    }),
  ];
}
