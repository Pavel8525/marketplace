import * as React from 'react';
import i18n from 'i18next';
import { connect } from 'react-redux';

import { Bantikom } from 'app/common/core/api/proxy';
import {
    FieldType,
    FieldControl,
    IFormRow,
    FormColumnLayout,
    MaxLengthLongField,
    autoformFactory,
    FormState,
    IField,
    ISelectOption,
    MaxLengthShortField,
    RequiredField
} from 'app/common/components';
import { IFetchState, InvokeSpecificUrl } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { IStoreState } from 'app/common/core/store';
import { getEnumCountries } from 'app/common/core/api/enum-source';

const LEAD_EDIT_ADDRESS_FORM = 'LEAD_EDIT_ADDRESS_FORM';

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

class LeadEditAddressForm extends React.Component<IProps> {
    private enumCountries: ISelectOption[] = getEnumCountries();
    private formRows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: LEAD_EDIT_ADDRESS_FORM,
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
                        name: 'Country',
                        label: i18n.t('lead:edit.form.country'),
                        type: FieldType.enum,
                        control: FieldControl.dropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumCountries
                    } as IField,
                    {
                        name: 'Region',
                        label: i18n.t('lead:edit.form.region'),
                        placeholder: i18n.t('lead:edit.form.region-description'),
                        type: FieldType.string,
                        validate: [MaxLengthShortField]
                    } as IField,
                    {
                        name: 'City',
                        label: i18n.t('lead:edit.form.city'),
                        placeholder: i18n.t('lead:edit.form.city-description'),
                        type: FieldType.string,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'AddressLine',
                        label: i18n.t('lead:edit.form.address-line'),
                        placeholder: i18n.t('lead:edit.form.address-line-description'),
                        type: FieldType.string,
                        control: FieldControl.textarea,
                        validate: [MaxLengthLongField]
                    } as IField,
                    {
                        name: 'AddressLine2',
                        label: i18n.t('lead:edit.form.address-line2'),
                        placeholder: i18n.t('lead:edit.form.address-line2-description'),
                        type: FieldType.string,
                        control: FieldControl.textarea,
                        validate: [MaxLengthLongField]
                    } as IField
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

const LeadEditAddressFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            leadState: state.odataService.LeadItem
        };
    },
    {
        saveLeadItem: Bantikom.LeadService.saveLeadItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyLeadItem: Bantikom.LeadService.getLeadItem.updateLocally
    }
)(LeadEditAddressForm);

export { LeadEditAddressFormConnected as LeadEditAddressForm };