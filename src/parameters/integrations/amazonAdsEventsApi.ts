import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { amazonAdsEventsApiEvent } from '../integration';

export default function AmazonAdsEventsApiParams() {
  const isAmazonAdsEventsApiEvent = tagTypeEq(amazonAdsEventsApiEvent);
  const onlyForAmazonAdsEventsApi = [isAmazonAdsEventsApiEvent];

  return [
    commonInstanceId(onlyForAmazonAdsEventsApi),
    commonEventName(onlyForAmazonAdsEventsApi),
    commonEventProperties(onlyForAmazonAdsEventsApi),
  ];
}
