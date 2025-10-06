import { commonEventName, commonEventProperties, commonInstanceName } from '../common';
import { tagTypeEq, text } from '../helpers';
import { siriusXMEvent } from '../integration';

export default function SiriusXMParams() {
  const isSiriusXMEvent = tagTypeEq(siriusXMEvent);
  const onlyForSiriusXM = [isSiriusXMEvent];

  return [
    commonInstanceName(
      'Specific Application Name (optional)',
      'If multiple Application Names are configured for the SiriusXM destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Application Names)',
      onlyForSiriusXM,
    ),
    commonEventName(onlyForSiriusXM),
    commonEventProperties(onlyForSiriusXM),
  ];
}
