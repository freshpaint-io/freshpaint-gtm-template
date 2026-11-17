import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { EnablingCondition, tagTypeEq, text } from '../helpers';
import { googleAdsConversionApiEvent } from '../integration';

// Also used by the Google Data Manager Conversion API tag, which reads the same ctid and ctname props.
export const googleAdsConversionId = (enablingConditions: Array<EnablingCondition>) =>
  text({
    name: 'googleAdsConversionApiConversionId',
    displayName: 'Conversion ID (ctid)',
    help: 'Enter your Google Ads Conversion ID. This is shown within Google Ads when creating a new Conversion or viewing an existing Conversion, within the "Use Google Tag Manager" section.',
    simpleValueType: true,
    enablingConditions,
  });

export const googleAdsConversionName = (enablingConditions: Array<EnablingCondition>) =>
  text({
    name: 'googleAdsConversionApiConversionName',
    displayName: 'Conversion Name (ctname)',
    help: "Enter your Conversion's Name. This is shown in the Conversion Details section within Google Ads.",
    simpleValueType: true,
    enablingConditions,
  });

export default function GoogleAdsConversionApiParams() {
  const isGoogleAdsConversionApiEvent = tagTypeEq(googleAdsConversionApiEvent);
  const onlyForGoogleAdsConversionApiEvent = [isGoogleAdsConversionApiEvent];

  return [
    commonInstanceId(onlyForGoogleAdsConversionApiEvent),
    googleAdsConversionId(onlyForGoogleAdsConversionApiEvent),
    commonEventName(onlyForGoogleAdsConversionApiEvent),
    googleAdsConversionName(onlyForGoogleAdsConversionApiEvent),
    commonEventProperties(onlyForGoogleAdsConversionApiEvent),
  ];
}
