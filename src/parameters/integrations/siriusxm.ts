import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, text } from '../helpers';
import { siriusXMEvent } from '../integration';

export default function MntnParams() {
  const isSiriusXMEvent = tagTypeEq(siriusXMEvent);
  const onlyForSiriusXM = [isSiriusXMEvent];

  return [
    text({
      name: 'siriusXMAppName',
      displayName: 'Specific Application Name (optional)',
      help: 'If multiple Application Names are configured for the SiriusXM destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Application Names)',
      simpleValueType: true,
      enablingConditions: onlyForSiriusXM,
    }),
    commonEventName(onlyForSiriusXM),
    commonEventProperties(onlyForSiriusXM),
  ];
}
