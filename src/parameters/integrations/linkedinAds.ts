import { tagTypeEq, nonEmpty, text } from '../helpers';
import { commonEventName } from '../common';
import { linkedInAdsEvent } from '../integration';

export default function LinkedInAdsParams() {
  const isLinkedInEvent = tagTypeEq(linkedInAdsEvent);
  const onlyForLinkedIn = [isLinkedInEvent];

  return [
    commonEventName(onlyForLinkedIn),
    text({
      name: 'linkedInAdsConversionIds',
      displayName: 'Deprecated: Conversion ID(s) (max. 3)',
      help: 'This integration is deprecated and will be removed in future versions. Please update to LinkedInCAPI tag and use the linkedInAdsCAPIConversionIds property instead.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForLinkedIn,
    }),
  ];
}
