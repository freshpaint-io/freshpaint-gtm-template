type EnablingCondition = {
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
type Param = {};

type TextArgs = {
  name: string;
  displayName: string;
  help?: string;
  simpleValueType?: boolean;
  valueValidators?: Array<any>;
  enablingConditions: Array<EnablingCondition>;
};

type TextParam = {
  type: 'TEXT';
  name: string;
  displayName: string;
  enablingConditions: Array<EnablingCondition>;
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
    enablingConditions: args.enablingConditions,
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

type SelectArgs = {
  name: string;
  displayName: string;
  help?: string;
  macrosInSelect?: boolean;
  selectItems?: Array<{ value: string; displayValue: string; help?: string }>;
  simpleValueType?: boolean;
  notSetText?: string;
  enablingConditions: Array<EnablingCondition>;
  valueValidators?: Array<any>;
};

type SelectParam = {
  type: 'SELECT';
  name: string;
  displayName: string;
  help?: string;
  macrosInSelect?: boolean;
  selectItems: Array<{ value: string; displayValue: string; help?: string }>;
  simpleValueType?: boolean;
  enablingConditions: Array<EnablingCondition>;
  notSetText?: string;
  valueValidators?: Array<any>;
};

export function select(args: SelectArgs): SelectParam {
  return {
    type: 'SELECT',
    name: args.name,
    displayName: args.displayName,
    help: args.help || '',
    macrosInSelect: args.macrosInSelect || false,
    selectItems: args.selectItems || [],
    simpleValueType: args.simpleValueType || true,
    enablingConditions: args.enablingConditions,
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

export const commonEventName = (enablingConditions: Array<EnablingCondition> = []): TextParam => {
  return text({
    name: 'commonEventName',
    displayName: 'Freshpaint Event Name',
    help: 'This will be the event name that you see in Freshpaint - it is sent to only certain destinations, including Google Analytics 4 (Proxy).',
    simpleValueType: true,
    valueValidators: [nonEmpty()],
    enablingConditions,
  });
};

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

type SimpleTableArgs = {
  name: string;
  displayName: string;
  enablingConditions: Array<EnablingCondition>;
};

export type SimpleTableParam = {
  type: 'SIMPLE_TABLE';
  name: string;
  displayName: string;
  simpleTableColumns: Array<any>;
  enablingConditions: Array<EnablingCondition>;
};

export function simpleTable(args: SimpleTableArgs): SimpleTableParam {
  return {
    type: 'SIMPLE_TABLE',
    name: args.name,
    displayName: args.displayName,
    simpleTableColumns: [propertyNameTableColumn, propertyValueTableColumn],
    enablingConditions: args.enablingConditions || [],
  };
}

export const commonEventProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonEventProperties',
    displayName: 'Event Properties',
    enablingConditions,
  });
};

export const commonUserProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonUserProperties',
    displayName: 'User Properties',
    enablingConditions,
  });
};
