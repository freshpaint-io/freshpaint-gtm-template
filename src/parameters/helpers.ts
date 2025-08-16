export const ga4Event = 'ga4Event';
export const googleAdsEvent = 'googleAdsEvent';
export const googleAdsCallConversionsEvent = 'googleAdsCallConversionsEvent';
export const googleCM360Event = 'googleCM360Event';
export const fbPixelEvent = 'fbPixelEvent';
export const basisEvent = 'basisEvent';
export const viantEvent = 'viantEvent';
export const linkedInAdsCAPIEvent = 'linkedInAdsCAPIEvent';
export const mntnEvent = 'mntnEvent';
export const bingAdsEvent = 'bingAdsEvent';
export const impactEvent = 'impactEvent';
export const stackAdaptEvent = 'stackAdaptEvent';
export const theTradeDeskEvent = 'theTradeDeskEvent';
export const tikTokAdsEvent = 'tikTokAdsEvent';
export const pinterestAdsEvent = 'pinterestAdsEvent';
export const redditAdsEvent = 'redditAdsEvent';
export const twitterAdsEvent = 'twitterAdsEvent';
export const addEventProperties = 'addEventProperties';
export const identify = 'identify';
export const track = 'track';
export const linkedInAdsEvent = 'linkedInAdsEvent';
export const floodlightEvent = 'floodlightEvent';

export const rootParamSelectItems = [
  { value: ga4Event, displayValue: 'Google Analytics 4 (Proxy)' },
  { value: googleAdsEvent, displayValue: 'Google Ads' },
  { value: googleAdsCallConversionsEvent, displayValue: 'Google Ads Call Conversions' },
  { value: googleCM360Event, displayValue: 'Google Campaign Manager 360 Conversions API' },
  { value: fbPixelEvent, displayValue: 'Facebook Conversions API' },
  { value: basisEvent, displayValue: 'Basis' },
  { value: viantEvent, displayValue: 'Viant' },
  { value: linkedInAdsCAPIEvent, displayValue: 'LinkedIn Ads Conversions API' },
  { value: mntnEvent, displayValue: 'MNTN' },
  { value: bingAdsEvent, displayValue: 'Bing Ads' },
  { value: impactEvent, displayValue: 'impact.com' },
  { value: stackAdaptEvent, displayValue: 'StackAdapt' },
  { value: theTradeDeskEvent, displayValue: 'theTradeDesk' },
  { value: tikTokAdsEvent, displayValue: 'TikTok Ads' },
  { value: pinterestAdsEvent, displayValue: 'Pinterest Ads' },
  { value: redditAdsEvent, displayValue: 'Reddit Ads' },
  { value: twitterAdsEvent, displayValue: 'Twitter Ads' },
  { value: addEventProperties, displayValue: 'AddEventProperties' },
  { value: identify, displayValue: 'Identify' },
  { value: track, displayValue: 'Track' },
  { value: linkedInAdsEvent, displayValue: 'LinkedIn Ads' },
  {
    value: floodlightEvent,
    displayValue:
      'Floodlight - DEPRECATED - instead use Google Campaign Manager 360 Conversions API',
  },
];

export const trackDestinationSelectItems = [
  { value: 'Google Analytics 4 Proxy', displayValue: 'Google Analytics 4 (Proxy)' },
  { value: 'Google Analytics 4', displayValue: 'Google Analytics 4 (Server-Side)' },
  { value: 'Google AdWords New', displayValue: 'Google Ads' },
  { value: 'Google Ads Conversion API', displayValue: 'Google Ads Conversion API' },
  {
    value: 'Google Campaign Manager 360 Conversions API',
    displayValue: 'Google Campaign Manager 360 Conversions API',
  },
  { value: 'Facebook Conversions API', displayValue: 'Facebook Conversions API' },
  { value: 'Amplitude', displayValue: 'Amplitude' },
  { value: 'Basis', displayValue: 'Basis' },
  { value: 'Bing Ads', displayValue: 'Bing Ads' },
  { value: 'impactdotcom', displayValue: 'impact.com' },
  { value: 'LinkedIn Ads Conversions API', displayValue: 'LinkedIn Ads Conversions API' },
  { value: 'MNTN', displayValue: 'MNTN' },
  { value: 'Mixpanel', displayValue: 'Mixpanel' },
  { value: 'StackAdapt', displayValue: 'StackAdapt' },
  { value: 'theTradeDesk', displayValue: 'theTradeDesk' },
  { value: 'TikTok Ads', displayValue: 'TikTok Ads' },
  { value: 'reddit-ads', displayValue: 'Reddit Ads' },
  { value: 'pinterest-ads', displayValue: 'Pinterest Ads' },
  { value: 'Twitter Ads', displayValue: 'Twitter Ads' },
  { value: 'viant', displayValue: 'Viant' },
  { value: 'Webhooks', displayValue: 'Webhooks' },
  { value: 'linkedin-ads', displayValue: 'LinkedIn Ads' },
  {
    value: 'Floodlight',
    displayValue:
      'Floodlight - DEPRECATED - instead use Google Campaign Manager 360 Conversions API',
  },
];

export const identifyDestinationSelectItems = [
  { value: 'Google Analytics 4 Proxy', displayValue: 'Google Analytics 4 (Proxy)' },
  { value: 'Amplitude', displayValue: 'Amplitude' },
  { value: 'impactdotcom', displayValue: 'impact.com' },
  { value: 'Mixpanel', displayValue: 'Mixpanel' },
  { value: 'Webhooks', displayValue: 'Webhooks' },
];

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

export const tagTypeEq = (tagType: string) => equals('tagType', tagType);

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
    | 'PARAM_TABLE'
    | 'LABEL';
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

export interface TextArgs extends ParamArgs {}

export interface Text extends Param {
  type: 'TEXT';
}

export function text(args: TextArgs): Text {
  return {
    ...param(args),
    type: 'TEXT',
  };
}

export interface CheckboxArgs extends ParamArgs {
  checkboxText: string;
}

export interface Checkbox extends Param {
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

export type SelectableItem = {
  value: any;
  displayValue: string;
  help?: string;
  subParams?: Array<any>;
};

export interface SelectArgs extends ParamArgs {
  macrosInSelect?: boolean;
  selectItems?: Array<SelectableItem>;
}

export interface Select extends Param {
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

export interface GroupArgs extends ParamArgs {
  groupStyle: string;
}

export interface Group extends Param {
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

export const propertyNameTableColumn = {
  defaultValue: '',
  displayName: 'Property Name',
  name: 'name',
  type: 'TEXT',
};

export const propertyValueTableColumn = {
  defaultValue: '',
  displayName: 'Property Value',
  name: 'value',
  type: 'TEXT',
};

export interface SimpleTableArgs extends ParamArgs {
  newRowButtonText?: string;
}

export interface SimpleTable extends Param {
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

export interface RadioArgs extends ParamArgs {
  radioItems: Array<SelectableItem>;
}

export interface Radio extends Param {
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

export type ParamTableColumn = {
  param: Param;
  isUnique: boolean;
};

export interface ParamTableArgs extends ParamArgs {
  paramTableColumns: Array<ParamTableColumn>;
}

export interface ParamTable extends Param {
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
