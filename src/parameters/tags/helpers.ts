// TODO:
// event names should be consts here

export type EnablingCondition = {
  paramName: string;
  paramValue: any;
  type: string;
};

export const equals = (paramName: string, paramValue: any): EnablingCondition => ({
  paramName: paramName,
  paramValue: paramValue,
  type: 'EQUALS',
});

export const nonEmpty = () => ({
  type: 'NON_EMPTY',
});

// TODO: fill this out to DRY up the param types
type Param = any;

type TextArgs = {
  name: string;
  displayName: string;
  help?: string;
  simpleValueType?: boolean;
  valueValidators?: Array<any>;
  enablingConditions?: Array<EnablingCondition>;
};

export type TextParam = {
  type: 'TEXT';
  name: string;
  displayName: string;
  enablingConditions?: Array<EnablingCondition>;
  help?: string;
  simpleValueType?: boolean;
  valueValidators?: Array<any>;
};

export function text(args: TextArgs): TextParam {
  return {
    type: 'TEXT',
    name: args.name,
    displayName: args.displayName,
    help: args.help || '',
    simpleValueType: args.simpleValueType || true,
    valueValidators: args.valueValidators || [],
    enablingConditions: args.enablingConditions || [],
  };
}

type CheckboxArgs = {
  name: string;
  checkboxText: string;
  simpleValueType?: boolean;
  help?: string;
};

type CheckboxParam = {
  type: 'CHECKBOX';
  name: string;
  checkboxText: string;
  simpleValueType?: boolean;
  help?: string;
};

export function checkbox(args: CheckboxArgs): CheckboxParam {
  return {
    type: 'CHECKBOX',
    name: args.name,
    checkboxText: args.checkboxText,
    simpleValueType: args.simpleValueType || true,
    help: args.help || '',
  };
}

type SelectableItem = {
  value: any;
  displayValue: string;
  help?: string;
  subParams?: Array<any>;
};

type SelectArgs = {
  name: string;
  displayName?: string;
  help?: string;
  macrosInSelect?: boolean;
  selectItems?: Array<SelectableItem>;
  simpleValueType?: boolean;
  notSetText?: string;
  defaultValue?: string;
  enablingConditions?: Array<EnablingCondition>;
  valueValidators?: Array<any>;
};

type SelectParam = {
  type: 'SELECT';
  name: string;
  displayName?: string;
  help?: string;
  macrosInSelect?: boolean;
  selectItems: Array<SelectableItem>;
  simpleValueType?: boolean;
  enablingConditions?: Array<EnablingCondition>;
  defaultValue?: string;
  notSetText?: string;
  valueValidators?: Array<any>;
};

export function select(args: SelectArgs): SelectParam {
  return {
    type: 'SELECT',
    name: args.name,
    displayName: args.displayName || '',
    help: args.help || '',
    macrosInSelect: args.macrosInSelect || false,
    selectItems: args.selectItems || [],
    simpleValueType: args.simpleValueType || true,
    defaultValue: args.defaultValue || '',
    enablingConditions: args.enablingConditions || [],
    notSetText: args.notSetText || '-',
    valueValidators: args.valueValidators || [],
  };
}

type GroupArgs = {
  name: string;
  displayName: string;
  groupStyle: string;
  subParams?: Array<any>;
  enablingConditions: Array<EnablingCondition>;
};

type GroupParam = {
  type: 'GROUP';
  name: string;
  displayName: string;
  groupStyle: string;
  enablingConditions: Array<EnablingCondition>;
  subParams: Array<any>;
};

export function group(args: GroupArgs): GroupParam {
  return {
    type: 'GROUP',
    name: args.name,
    displayName: args.displayName,
    groupStyle: args.groupStyle,
    enablingConditions: args.enablingConditions,
    subParams: args.subParams || [],
  };
}

const propertyNameTableColumn = {
  defaultValue: '',
  displayName: 'Property Name',
  name: 'name',
  type: 'TEXT',
};

const propertyValueTableColumn = {
  defaultValue: '',
  displayName: 'Property Value',
  name: 'value',
  type: 'TEXT',
};

// todo: search how many times we are calling this simpleTable helper
// and passing in the same name/ display name

type SimpleTableArgs = {
  name: string;
  displayName?: string;
  help?: string;
  enablingConditions?: Array<EnablingCondition>;
  newRowButtonText?: string;
};

export type SimpleTableParam = {
  type: 'SIMPLE_TABLE';
  name: string;
  displayName?: string;
  help?: string;
  simpleTableColumns: Array<any>;
  enablingConditions?: Array<EnablingCondition>;
  newRowButtonText?: string;
};

export function simpleTable(args: SimpleTableArgs): SimpleTableParam {
  return {
    type: 'SIMPLE_TABLE',
    name: args.name,
    displayName: args.displayName || '',
    help: args.help || '',
    simpleTableColumns: [propertyNameTableColumn, propertyValueTableColumn],
    enablingConditions: args.enablingConditions || [],
    newRowButtonText: args.newRowButtonText || '',
  };
}

type RadioArgs = {
  name: string;
  displayName: string;
  help?: string;
  simpleValueType?: boolean;
  radioItems: Array<SelectableItem>;
  enablingConditions: Array<EnablingCondition>;
};

type RadioParam = {
  type: 'RADIO';
  name: string;
  displayName: string;
  help?: string;
  simpleValueType?: boolean;
  radioItems: Array<SelectableItem>;
  enablingConditions: Array<EnablingCondition>;
};

export function radio(args: RadioArgs): RadioParam {
  return {
    type: 'RADIO',
    name: args.name,
    displayName: args.displayName,
    help: args.help || '',
    simpleValueType: args.simpleValueType || true,
    radioItems: args.radioItems,
    enablingConditions: args.enablingConditions,
  };
}

type ParamTableColumn = {
  param: Param;
  isUnique: boolean;
};

type ParamTableArgs = {
  name: string;
  displayName: string;
  help?: string;
  paramTableColumns: Array<ParamTableColumn>;
  enablingConditions: Array<EnablingCondition>;
};

type ParamTableParam = {
  type: 'PARAM_TABLE';
  name: string;
  displayName: string;
  help?: string;
  paramTableColumns: Array<ParamTableColumn>;
  enablingConditions: Array<EnablingCondition>;
};
export function paramTable(args: ParamTableArgs): ParamTableParam {
  return {
    type: 'PARAM_TABLE',
    name: args.name,
    displayName: args.displayName,
    help: args.help || '',
    paramTableColumns: args.paramTableColumns,
    enablingConditions: args.enablingConditions,
  };
}
