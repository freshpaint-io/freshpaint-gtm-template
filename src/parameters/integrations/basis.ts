import { commonEventName, commonEventProperties } from '../common';
import { basisEvent, tagTypeEq, text } from '../helpers';

export default function BasisParams() {
  const isBasisEvent = tagTypeEq(basisEvent);
  const onlyForBasis = [isBasisEvent];

  return [
    text({
      name: 'basisInstanceName',
      displayName: 'Specific Pixel ID (optional)',
      help: 'If multiple Pixel IDs are configured for the Basis destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Pixel IDs)',
      simpleValueType: true,
      enablingConditions: onlyForBasis,
    }),
    commonEventName(onlyForBasis),
    commonEventProperties(onlyForBasis),
  ];
}
