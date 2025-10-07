import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { mntnEvent } from '../integration';

export default function MntnParams() {
  const isMntnEvent = tagTypeEq(mntnEvent);
  const onlyForMntn = [isMntnEvent];

  return [
    commonInstanceId(onlyForMntn),
    commonEventName(onlyForMntn),
    commonEventProperties(onlyForMntn),
  ];
}
