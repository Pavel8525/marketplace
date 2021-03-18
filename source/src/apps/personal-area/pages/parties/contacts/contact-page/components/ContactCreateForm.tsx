import i18n from "i18next";
import * as React from "react";
import { connect } from "react-redux";

import {
    autoformFactory,
    FieldControl,
    FieldType,
    FormColumnLayout,
    FormState,
    IField,
    IFormRow,
    ISelectOption,
    MaxLengthShortField,
    RequiredField,
    EmailField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getEnumContactRole } from "app/common/core/api/enum-source";
import { Bantikom } from "app/common/core/api/proxy";
import { IFetchState, Invoke } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";
import { validate } from "../common/validate";

const ITEM_CREATE_FORM = 'CONTACT_CREATE_FORM';

interface IOwnProps {
    leadId?: string;
    customerId?: string;
    gotoItem: (itemId: string) => void;
}

interface IDispatchProps {
    createItem: Invoke<{}, {}>;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Contact>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ContactCreateForm extends React.Component<IProps> {
    private enumContactRole: ISelectOption[] = getEnumContactRole();
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: ITEM_CREATE_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    public render() {
        return (
            <this.form
                formState={FormState.creating}
                rows={this.getFormRows()}
                onSubmit={this.createItem}
                validate={validate}
            />
        );
    }

    private getFormRows = (): IFormRow[] => {
        const formRows = [
            {
                fields: [
                    {
                        name: 'Name',
                        label: i18n.t('contact:create.form.name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        required: true,
                        validate: [RequiredField, MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'FirstName',
                        label: i18n.t('contact:create.form.first-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'LastName',
                        label: i18n.t('contact:create.form.last-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'MiddleName',
                        label: i18n.t('contact:create.form.middle-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'ContactRole',
                        label: i18n.t('contact:create.form.contact-role'),
                        type: FieldType.enum,
                        control: FieldControl.materialDropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumContactRole,
                        keyField: 'value',
                        textField: 'name'
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'PhoneNumber',
                        label: i18n.t('contact:create.form.phone-number'),
                        type: FieldType.string,
                        mask: "+(0)000-000-00-00",
                        control: FieldControl.maskedText
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            },
            {
                fields: [
                    {
                        name: 'Email',
                        label: i18n.t('contact:create.form.email'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [EmailField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            }
        ];

        return formRows;
    }

    private createItem = (item: Bantikom.Contact): Promise<{}> => {
        return this.props.createItem({ ...item, LeadId: this.props.leadId, CustomerId: this.props.customerId });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Contact>) =>
        this.props.gotoItem(response.item.Id);
}

const ContactCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ContactItem
        };
    },
    {
        createItem: Bantikom.ContactService.createContactItem.invoke as Invoke<{}, {}>
    }
)(ContactCreateForm);

export { ContactCreateFormConnected as ContactCreateForm };
