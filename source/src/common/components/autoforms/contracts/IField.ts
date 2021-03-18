import {
    IFieldProps,
    ISelectFieldProps,
    INumericFieldProps,
    IOverrideFieldProps,
    ITextFieldProps,
    ILookupFieldProps,
    IDatePickerFieldProps,
    DataProcessLookupConfig,
} from "../../forms/contracts";

export enum FieldType {
    string = 'string',
    number = 'number',
    enum = 'enum',
    reference = 'reference',
    boolean = 'boolean',
    date = 'date',
    array = 'array',
}

export enum FieldControl {
    text = 'text',
    materialText = 'materialText',
    textarea = 'textarea',
    number = 'number',
    dropDown = 'dropDown',
    materialDropDown = 'materialDropDown',
    lookup = 'lookup',
    switch = 'switch',
    maskedText = 'maskedText',
    datePicker = 'datePicker',
}

export enum LookupEntityType {
    productCategory = 'productCategory',
    contact = 'contact',
    brand = 'brand',
    attributeDictionaryValue = 'attributeDictionaryValue',
    multiSelectAttributeDictionaryValue = 'multiSelectAttributeDictionaryValue',
    dataProcess = 'dataProcess',
    connectedMarketplace = 'connectedMarketplace',
    marketplace = 'marketplace',
    product = 'product'
}

export enum FormColumnLayout {
    solo = 'solo',
    duet = 'duet',
    trio = 'trio'
}

export interface IFormRow {
    fields: IField[];
    columntLayout?: FormColumnLayout;
    className?: string;
}

// @ts-ignore
export interface IField extends
    IFieldProps,
    ISelectFieldProps,
    INumericFieldProps,
    IOverrideFieldProps,
    ITextFieldProps,
    ILookupFieldProps,
    IDatePickerFieldProps {

    dataProcessConfig?: DataProcessLookupConfig;
    type: FieldType;
    control?: FieldControl;
    nestedFields: IField[];
}
