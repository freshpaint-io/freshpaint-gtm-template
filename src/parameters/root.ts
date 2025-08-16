import { nonEmpty, rootParamSelectItems, select } from './helpers';

export default function rootParams() {
  return [
    select({
      name: 'tagType',
      displayName: 'Freshpaint Tag Type',
      macrosInSelect: false,
      selectItems: rootParamSelectItems,
      notSetText: '-',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: [],
    }),
  ];
}
