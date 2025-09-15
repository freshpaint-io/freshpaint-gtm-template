import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, text } from '../helpers';
import { snapchatEvent } from '../integration';

export default function SnapchatParams() {
  const isSnapchatEvent = tagTypeEq(snapchatEvent);
  const onlyForSnapchat = [isSnapchatEvent];

  return [
    text({
      name: 'snapchatPixelID',
      displayName: 'Pixel ID',
      simpleValueType: true,
      enablingConditions: onlyForSnapchat,
    }),
    commonEventName(onlyForSnapchat),
    commonEventProperties(onlyForSnapchat),
  ];
}
