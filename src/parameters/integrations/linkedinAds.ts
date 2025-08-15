import { equals, nonEmpty, text } from '../helpers';
import { commonEventName } from '../common';

export default function LinkedInAdsParams() {
  const isLinkedInEvent = equals('tagType', 'linkedinAdsEvent');
  const onlyForLinkedIn = [isLinkedInEvent];

  return [
    commonEventName(onlyForLinkedIn),
    text({
      name: 'linkedInAdsConversionIds',
      displayName: 'Conversion ID(s) (max. 3)',
      help: 'Enter 1-3 conversion ids separated by a comma.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForLinkedIn,
    }),
  ];
}
