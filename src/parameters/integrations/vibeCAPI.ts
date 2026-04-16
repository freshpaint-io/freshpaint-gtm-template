import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { vibeCAPIEvent } from '../integration';

export default function VibeCAPIParams() {
  const isVibeCAPIEvent = tagTypeEq(vibeCAPIEvent);
  const onlyForVibeCAPI = [isVibeCAPIEvent];

  return [
    commonInstanceId(onlyForVibeCAPI),
    commonEventName(onlyForVibeCAPI),
    commonEventProperties(onlyForVibeCAPI),
  ];
}
