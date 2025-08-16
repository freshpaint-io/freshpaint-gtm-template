import { commonEventName, commonGoogleAdsConversionLabel } from '../common';
import { checkbox, equals, googleAdsEvent, tagTypeEq, group, select, text } from '../helpers';

export default function GoogleAdsParams() {
  const isGoogleAdsEvent = tagTypeEq(googleAdsEvent);
  const onlyForGoogleAds = [isGoogleAdsEvent];

  const enhancedConversionsCheckbox = checkbox({
    name: 'googleAdsEnhancedConversionsCheckbox',
    checkboxText: 'Include user-provided data from your website',
    simpleValueType: true,
    help: 'Improve measurement and get more insights with data people provide to your website. You will need to agree to the user-provided data terms and policies in your Google Ads account first.',
  });

  const enhancedConversionsSelect = select({
    name: 'googleAdsEnhancedConversionsUserDataVariable',
    displayName: 'User-provided Data Variable',
    help: "The selected variable should be of type 'User-Provided Data'",
    macrosInSelect: true,
    selectItems: [],
    simpleValueType: true,
    enablingConditions: [equals('googleAdsEnhancedConversionsCheckbox', true)],
  });

  return [
    text({
      name: 'googleAdsInstanceName',
      displayName: 'Specific Conversion ID (optional)',
      help: 'If multiple Conversion IDs are configured for the Google Ads destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Conversion IDs)',
      simpleValueType: true,
      valueValidators: [],
      enablingConditions: onlyForGoogleAds,
    }),
    commonEventName(onlyForGoogleAds),
    commonGoogleAdsConversionLabel(onlyForGoogleAds),
    text({
      name: 'googleAdsConversionValue',
      displayName: 'Conversion Value (optional)',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAds,
    }),
    text({
      name: 'googleAdsOrderId',
      displayName: 'Transaction ID (optional)',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAds,
    }),
    text({
      name: 'googleAdsCurrencyCode',
      displayName: 'Currency Code (optional)',
      simpleValueType: true,
      enablingConditions: onlyForGoogleAds,
    }),
    group({
      name: 'googleAdsEnhancedConversionsGroup',
      displayName: 'Enhanced Conversions',
      groupStyle: 'ZIPPY_CLOSED',
      enablingConditions: onlyForGoogleAds,
      subParams: [enhancedConversionsCheckbox, enhancedConversionsSelect],
    }),
  ];
}
