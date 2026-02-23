import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { microsoftAdsConversionsApiEvent } from '../integration';

export default function MicrosoftAdsConversionsApiParams() {
  const isMicrosoftAdsConversionsApiEvent = tagTypeEq(microsoftAdsConversionsApiEvent);
  const onlyForMicrosoftAdsConversionsApi = [isMicrosoftAdsConversionsApiEvent];

  return [
    commonInstanceId(onlyForMicrosoftAdsConversionsApi),
    commonEventName(onlyForMicrosoftAdsConversionsApi),
    commonEventProperties(onlyForMicrosoftAdsConversionsApi),
  ];
}
