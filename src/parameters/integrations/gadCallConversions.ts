import { commonGoogleAdsConversionLabel } from '../common';
import { text, nonEmpty, tagTypeEq } from '../helpers';
import { googleAdsCallConversionsEvent } from '../integration';

export default function gadCallConversionsParams() {
  const isGadCallConversionsEvent = tagTypeEq(googleAdsCallConversionsEvent);
  const onlyForGadCallConversions = [isGadCallConversionsEvent];

  return [
    text({
      name: 'googleAdsCallConversionsDisplayedPhoneNbr',
      displayName: 'Displayed Phone Number to Replace',
      help: 'The phone number you enter needs to have the exact digits it has on your website. For example, if the number on your website has a country code, include the country code here. If the number on your website does not have a country code, do not include the country code here.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForGadCallConversions,
    }),
    commonGoogleAdsConversionLabel(onlyForGadCallConversions),
    text({
      name: 'googleAdsCallConversionsConversionId',
      displayName: 'Conversion ID',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForGadCallConversions,
    }),
  ];
}
