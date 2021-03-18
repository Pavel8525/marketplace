import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { InvokeSpecificUrl, Fetch, Clear } from "app/common/core/data";
import i18n from "app/common/core/translation/i18n";
import {
    IFormRow,
    FieldType,
    FieldControl,
    RequiredField,
    MaxLengthLongField,
    FormColumnLayout,
    IField,
    LookupEntityType, MaxLengthVeryLongField
} from "app/common/components";

import { IStateProps, IDispatchProps, CommonOptionsForm } from "../components/CommonOptionsForm";

const HEAD_PRODUCT_COMMON_OPTIONS_FORM = 'HEAD_PRODUCT_COMMON_OPTIONS_FORM';

const getFormRows = (): IFormRow[] => {
    const formRows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('product:card.common-options-form.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        },
        {
            fields: [
                {
                    name: 'VendorCode',
                    label: i18n.t('product:card.common-options-form.form.vendor-code'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    disabled: true
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'CategoryId',
                    valueName: 'Category',
                    label: i18n.t('product:card.common-options-form.form.category'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.productCategory,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    initFilter: { MarketPlaceKind: "Internal" },
                    validate: [RequiredField]
                } as IField,
                {
                    name: 'BrandId',
                    valueName: 'Brand',
                    label: i18n.t('product:card.common-options-form.form.brand'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.brand,
                    textField: "Name",
                    keyField: "Id"
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        },
        {
            fields: [
                {
                    name: 'Weight',
                    label: i18n.t('product:card.common-options-form.form.weight'),
                    type: FieldType.number,
                    min: 1,
                    max: 10000000,
                    formatNumber: "n"
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        },
        {
            fields: [
                {
                    name: 'Long',
                    label: i18n.t('product:card.common-options-form.form.long'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n"
                } as IField,
                {
                    name: 'Width',
                    label: i18n.t('product:card.common-options-form.form.width'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n"
                } as IField,
                {
                    name: 'Height',
                    label: i18n.t('product:card.common-options-form.form.height'),
                    type: FieldType.number,
                    min: 1,
                    max: 100000,
                    formatNumber: "n"
                } as IField
            ],
            columntLayout: FormColumnLayout.trio
        },
        {
            fields: [
                {
                    name: 'Description',
                    label: i18n.t('product:card.common-options-form.form.description'),
                    type: FieldType.string,
                    control: FieldControl.textarea,
                    validate: [MaxLengthVeryLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        }
    ];

    return formRows;
}

const ProductCommonOptionsForm = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductItem,
            rows: getFormRows()
        };
    },
    {
        fetchProductItem: Bantikom.ProductService.getProductItem.fetch as Fetch<{}>,
        saveItem: Bantikom.ProductService.saveProductItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ProductService.getProductItem.updateLocally,
        clear: Bantikom.ProductService.getProductItem.clear as Clear
    }
)(CommonOptionsForm);

export {
    ProductCommonOptionsForm,
    HEAD_PRODUCT_COMMON_OPTIONS_FORM
};