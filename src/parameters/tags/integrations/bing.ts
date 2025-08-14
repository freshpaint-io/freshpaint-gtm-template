import { equals, nonEmpty, select, text } from '../helpers';

export default function BingParams() {
  const isBingEvent = equals('tagType', 'bingAdsEvent');
  const onlyForBingAds = [isBingEvent];

  return [
    text({
      name: 'bingAdsInstanceName',
      displayName: 'Specific Tag ID (optional)',
      help: 'If multiple Tag IDs are configured for the Bing Ads destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Tag IDs)',
      simpleValueType: true,
      enablingConditions: onlyForBingAds,
    }),
    select({
      name: 'bingEventType',
      displayName: 'Track Type',
      help: 'Select "Page View" only when your Freshpaint Bing Ads configuration has "Automatically Send Page View Events" unchecked',
      macrosInSelect: false,
      notSetText: '-',
      valueValidators: [nonEmpty()],
      selectItems: [
        { value: 'CUSTOM_PAGE_LOAD', displayValue: 'Page View' },
        { value: 'VARIABLE_REVENUE', displayValue: 'Variable revenue for destination URL' },
        { value: 'CUSTOM', displayValue: 'Custom conversion' },
        { value: 'ecommerce', displayValue: 'Vertical: Ecommerce' },
        { value: 'hotel', displayValue: 'Vertical: Hotel' },
        { value: 'travel', displayValue: 'Vertical: Travel' },
        { value: 'userDefined', displayValue: 'Define your own' },
      ],
      simpleValueType: true,
      enablingConditions: onlyForBingAds,
    }),
  ];
}
