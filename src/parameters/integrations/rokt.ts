import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { select, tagTypeEq } from '../helpers';
import { roktEvent } from '../integration';

export default function RoktParams() {
  const isRoktEvent = tagTypeEq(roktEvent);
  const onlyForRokt = [isRoktEvent];

  return [
    commonInstanceId(onlyForRokt),
    commonEventName(onlyForRokt),
    commonEventProperties(onlyForRokt),
  ];
}
