import i18n from "i18next";
import * as React from "react";

import {
    autoformFactory,
    FieldControl,
    FieldType,
    FormColumnLayout,
    FormState,
    IField,
    IFormRow,
    RequiredField,
    MaxLengthLongField,
    Panel,
    ISelectOption
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { IFetchState, Invoke } from "app/common/core/data";
import { getEnumMarketplaceKind, getEnumRefreshRateType, getEnumSearchMethod } from "app/common/core/api/enum-source";
import { Bantikom } from "app/common/core/api/proxy";

const ITEM_CREATE_FORM = 'SEO_TOP_OBSERVATION_CREATE_FORM';
const DefaultFormValues: Pick<Bantikom.SeoTopObservation, 'RefreshRateType' | 'SearchMethod' | 'RefreshRateValue'> = {
    RefreshRateType: 'Minute',
    SearchMethod: 'Keyword',
    RefreshRateValue: 10
}

const getFormRows = (): IFormRow[] => {
    const markeplaceKindSource: ISelectOption[] = getEnumMarketplaceKind().filter(item => item.value == 'Wildberries');
    const searchMethodSource: ISelectOption[] = getEnumSearchMethod().filter(item => item.value !== 'Nothing');
    const refreshRateTypeSource: ISelectOption[] = getEnumRefreshRateType().filter(item => item.value !== 'Nothing');

    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('monitoring:seo-top.create-form.rows.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField,
                {
                    name: 'MarketplaceKind',
                    label: i18n.t('monitoring:seo-top.create-form.rows.marketplace-kind'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    textField: "name",
                    keyField: "value",
                    required: true,
                    validate: [RequiredField],
                    options: markeplaceKindSource
                } as IField,
                {
                    name: 'SearchMethod',
                    label: i18n.t('monitoring:seo-top.create-form.rows.search-method'),
                    description: i18n.t('monitoring:seo-top.create-form.rows.search-method-description'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    textField: "name",
                    keyField: "value",
                    required: true,
                    validate: [RequiredField],
                    options: searchMethodSource
                } as IField,
                {
                    name: 'RefreshRateType',
                    label: i18n.t('monitoring:seo-top.create-form.rows.refresh-rate-type'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    textField: "name",
                    keyField: "value",
                    required: true,
                    validate: [RequiredField],
                    options: refreshRateTypeSource
                } as IField,
                {
                    name: 'RefreshRateValue',
                    label: i18n.t('monitoring:seo-top.create-form.rows.refresh-rate-value'),
                    type: FieldType.number,
                    min: 1,
                    max: 10000000,
                    formatNumber: "n0",
                    step: 1
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
        }
    ];

    return rows;
}

interface IOwnProps {
    gotoItem: (itemId: string) => void;
}

interface IDispatchProps {
    createItem: Invoke<{}, {}>;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.SeoTopObservation>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class SeoTopCreateForm extends React.Component<IProps> {
    private form: any;
    private rows: IFormRow[];

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: ITEM_CREATE_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();
        this.rows = getFormRows();
    }

    public render() {
        return (
            <Panel
                uniqueIdentifier="seo-top-create-form"
                showHeader={false}
                showIcon={false}
            >
                <this.form
                    formState={FormState.creating}
                    rows={this.rows}
                    onSubmit={this.createItem}
                    initialValues={{ ...DefaultFormValues }}
                />
            </Panel>
        );
    }

    private createItem = (formData: any): Promise<{}> => {
        const item: Bantikom.SeoTopObservation = { ...formData };

        return this.props.createItem({ ...item });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.SeoTopObservation>) =>
        this.props.gotoItem(response.item.Id);
}

export {
    IDispatchProps,
    IStateProps,
    SeoTopCreateForm
};
