import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { tatariEvent } from '../integration';

export default function TatariParams() {
  const isTatariEvent = tagTypeEq(tatariEvent);
  const onlyForTatari = [isTatariEvent];

  return [
    commonInstanceId(onlyForTatari),
    commonEventName(onlyForTatari),
    commonEventProperties(onlyForTatari),
  ];
}
