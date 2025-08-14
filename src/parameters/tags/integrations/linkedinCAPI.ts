import { commonEventName, equals, nonEmpty, simpleTable, text } from '../helpers';

export default function LinkedInCAPIParams() {
  const isLinkedInCAPIEvent = equals('tagType', 'linkedInAdsCAPIEvent');
  const onlyForLinkedInCAPI = [isLinkedInCAPIEvent];

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
    simpleTable({
      name: 'commonEventProperties',
      displayName: 'Event Properties',
      enablingConditions: onlyForLinkedInCAPI,
    }),
  ];
}
