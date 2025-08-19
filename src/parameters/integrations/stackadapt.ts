import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, nonEmpty, text } from '../helpers';
import { stackAdaptEvent } from '../integration';

export default function StackAdaptParams() {
  const isStackAdaptEvent = tagTypeEq(stackAdaptEvent);
  const onlyForStackAdapt = [isStackAdaptEvent];

  return [
    commonEventName(onlyForStackAdapt),
    text({
      name: 'stackAdaptConversionEventID',
      displayName: 'StackAdapt Conversion Event Unique ID',
      simpleValueType: true,
      enablingConditions: onlyForStackAdapt,
      valueValidators: [nonEmpty()],
    }),
    commonEventProperties(onlyForStackAdapt),
  ];
}
