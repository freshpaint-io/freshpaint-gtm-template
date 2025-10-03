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
    text({
      name: 'googleAdsConversionApiConversionId',
      displayName: 'Conversion ID (ctid)',
      help: 'Enter your Google Ads Conversion ID. This is shown within Google Ads when creating a new Conversion or viewing an existing Conversion, within the "Use Google Tag Manager" section.',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAdsConversionApiEvent,
    }),
    commonEventName(onlyForGoogleAdsConversionApiEvent),
    text({
      name: 'googleAdsConversionApiConversionName',
      displayName: 'Conversion Name (ctname)',
      help: 'Enter your Conversion\'s Name. This is shown in the Conversion Details section within Google Ads.',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAdsConversionApiEvent,
    }),
    commonEventProperties(onlyForGoogleAdsConversionApiEvent),
  ];
}
