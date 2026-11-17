import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { adjustS2SEvent } from '../integration';

export default function AdjustS2SParams() {
  const isAdjustS2SEvent = tagTypeEq(adjustS2SEvent);
  const onlyForAdjustS2S = [isAdjustS2SEvent];

  return [
    commonInstanceId(onlyForAdjustS2S),
    commonEventName(onlyForAdjustS2S),
    commonEventProperties(onlyForAdjustS2S),
  ];
}
