import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq } from '../helpers';
import { cjEvent } from '../integration';

export default function CJParams() {
  const isCJEvent = tagTypeEq(cjEvent);
  const onlyForCJ = [isCJEvent];

  return [commonEventName(onlyForCJ), commonEventProperties(onlyForCJ)];
}
