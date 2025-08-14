import { commonEventName, commonEventProperties, equals, nonEmpty, text } from '../helpers';

export default function StackAdaptParams() {
  const isStackAdaptEvent = equals('tagType', 'stackAdaptEvent');
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
