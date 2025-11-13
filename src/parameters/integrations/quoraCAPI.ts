import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { quoraCAPIEvent } from '../integration';

export default function QuoraParams() {
  const isQuoraEvent = tagTypeEq(quoraCAPIEvent);
  const onlyForQuora = [isQuoraEvent];

  return [
    commonInstanceId(onlyForQuora),
    commonEventName(onlyForQuora),
    commonEventProperties(onlyForQuora),
  ];
}

