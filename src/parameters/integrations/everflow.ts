import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { everflowEvent } from '../integration';

export default function EverflowParams() {
  const isEverflowEvent = tagTypeEq(everflowEvent);
  const onlyForEverflow = [isEverflowEvent];

  return [
    commonInstanceId(onlyForEverflow),
    commonEventName(onlyForEverflow),
    commonEventProperties(onlyForEverflow),
  ];
}
