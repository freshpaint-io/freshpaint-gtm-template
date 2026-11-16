import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq } from '../helpers';
import { amazonAdsEventsApiEvent } from '../integration';

export default function AmazonAdsEventsApiParams() {
  const isAmazonAdsEventsApiEvent = tagTypeEq(amazonAdsEventsApiEvent);
  const onlyForAmazonAdsEventsApi = [isAmazonAdsEventsApiEvent];

  return [
    commonEventName(onlyForAmazonAdsEventsApi),
    commonEventProperties(onlyForAmazonAdsEventsApi),
  ];
}
