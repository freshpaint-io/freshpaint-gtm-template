import { tagTypeEq } from '../helpers';
import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { nextdoorEvent } from '../integration';

export default function NextdoorParams() {
  const isNextdoorEvent = tagTypeEq(nextdoorEvent);
  const onlyForNextdoor = [isNextdoorEvent];

  return [
    commonInstanceId(onlyForNextdoor),
    commonEventName(onlyForNextdoor),
    commonEventProperties(onlyForNextdoor),
  ];
}

