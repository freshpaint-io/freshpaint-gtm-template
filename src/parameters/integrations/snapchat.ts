import {
  commonEventName,
  commonEventProperties,
  commonInstanceId,
  commonSelectableEventName,
} from '../common';
import { select, tagTypeEq } from '../helpers';
import { snapchatEvent } from '../integration';

export default function SnapchatParams() {
  const isSnapchatEvent = tagTypeEq(snapchatEvent);
  const onlyForSnapchat = [isSnapchatEvent];

  return [
    commonInstanceId(onlyForSnapchat),
    commonEventName(onlyForSnapchat),
    commonSelectableEventName(onlyForSnapchat),
    commonEventProperties(onlyForSnapchat),
  ];
}
