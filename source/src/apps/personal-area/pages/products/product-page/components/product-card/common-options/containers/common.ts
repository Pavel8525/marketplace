import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    FieldType,
    IField,
    IFormRow,
    FieldControl,
    RequiredField,
    MaxLengthLongField,
    FormColumnLayout,
    LookupEntityType,
    MaxLengthVeryLongField
} from "app/common/components";
import i18n from "app/common/core/translation/i18n";
import { IOverrideProduct } from "app/common/core/api/proxy-ext";
import { Bantikom } from "app/common/core/api/proxy";
import {
    Clear,
    Fetch,
    IFetchState,
    InvokeSpecificUrl
} from "app/common/core/data";
import {
    ISingleODataResponse
} from "app/common/core/api/contracts/odata-response";
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';
import { IStoreState } from "app/common/core";

import {
    IStateProps,
    IDispatchProps,
    CommonOptionsForm,
    IOwnProps
} from "../components/CommonOptionsForm";
import {
    productCardFetchReducerCreator,
    productCardStoreReducerCreator
} from "../../common";

const getOverrideFormRows = (
    item: IOverrideProduct,
    marketPlaceKind: Bantikom.MarketplaceKind,
    product: IFetchState<ISingleODataResponse<Bantikom.Product>>
): IFormRow[] => {

    const formRows = [
        {
            fields: [
                {
                    name: 'OverrideName',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Name',
                    label: i18n.t('product:card.common-options-form.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField],
                    disabled: !(item && item.OverrideName)
                } as IField
            ],
            columntLayout: FormColumnLayout.solo,
            className: 'override-field'
        },
        {
            fields: [
                {
                    name: 'VendorCode',
                    label: i18n.t('product:card.common-options-form.form.vendor-code'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    disabled: true
                } as IField,
                {
                    name: 'ExtVendorCode',
                    label: i18n.t('product:card.common-options-form.form.ext-vendor-code'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthLongField],
                    disabled: true
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'OverrideCategoryId',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'CategoryId',
                    valueName: 'Category',
                    label: i18n.t('product:card.common-options-form.form.category'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.productCategory,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    validate: item && item.OverrideCategoryId === false && product.data && product.data.item.CategoryId === null ? [] : [RequiredField],
                    initFilter: { MarketPlaceKind: marketPlaceKind },
                    disabled: !(item && item.OverrideCategoryId)
                } as IField,
                {
                    name: 'OverrideBrandId',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'BrandId',
                    valueName: 'Brand',
                    label: i18n.t('product:card.common-options-form.form.brand'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.brand,
                    textField: "Name",
                    keyField: "Id",
                    disabled: !(item && item.OverrideBrandId)
                } as IField
            ],
            columntLayout: FormColumnLayout.trio,
            className: 'override-field'
        },
        {
            fields: [
                {
                    name: 'OverrideWeight',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Weight',
                    label: i18n.t('product:card.common-options-form.form.weight'),
                    type: FieldType.number,
                    min: 1,
                    max: 10000000,
                    formatNumber: "n",
                    disabled: !(item && item.OverrideWeight)
                } as IField
            ],
            columntLayout: FormColumnLayout.trio,
            className: 'override-field'
        },
        {
            fields: [
                {
                    name: 'OverrideLong',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Long',
                    label: i18n.t('product:card.common-options-form.form.long'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n",
                    disabled: !(item && item.OverrideLong)
                } as IField,
                {
                    name: 'OverrideWidth',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Width',
                    label: i18n.t('product:card.common-options-form.form.width'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n",
                    disabled: !(item && item.OverrideWidth)
                } as IField,
                {
                    name: 'OverrideHeight',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Height',
                    label: i18n.t('product:card.common-options-form.form.height'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n",
                    disabled: !(item && item.OverrideHeight)
                } as IField
            ],
            columntLayout: FormColumnLayout.trio,
            className: 'override-field'
        },
        {
            fields: [
                {
                    name: 'OverrideDescription',
                    type: FieldType.boolean,
                    fieldContainerClassName: "override-field-switch",
                    clearContainerClass: true
                } as IField,
                {
                    name: 'Description',
                    label: i18n.t('product:card.common-options-form.form.description'),
                    type: FieldType.string,
                    control: FieldControl.textarea,
                    validate: [MaxLengthVeryLongField],
                    disabled: !(item && item.OverrideDescription)
                } as IField
            ],
            columntLayout: FormColumnLayout.solo,
            className: 'override-field'
        }
    ];

    return formRows;
}

const createCommonOptionsForm = (formName: string, marketplaceKind: Bantikom.MarketplaceKind) => {
    const getKey = (operation: string, itemId: string) => `${operation}:${marketplaceKind}:${itemId}`;

    const ConnectedForm = connect<IStateProps, IDispatchProps>(
        (state: IStoreState, props: IOwnProps) => {
            const formItem = state.form[formName] && state.form[formName].values;
            const reducerKey = getKey('fetch', props.itemId);
            const itemState = state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).fetchReducer;

            return {
                itemState,
                rows: getOverrideFormRows(formItem, marketplaceKind, itemState)
            };
        },
        (dispatch: any, props: IOwnProps): IDispatchProps => {
            const reducerKey = getKey('fetch', props.itemId);

            return {
                fetchProductItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).fetch as Fetch<{}>, dispatch),
                saveItem: bindActionCreators(getOrAddAsyncReducer(getKey('invoke', props.itemId), productCardStoreReducerCreator).invoke as InvokeSpecificUrl<{}, {}>, dispatch),
                updateLocallyItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).updateLocally, dispatch),
                clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, productCardFetchReducerCreator).clear as Clear, dispatch)
            };
        }
    )(CommonOptionsForm);

    return ConnectedForm;
}

export {
    getOverrideFormRows,
    createCommonOptionsForm
};
