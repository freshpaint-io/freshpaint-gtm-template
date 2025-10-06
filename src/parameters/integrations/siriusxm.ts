import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq, text } from '../helpers';
import { siriusXMEvent } from '../integration';

export default function SiriusXMParams() {
  const isSiriusXMEvent = tagTypeEq(siriusXMEvent);
  const onlyForSiriusXM = [isSiriusXMEvent];

  return [
    commonInstanceId(onlyForSiriusXM),
    commonEventName(onlyForSiriusXM),
    commonEventProperties(onlyForSiriusXM),
  ];
}
