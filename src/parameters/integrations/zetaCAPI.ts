import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { zetaCAPIEvent } from '../integration';

export default function ZetaCAPIParams() {
  const isZetaCAPIEvent = tagTypeEq(zetaCAPIEvent);
  const onlyForZetaCAPI = [isZetaCAPIEvent];

  return [
    commonInstanceId(onlyForZetaCAPI),
    commonEventName(onlyForZetaCAPI),
    commonEventProperties(onlyForZetaCAPI),
  ];
}
