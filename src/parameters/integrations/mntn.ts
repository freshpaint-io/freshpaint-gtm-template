import { commonEventName, commonEventProperties } from '../common';
import { equals, text } from '../helpers';

export default function MntnParams() {
  const isMntnEvent = equals('tagType', 'mntnEvent');
  const onlyForMntn = [isMntnEvent];

  return [
    text({
      name: 'mntnInstanceName',
      displayName: 'Specific Advertiser ID (optional)',
      help: 'If multiple Advertiser IDs are configured for the MNTN destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Advertiser IDs)',
      simpleValueType: true,
      enablingConditions: onlyForMntn,
    }),
    commonEventName(onlyForMntn),
    commonEventProperties(onlyForMntn),
  ];
}
