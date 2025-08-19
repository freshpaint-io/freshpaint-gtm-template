import { commonEventName } from '../common';
import { tagTypeEq, text } from '../helpers';
import { viantEvent } from '../integration';

export default function ViantParams() {
  const isViantEvent = tagTypeEq(viantEvent);
  const onlyForViant = [isViantEvent];

  return [
    text({
      name: 'viantInstanceName',
      displayName: 'Specific Advertiser ID (optional)',
      help: 'If multiple Advertiser IDs are configured for the Viant destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Advertiser IDs)',
      simpleValueType: true,
      enablingConditions: onlyForViant,
    }),
    commonEventName(onlyForViant),
  ];
}
