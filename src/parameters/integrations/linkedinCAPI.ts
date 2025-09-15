import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, nonEmpty, text } from '../helpers';
import { linkedInAdsCAPIEvent } from '../integration';

export default function LinkedInCAPIParams() {
  const isLinkedInCAPICAPIEvent = tagTypeEq(linkedInAdsCAPIEvent);
  const onlyForLinkedInCAPI = [isLinkedInCAPICAPIEvent];

  return [
    commonEventName(onlyForLinkedInCAPI),
    text({
      name: 'linkedInAdsCAPIInstanceName',
      displayName: 'Specific Instance ID (optional)',
      help: 'If multiple instances are configured for the LinkedIn CAPI integration type, specify one to deliver to (if left blank, this event will be delivered to all configured integrations)',
      simpleValueType: true,
      enablingConditions: onlyForLinkedInCAPI,
    }),
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
