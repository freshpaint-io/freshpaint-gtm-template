import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { adMediaEvent } from '../integration';

export default function AdMediaParams() {
  const isAdMediaEvent = tagTypeEq(adMediaEvent);
  const onlyForAdMedia = [isAdMediaEvent];

  return [
    commonInstanceId(onlyForAdMedia),
    commonEventName(onlyForAdMedia),
    commonEventProperties(onlyForAdMedia),
  ];
}
