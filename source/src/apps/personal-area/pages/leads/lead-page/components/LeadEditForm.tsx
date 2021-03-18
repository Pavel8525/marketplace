import * as React from 'react';
import i18n from 'i18next';
import { connect } from 'react-redux';

import { Bantikom } from 'app/common/core/api/proxy';
import {
    FieldType,
    FieldControl,
    IFormRow,
    FormColumnLayout,
    RequiredField,
    MaxLengthLongField,
    autoformFactory,
    FormState,
    IField,
    ISelectOption,
    MaxLengthVeryLongField,
    MaxLengthUrl
} from 'app/common/components';
import { IFetchState, Invoke, InvokeSpecificUrl } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { IStoreState } from 'app/common/core/store';
import { getEnumLegalEntityKind, getEnumCustomerType } from 'app/common/core/api/enum-source';

const LEAD_EDIT_FORM = 'LEAD_EDIT_FORM';

interface IValidationResult {
    CustomerType?: string;
}

const validate = (lead: Bantikom.Lead) => {
    const result: IValidationResult = {};
    if (lead.CustomerType == 'Nothing') {
        result.CustomerType = i18n.t("lead:edit.form.nothing-customer-type");
    }

    return result;
}

interface IOwnProps {
    lead: Bantikom.Lead;
}

interface IDispatchProps {
    saveLeadItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyLeadItem: (data: any) => void;
}

interface IStateProps {
    leadState: IFetchState<ISingleODataResponse<Bantikom.Lead>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class LeadEditForm extends React.Component<IProps> {
    private enumLegalEntityKind: ISelectOption[] = getEnumLegalEntityKind();
    private enumCustomerType: ISelectOption[] = getEnumCustomerType();
    private formRows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: LEAD_EDIT_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    public render() {
        const { lead } = this.props
        return (
            <this.form
                formState={FormState.editing}
                rows={this.getFormRows()}
                onSubmit={this.saveLead}
                initialValues={lead}
                validate={validate}
            />
        );
    }

    private getFormRows = (): IFormRow[] => {
        this.formRows = [
            {
                fields: [
                    {
                        name: 'Name',
                        label: i18n.t('lead:edit.form.name'),
                        placeholder: i18n.t('lead:edit.form.name-description'),
                        type: FieldType.string,
                        required: true,
                        validate: [RequiredField, MaxLengthLongField]
                    } as IField,
                    {
                        name: 'Id',
                        label: i18n.t('lead:edit.form.id'),
                        type: FieldType.string,
                        disabled: true
                    } as IField,
                    {
                        name: 'SiteUrl',
                        label: i18n.t('lead:edit.form.site-url'),
                        placeholder: i18n.t('lead:edit.form.site-url-description'),
                        type: FieldType.string,
                        validate: [MaxLengthUrl]
                    } as IField,
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'CustomerType',
                        label: i18n.t('lead:edit.form.customer-type'),
                        type: FieldType.enum,
                        control: FieldControl.dropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumCustomerType
                    } as IField,
                    {
                        name: 'LegalEntityKind',
                        label: i18n.t('lead:edit.form.legal-entity-kind'),
                        type: FieldType.enum,
                        control: FieldControl.dropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumLegalEntityKind,
                        disabled: true
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'Demand',
                        label: i18n.t('lead:edit.form.demand'),
                        placeholder: i18n.t('lead:edit.form.demand-desciption'),
                        type: FieldType.string,
                        control: FieldControl.textarea,
                        validate: [MaxLengthVeryLongField]
                    } as IField,
                    {
                        name: 'KindOfActivity',
                        label: i18n.t('lead:edit.form.kind-of-activity'),
                        placeholder: i18n.t('lead:edit.form.kind-of-activity-description'),
                        type: FieldType.string,
                        control: FieldControl.textarea,
                        validate: [MaxLengthVeryLongField]
                    } as IField,
                    {
                        name: 'Description',
                        label: i18n.t('lead:edit.form.description'),
                        placeholder: i18n.t('lead:edit.form.description-description'),
                        type: FieldType.string,
                        control: FieldControl.textarea,
                        validate: [MaxLengthVeryLongField]
                    } as IField,
                ],
                columntLayout: FormColumnLayout.solo
            }
        ];

        return [...this.formRows];
    }

    private saveLead = (lead: Bantikom.Lead): Promise<{}> =>
        this.props.saveLeadItem(lead, lead.Id);

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Lead>) =>
        this.props.updateLocallyLeadItem(response);
}

const LeadEditFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            leadState: state.odataService.LeadItem
        };
    },
    {
        saveLeadItem: Bantikom.LeadService.saveLeadItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyLeadItem: Bantikom.LeadService.getLeadItem.updateLocally
    }
)(LeadEditForm);

export { LeadEditFormConnected as LeadEditForm };