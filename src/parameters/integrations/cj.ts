import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { nonEmpty, tagTypeEq, text } from '../helpers';
import { cjEvent } from '../integration';

export default function CJParams() {
  const isCJEvent = tagTypeEq(cjEvent);
  const onlyForCJ = [isCJEvent];

  return [
    commonInstanceId(onlyForCJ),
    commonEventName(onlyForCJ),
    text({
      name: 'cjOrderId',
      displayName: 'order_id (required)',
      simpleValueType: true,
      enablingConditions: onlyForCJ,
      valueValidators: [nonEmpty()],
    }),
    text({
      name: 'cjValue',
      displayName: 'value (required)',
      help: 'Conversion value. Accepts total, revenue, or price from the data layer — map whichever is set.',
      simpleValueType: true,
      enablingConditions: onlyForCJ,
      valueValidators: [nonEmpty()],
    }),
    text({
      name: 'cjCurrency',
      displayName: 'currency (required)',
      simpleValueType: true,
      enablingConditions: onlyForCJ,
      valueValidators: [nonEmpty()],
    }),
    commonEventProperties(onlyForCJ),
  ];
}
