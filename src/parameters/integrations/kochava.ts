import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { kochavaEvent } from '../integration';

export default function KochavaParams() {
  const isKochavaEvent = tagTypeEq(kochavaEvent);
  const onlyForKochava = [isKochavaEvent];

  return [
    commonInstanceId(onlyForKochava),
    commonEventName(onlyForKochava),
    commonEventProperties(onlyForKochava),
  ];
}
