import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { yelpCAPIEvent } from '../integration';

export default function YelpCAPIParams() {
  const isYelpCAPIEvent = tagTypeEq(yelpCAPIEvent);
  const onlyForYelpCAPI = [isYelpCAPIEvent];

  return [
    commonInstanceId(onlyForYelpCAPI),
    commonEventName(onlyForYelpCAPI),
    commonEventProperties(onlyForYelpCAPI),
  ];
}

