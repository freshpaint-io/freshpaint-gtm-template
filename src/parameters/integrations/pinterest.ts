import { tagTypeEq } from '../helpers';
import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { pinterestAdsEvent } from '../integration';

export default function PinterestParams() {
  const isPinterestEvent = tagTypeEq(pinterestAdsEvent);
  const onlyForPinterest = [isPinterestEvent];

  return [
    commonInstanceId(onlyForPinterest),
    commonEventName(onlyForPinterest),
    commonEventProperties(onlyForPinterest),
  ];
}
