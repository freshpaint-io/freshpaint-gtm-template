import { commonEventName } from '../common';
import { checkbox, equals, group, nonEmpty, paramTable, radio, select, text } from '../helpers';

export default function LinkedInAdsParams() {
  const isFloodlightEvent = equals('tagType', 'floodlightEvent');
  const onlyForFloodlight = [isFloodlightEvent];

  const customVariableKeySelect = select({
    name: 'key',
    displayName: 'Key',
    macrosInSelect: false,
    selectItems: [
      { value: 'u1', displayValue: 'u1' },
      { value: 'u2', displayValue: 'u2' },
    ],
    simpleValueType: true,
  });

  const customVariableValueText = text({
    name: 'value',
    displayName: 'Value',
    simpleValueType: true,
  });

  const enhancedConversionsCheckbox = checkbox({
    name: 'floodlightEnhancedConversionsCheckbox',
    checkboxText: 'Include user-provided data from your website',
    simpleValueType: true,
    help: 'User-provided data allows you to improve the accuracy of your measurement by sending hashed first party user-provided data from your website. You will need to agree to the user-provided data terms and policies in your Search Ads 360 account first.',
  });

  const enhancedConversionsSelect = select({
    name: 'floodlightEnhancedConversionsUserDataVariable',
    displayName: 'User-provided Data Variable',
    help: 'The selected variable should be of type "User-Provided Data"',
    macrosInSelect: true,
    selectItems: [],
    simpleValueType: true,
    enablingConditions: [equals('floodlightEnhancedConversionsCheckbox', true)],
  });

  return [
    text({
      name: 'floodlightInstanceName',
      displayName: 'Specific Advertiser ID (optional)',
      help: 'If multiple Advertiser IDs are configured for the Floodlight destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Advertiser IDs)',
      simpleValueType: true,
      enablingConditions: onlyForFloodlight,
    }),
    commonEventName(onlyForFloodlight),
    text({
      name: 'floodlightGroupTagString',
      displayName: 'Group Tag String',
      help: 'This is the value of the "type=" parameter.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForFloodlight,
    }),
    text({
      name: 'floodlightActivityTagString',
      displayName: 'Activity Tag String',
      help: 'This is the value of the "cat=" parameter.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForFloodlight,
    }),
    radio({
      name: 'floodlightCountingMethod',
      displayName: 'Counting Method',
      radioItems: [
        { value: 'STANDARD', displayValue: 'Standard', help: 'Count every conversion.' },
        {
          value: 'UNIQUE',
          displayValue: 'Unique',
          help: 'Count the first conversion for each unique user during each 24-hour day, from midnight to midnight, Eastern Time (US).',
        },
        {
          value: 'SESSION',
          displayValue: 'Per Session',
          help: 'Count one conversion per user per session. Session length is set by the site where the Floodlight tag is deployed.',
        },
      ],
      simpleValueType: true,
      enablingConditions: onlyForFloodlight,
    }),
    paramTable({
      name: 'floodlightCustomVariables',
      displayName: 'Custom Variables',
      help: 'Floodlight custom variables are key-value pairs that can be used to track data that you collect about your users, for example the genre of movie that a user purchases. The keys are of the format "u1=", "u2=", etc.',
      paramTableColumns: [
        { param: customVariableKeySelect, isUnique: true },
        { param: customVariableValueText, isUnique: false },
      ],
      enablingConditions: onlyForFloodlight,
    }),
    group({
      name: 'floodlightEnhancedConversionsGroup',
      displayName: 'Enhanced Conversions',
      groupStyle: 'ZIPPY_CLOSED',
      enablingConditions: onlyForFloodlight,
      subParams: [enhancedConversionsCheckbox, enhancedConversionsSelect],
    }),
  ];
}
