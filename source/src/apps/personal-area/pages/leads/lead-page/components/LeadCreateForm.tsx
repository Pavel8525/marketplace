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
    ISelectOption
} from 'app/common/components';
import { IFetchState, Invoke } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { IStoreState } from 'app/common/core/store';
import { getEnumLegalEntityKind } from 'app/common/core/api/enum-source';

const LEAD_CREATE_FORM = 'LEAD_CREATE_FORM';

interface IValidationResult {
    LegalEntityKind?: string;
}

const validate = (lead: Bantikom.Lead) => {
    const result: IValidationResult = {};
    if (lead.LegalEntityKind == 'Nothing') {
        result.LegalEntityKind = i18n.t("lead:create.form.nothing-legal-entity-kind");
    }

    return result;
}

interface IOwnProps {
    gotoLead: (leadId: string) => void;
}

interface IDispatchProps {
    createLeadItem: Invoke<{}, {}>;
}

interface IStateProps {
    leadState: IFetchState<ISingleODataResponse<Bantikom.Lead>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class LeadCreateForm extends React.Component<IProps> {
    private enumLegalEntityKind: ISelectOption[] = getEnumLegalEntityKind();
    private formRows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: LEAD_CREATE_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    public render() {
        return (
            <this.form
                formState={FormState.creating}
                rows={this.getFormRows()}
                onSubmit={this.createLead}
                initialValues={{
                    LegalEntityKind: this.enumLegalEntityKind[0].value
                }}
                validate={validate}
            />
        );
    }

    private getFormRows = (): IFormRow[] => {
        this.formRows = [
            {
                fields: [
                    {
                        name: 'LegalEntityKind',
                        label: i18n.t('lead:create.form.legal-entity-kind'),
                        type: FieldType.enum,
                        control: FieldControl.dropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumLegalEntityKind
                    } as IField,
                    {
                        name: 'Name',
                        label: i18n.t('lead:create.form.name'),
                        placeholder: i18n.t('lead:create.form.name-description'),
                        type: FieldType.string,
                        required: true,
                        validate: [RequiredField, MaxLengthLongField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            }
        ];

        return [...this.formRows];
    }

    private createLead = (lead: Bantikom.Lead): Promise<{}> =>
        this.props.createLeadItem({ ...lead, Country: 'RU' });

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Lead>) =>
        this.props.gotoLead(response.item.Id);
}

const LeadCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            leadState: state.odataService.LeadItem
        };
    },
    {
        createLeadItem: Bantikom.LeadService.createLeadItem.invoke as Invoke<{}, {}>
    }
)(LeadCreateForm);

export { LeadCreateFormConnected as LeadCreateForm };