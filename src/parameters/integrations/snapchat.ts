import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, text } from '../helpers';
import { snapchatEvent } from '../integration';

export default function SnapchatParams() {
  const isSnapchatEvent = tagTypeEq(snapchatEvent);
  const onlyForSnapchat = [isSnapchatEvent];

  return [
    text({
      name: 'snapchatInstanceName',
      displayName: 'Pixel ID',
      help: 'If multiple Pixel IDs are configured for the Snapchat destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Pixel IDs)',
      simpleValueType: true,
      enablingConditions: onlyForSnapchat,
    }),
    commonEventName(onlyForSnapchat),
    commonEventProperties(onlyForSnapchat),
  ];
}
