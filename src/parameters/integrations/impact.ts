import { tagTypeEq, nonEmpty, paramTable, radio, select, text } from '../helpers';
import { impactEvent } from '../integration';

export default function ImpactParams() {
  const isImpactEvent = tagTypeEq(impactEvent);
  const onlyForImpactEvent = [isImpactEvent];

  const otherEventsKeySelect = select({
    name: 'param_table_key_column',
    displayName: 'property',
    macrosInSelect: false,
    selectItems: [
      { value: 'amount', displayValue: 'amount' },
      { value: 'currency', displayValue: 'currency' },
      { value: 'customer_status', displayValue: 'customer_status' },
      { value: 'discount', displayValue: 'discount' },
      { value: 'email', displayValue: 'email' },
      { value: 'items', displayValue: 'items' },
      { value: 'latitude', displayValue: 'latitude' },
      { value: 'longitude', displayValue: 'longitude' },
      { value: 'order_promo_code', displayValue: 'order_promo_code' },
      { value: 'order_revenue', displayValue: 'order_revenue (amount)' },
      { value: 'order_shipping', displayValue: 'order_shipping' },
      { value: 'order_tax', displayValue: 'order_tax' },
      { value: 'text1', displayValue: 'text1' },
      { value: 'text2', displayValue: 'text2' },
      { value: 'text3', displayValue: 'text3' },
      { value: 'text4', displayValue: 'text4' },
      { value: 'text5', displayValue: 'text5' },
      { value: 'text6', displayValue: 'text6' },
      { value: 'text7', displayValue: 'text7' },
      { value: 'text8', displayValue: 'text8' },
      { value: 'text9', displayValue: 'text9' },
      { value: 'text10', displayValue: 'text10' },
    ],
    simpleValueType: true,
  });

  const otherEventsValueText = text({
    name: 'param_table_value_column',
    displayName: 'Value',
    simpleValueType: true,
  });

  return [
    radio({
      name: 'impactEventTypeIdOrCodeSelector',
      displayName: 'Use event_type_id vs. event_type_code',
      help: 'One or the other of event_type_id or event_type_code must be specified.',
      radioItems: [
        { value: 'event_type_id', displayValue: 'event_type_id' },
        { value: 'event_type_code', displayValue: 'event_type_code' },
      ],
      enablingConditions: onlyForImpactEvent,
    }),
    text({
      name: 'impactEventTypeIdOrCode',
      displayName: 'event_type_id / event_type_code (required)',
      simpleValueType: true,
      enablingConditions: onlyForImpactEvent,
      valueValidators: [nonEmpty()],
    }),
    text({
      name: 'impactOrderId',
      displayName: 'order_id (required)',
      simpleValueType: true,
      enablingConditions: onlyForImpactEvent,
      valueValidators: [nonEmpty()],
    }),
    paramTable({
      name: 'impactOtherEventParameters',
      displayName: 'Other parameters (optional)',
      paramTableColumns: [
        { param: otherEventsKeySelect, isUnique: true },
        { param: otherEventsValueText, isUnique: false },
      ],
      enablingConditions: onlyForImpactEvent,
    }),
  ];
}
