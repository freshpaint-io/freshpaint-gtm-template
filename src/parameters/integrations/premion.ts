import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { premionEvent } from '../integration';

export default function PremionParams() {
  const isPremionEvent = tagTypeEq(premionEvent);
  const onlyForPremion = [isPremionEvent];

  return [
    commonInstanceId(onlyForPremion),
    commonEventName(onlyForPremion),
    commonEventProperties(onlyForPremion),
  ];
}
