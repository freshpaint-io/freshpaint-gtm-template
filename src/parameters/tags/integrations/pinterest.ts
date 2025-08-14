import { commonEventName, commonEventProperties, equals, text } from '../helpers';

export default function PinterestParams() {
  const isPinterestEvent = equals('tagType', 'pinterestAdsEvent');
  const onlyForPinterest = [isPinterestEvent];

  return [
    text({
      name: 'pinterestAdsInstanceName',
      displayName: 'Pinterest Ad Account ID (optional)',
      help: 'If multiple Pinterest Ad Account IDs are configured for the Pinterest Ads destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Pinterest Ad Account IDs)',
      simpleValueType: true,
      enablingConditions: onlyForPinterest,
    }),
    commonEventName(onlyForPinterest),
    commonEventProperties(onlyForPinterest),
  ];
}
