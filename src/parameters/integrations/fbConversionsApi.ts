import { tagTypeEq, group, radio, select, simpleTable, text, fbPixelEvent } from '../helpers';

export default function FacebookConversionsApiParams() {
  const isFbPixelEvent = tagTypeEq(fbPixelEvent);
  const onlyForFbPixelEvent = [isFbPixelEvent];

  const standardEventSelectableItems = [
    { value: 'PageView', displayValue: 'PageView' },
    { value: 'AddPaymentInfo', displayValue: 'AddPaymentInfo' },
    { value: 'AddToCart', displayValue: 'AddToCart' },
    { value: 'AddToWishlist', displayValue: 'AddToWishlist' },
    { value: 'CompleteRegistration', displayValue: 'CompleteRegistration' },
    { value: 'Contact', displayValue: 'Contact' },
    { value: 'CustomizeProduct', displayValue: 'CustomizeProduct' },
    { value: 'Donate', displayValue: 'Donate' },
    { value: 'FindLocation', displayValue: 'FindLocation' },
    { value: 'InitiateCheckout', displayValue: 'InitiateCheckout' },
    { value: 'Lead', displayValue: 'Lead' },
    { value: 'Purchase', displayValue: 'Purchase' },
    { value: 'Schedule', displayValue: 'Schedule' },
    { value: 'Search', displayValue: 'Search' },
    { value: 'StartTrial', displayValue: 'StartTrial' },
    { value: 'SubmitApplication', displayValue: 'SubmitApplication' },
    { value: 'Subscribe', displayValue: 'Subscribe' },
    { value: 'ViewContent', displayValue: 'ViewContent' },
  ];

  const standardEventSelect = select({
    name: 'fbStandardEventName',
    simpleValueType: true,
    selectItems: standardEventSelectableItems,
    defaultValue: 'PageView',
  });

  const customEventText = text({
    name: 'fbCustomEventName',
    displayName: '',
    simpleValueType: true,
  });

  const variableEventSelect = select({
    name: 'fbVariableEventName',
    macrosInSelect: true,
    selectItems: [],
    simpleValueType: true,
  });

  const objectPropertiesSelect = select({
    name: 'fbObjectPropertiesFromVariable',
    displayName: 'Load Properties From Variable',
    macrosInSelect: true,
    selectItems: [{ value: false, displayValue: 'False' }],
    simpleValueType: true,
    help: 'You can use a variable that returns a JavaScript object with the properties you want to use. This object will be merged with any additional properties you add via the table below. Any conflicts will be resolved in favor of the properties you add to the table.',
  });

  const objectPropertiesSimpleTable = simpleTable({
    name: 'fbObjectPropertyList',
    newRowButtonText: 'Add property',
  });

  return [
    text({
      name: 'fbInstanceNames',
      displayName: 'Specific Pixel ID(s) (optional)',
      help: 'If multiple Pixel IDs are configured for the Facebook Conversions API destination type, specify one or more specific Pixel IDs to deliver to (if left blank, this event will be delivered to all configured Pixel IDs)',
      simpleValueType: true,
      enablingConditions: onlyForFbPixelEvent,
    }),
    radio({
      name: 'fbEventName',
      simpleValueType: true,
      enablingConditions: onlyForFbPixelEvent,
      radioItems: [
        {
          value: 'standard',
          displayValue: 'Standard',
          subParams: [standardEventSelect],
        },
        {
          value: 'custom',
          displayValue: 'Custom',
          subParams: [customEventText],
        },
        {
          value: 'variable',
          displayValue: 'Variable',
          subParams: [variableEventSelect],
        },
      ],
    }),
    group({
      name: 'fbGroupParams',
      displayName: 'Object Properties',
      groupStyle: 'ZIPPY_CLOSED',
      subParams: [objectPropertiesSelect, objectPropertiesSimpleTable],
      enablingConditions: onlyForFbPixelEvent,
    }),
  ];
}
