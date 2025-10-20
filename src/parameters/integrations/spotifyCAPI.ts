import {
  commonEventName,
  commonEventProperties,
  commonInstanceId,
  commonSelectableEventName,
} from '../common';
import { select, tagTypeEq } from '../helpers';
import { spotifyCAPIEvent } from '../integration';

export default function SpotifyCAPIParams() {
  const isSpotifyCAPIEvent = tagTypeEq(spotifyCAPIEvent);
  const onlyForSpotifyCAPI = [isSpotifyCAPIEvent];

  return [
    commonInstanceId(onlyForSpotifyCAPI),
    commonEventName(onlyForSpotifyCAPI),
    commonSelectableEventName(onlyForSpotifyCAPI),
    commonEventProperties(onlyForSpotifyCAPI),
  ];
}
