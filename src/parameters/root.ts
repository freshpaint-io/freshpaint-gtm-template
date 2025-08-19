import { nonEmpty, select } from './helpers';
import { rootParamSelectItems } from './integration';

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
