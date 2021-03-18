import i18n from "i18next";
import * as React from "react";
import { connect } from "react-redux";

import {
    autoformFactory,
    FieldControl,
    FieldType, FormColumnLayout,
    FormState, IField,
    IFormRow,
    ISelectOption, MaxLengthLongField, MaxLengthShortField,
    RequiredField,
    EmailField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getEnumContactRole } from "app/common/core/api/enum-source";
import { Bantikom } from "app/common/core/api/proxy";
import { InvokeSpecificUrl, IFetchState } from "app/common/core/data";
import { IStoreState } from "app/common/core";

import { validate } from "../common/validate";

const ITEM_EDIT_FORM = 'CONTACT_EDIT_FORM';

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Contact>>;
}

interface IOwnProps {
    item: Bantikom.Contact;
}

interface IDispatchProps {
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
}

type IProps = IDispatchProps & IStateProps & IOwnProps;

class ContactEditForm extends React.Component<IProps> {
    private enumContactRole: ISelectOption[] = getEnumContactRole();
    private formRows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: ITEM_EDIT_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    render() {
        const { item } = this.props;
        return (
            <this.form
                formState={FormState.editing}
                rows={this.getFormRows()}
                onSubmit={this.saveItem}
                initialValues={{ ...item }}
                validate={validate}
            />
        );
    }

    private saveItem = (item: Bantikom.Contact): Promise<{}> =>
        this.props.saveItem(item, item.Id);

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Contact>) => {
        this.props.updateLocallyItem(response);
    }

    private getFormRows = (): IFormRow[] => {
        this.formRows = [
            {
                fields: [
                    {
                        name: 'Name',
                        label: i18n.t('contact:edit.form.name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        required: true,
                        validate: [RequiredField, MaxLengthLongField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'FirstName',
                        label: i18n.t('contact:edit.form.first-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'LastName',
                        label: i18n.t('contact:edit.form.last-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'MiddleName',
                        label: i18n.t('contact:edit.form.middle-name'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthShortField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'ContactRole',
                        label: i18n.t('contact:edit.form.contact-role'),
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
                        label: i18n.t('contact:edit.form.phone-number'),
                        type: FieldType.string,
                        mask: "+(0)000-000-00-00",
                        control: FieldControl.maskedText
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'Email',
                        label: i18n.t('contact:edit.form.email'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [EmailField]
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            }
        ];
        return [...this.formRows];
    }
}

const ContactEditFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ContactItem
        };
    },
    {
        saveItem: Bantikom.ContactService.saveContactItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ContactService.getContactItem.updateLocally
    }
)(ContactEditForm);

export { ContactEditFormConnected as ContactEditForm };
