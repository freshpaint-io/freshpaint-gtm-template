type EnablingCondition = {
    paramName: string;
    paramValue: any;
    type: string;
}

export const equals = (
    paramName: string,
    paramValue: any,
): EnablingCondition => ({
    "paramName": paramName,
    "paramValue": paramValue,
    "type": "EQUALS"
});

export const nonEmpty = () => ({
    "type": "NON_EMPTY"
});

type TextArgs = {
    name: string;
    displayName: string;
    help?: string;
    simpleValueType?: boolean;
    valueValidators?: Array<any>;
    enablingConditions: Array<EnablingCondition>;
}

type TextParam = {
    type: "TEXT";
    name: string;
    displayName: string;
    enablingConditions: Array<EnablingCondition>;
    help?: string;
    simpleValueType?: boolean;
    valueValidators?: Array<any>;
}

export function text(args: TextArgs): TextParam {
    return {
        "type": "TEXT",
        name: args.name,
        displayName: args.displayName,
        help: args.help || "",
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
}

type CheckboxParam = {
    type: "CHECKBOX";
    name: string;
    checkboxText: string;
    simpleValueType?: boolean;
    help?: string;
}

export function checkbox(args: CheckboxArgs): CheckboxParam {
    return {
        "type": "CHECKBOX",
        name: args.name,
        checkboxText: args.checkboxText,
        simpleValueType: args.simpleValueType || true,
        help: args.help || "",
    };
}

type SelectArgs = {
    name: string;
    displayName: string;
    help?: string;
    macrosInSelect?: boolean;
    selectItems?: Array<{ value: string; displayValue: string; help?: string }>;
    simpleValueType?: boolean;
    enablingConditions: Array<EnablingCondition>;
}

type SelectParam = {
    type: "SELECT";
    name: string;
    displayName: string;
    help?: string;
    macrosInSelect?: boolean;
    selectItems: Array<{ value: string; displayValue: string; help?: string }>;
    simpleValueType?: boolean;
    enablingConditions: Array<EnablingCondition>;
}

export function select(args: SelectArgs): SelectParam {
    return {
        "type": "SELECT",
        name: args.name,
        displayName: args.displayName,
        help: args.help || "",
        macrosInSelect: args.macrosInSelect || false,
        selectItems: args.selectItems || [],
        simpleValueType: args.simpleValueType || true,
        enablingConditions: args.enablingConditions,
    };
}

type GroupArgs = {
    name: string;
    displayName: string;
    groupStyle: string;
    subParams?: Array<any>;
    enablingConditions: Array<EnablingCondition>;
}

type GroupParam = {
    type: "GROUP";
    name: string;
    displayName: string;
    groupStyle: string;
    enablingConditions: Array<EnablingCondition>;
    subParams: Array<any>;
}

export function group(args: GroupArgs): GroupParam {
    return {
        "type": "GROUP",
        name: args.name,
        displayName: args.displayName,
        groupStyle: args.groupStyle,
        enablingConditions: args.enablingConditions,
        subParams: args.subParams || [],
    };
}

export const commonEventName = (enablingConditions: Array<EnablingCondition> = []): TextParam => {
    return text({
        name: "commonEventName",
        displayName: "Freshpaint Event Name",
        help: "This will be the event name that you see in Freshpaint - it is sent to only certain destinations, including Google Analytics 4 (Proxy).",
        simpleValueType: true,
        valueValidators: [nonEmpty()],
        enablingConditions,
    });
}
