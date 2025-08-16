import { commonEventName, commonEventProperties } from '../common';
import { linkedInAdsCAPIEvent, tagTypeEq, nonEmpty, text } from '../helpers';

export default function LinkedInCAPIParams() {
  const isLinkedInCAPICAPIEvent = tagTypeEq(linkedInAdsCAPIEvent);
  const onlyForLinkedInCAPI = [isLinkedInCAPICAPIEvent];

  return [
    commonEventName(onlyForLinkedInCAPI),
    text({
      name: 'linkedInAdsCAPIConversionIds',
      displayName: 'Conversion ID(s) (max. 3)',
      help: 'Enter 1-3 conversion ids separated by a comma.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForLinkedInCAPI,
    }),
    commonEventProperties(onlyForLinkedInCAPI),
  ];
}
