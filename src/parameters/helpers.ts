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

/*
 * It's okay for us to set not passed args as undefined values because
 * once we JSON serialize in the build script, all keys with undefined values
 * will be removed.
 */
interface ParamArgs {
  name: string;
  displayName?: string;
  help?: string;
  simpleValueType?: boolean;
  valueValidators?: Array<any>;
  defaultValue?: string;
  notSetText?: string;
  enablingConditions?: Array<EnablingCondition>;
  subParams?: Array<Param>;
}

interface Param extends ParamArgs {
  type:
    | 'PARAM'
    | 'TEXT'
    | 'CHECKBOX'
    | 'SELECT'
    | 'GROUP'
    | 'SIMPLE_TABLE'
    | 'RADIO'
    | 'PARAM_TABLE';
}

function param(args: ParamArgs): Param {
  return {
    type: 'PARAM',
    name: args.name,
    displayName: args.displayName,
    help: args.help,
    simpleValueType: args.simpleValueType,
    valueValidators: args.valueValidators,
    defaultValue: args.defaultValue,
    notSetText: args.notSetText,
    enablingConditions: args.enablingConditions,
    subParams: args.subParams,
  };
}

interface TextArgs extends ParamArgs {}

interface Text extends Param {
  type: 'TEXT';
}

export function text(args: TextArgs): Text {
  return {
    ...param(args),
    type: 'TEXT',
  };
}

interface CheckboxArgs extends ParamArgs {
  checkboxText: string;
}

interface Checkbox extends Param {
  type: 'CHECKBOX';
  checkboxText: string;
}

export function checkbox(args: CheckboxArgs): Checkbox {
  return {
    ...param(args),
    type: 'CHECKBOX',
    checkboxText: args.checkboxText,
  };
}

type SelectableItem = {
  value: any;
  displayValue: string;
  help?: string;
  subParams?: Array<any>;
};

interface SelectArgs extends ParamArgs {
  macrosInSelect?: boolean;
  selectItems?: Array<SelectableItem>;
}

interface Select extends Param {
  type: 'SELECT';
  selectItems?: Array<SelectableItem>;
  macrosInSelect?: boolean;
}

export function select(args: SelectArgs): Select {
  return {
    ...param(args),
    type: 'SELECT',
    selectItems: args.selectItems,
    macrosInSelect: args.macrosInSelect,
  };
}

interface GroupArgs extends ParamArgs {
  groupStyle: string;
}

interface Group extends Param {
  type: 'GROUP';
  groupStyle: string;
}

export function group(args: GroupArgs): Group {
  return {
    ...param(args),
    type: 'GROUP',
    groupStyle: args.groupStyle,
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

interface SimpleTableArgs extends ParamArgs {
  newRowButtonText?: string;
}

interface SimpleTable extends Param {
  type: 'SIMPLE_TABLE';
  simpleTableColumns: Array<any>;
  newRowButtonText?: string;
}

export function simpleTable(args: SimpleTableArgs): SimpleTable {
  return {
    ...param(args),
    type: 'SIMPLE_TABLE',
    simpleTableColumns: [propertyNameTableColumn, propertyValueTableColumn],
    newRowButtonText: args.newRowButtonText,
  };
}

interface RadioArgs extends ParamArgs {
  radioItems: Array<SelectableItem>;
}

interface Radio extends Param {
  type: 'RADIO';
  radioItems: Array<SelectableItem>;
}

export function radio(args: RadioArgs): Radio {
  return {
    ...param(args),
    type: 'RADIO',
    radioItems: args.radioItems,
  };
}

type ParamTableColumn = {
  param: Param;
  isUnique: boolean;
};

interface ParamTableArgs extends ParamArgs {
  paramTableColumns: Array<ParamTableColumn>;
}

interface ParamTable extends Param {
  type: 'PARAM_TABLE';
  paramTableColumns: Array<ParamTableColumn>;
}

export function paramTable(args: ParamTableArgs): ParamTable {
  return {
    ...param(args),
    type: 'PARAM_TABLE',
    paramTableColumns: args.paramTableColumns,
  };
}
