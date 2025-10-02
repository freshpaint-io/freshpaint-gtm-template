import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, text } from '../helpers';
import { googleAdsConversionApiEvent } from '../integration';

export default function GoogleAdsConversionApiParams() {
  const isGoogleAdsConversionApiEvent = tagTypeEq(googleAdsConversionApiEvent);
  const onlyForGoogleAdsConversionApiEvent = [isGoogleAdsConversionApiEvent];

  return [
    text({
      name: 'googleAdsConversionApiCustomerId',
      displayName: 'Customer ID',
      help: 'Enter your Google Ads Account Customer ID. The Customer ID will be shown when logged into your google ads account above your email address. It should look similar to 123-123-1234.',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAdsConversionApiEvent,
    }),
    commonEventName(onlyForGoogleAdsConversionApiEvent),
    commonEventProperties(onlyForGoogleAdsConversionApiEvent),
  ];
}
