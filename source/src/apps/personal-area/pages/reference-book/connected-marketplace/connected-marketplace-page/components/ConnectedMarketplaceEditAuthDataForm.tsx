import i18n from "i18next";
import * as React from "react";

import {
    autoformFactory,
    FieldControl,
    FieldType, FormColumnLayout,
    FormState, IField,
    IFormRow,
    MaxLengthLongField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { InvokeSpecificUrl, IFetchState } from "app/common/core/data";
import { getDelta } from "app/common/helpers/object-helper";

const ITEM_EDIT_FORM = 'CONNECTED_MARKETPLACE_EDIT_AUTHDATA_FORM';

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'Login',
                    label: i18n.t('marketplace:edit.form.login'),
                    description: i18n.t('marketplace:edit.form.login-description'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthLongField]
                } as IField,
                {
                    name: 'Password',
                    label: i18n.t('marketplace:edit.form.password'),
                    description: i18n.t('marketplace:edit.form.password-description'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthLongField],
                    isPassword: true
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'ApiKey',
                    label: i18n.t('marketplace:edit.form.api-key'),
                    description: i18n.t('marketplace:edit.form.api-key-description'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthLongField]
                } as IField,
                {
                    name: 'ClientKey',
                    label: i18n.t('marketplace:edit.form.client-key'),
                    description: i18n.t('marketplace:edit.form.client-key-description'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    validate: [MaxLengthLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        }
    ];
    return rows;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.ConnectedMarketplace>>;
}

interface IOwnProps {
    item: Bantikom.ConnectedMarketplace;
}

interface IDispatchProps {
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
}

type IProps = IDispatchProps & IStateProps & IOwnProps;

class ConnectedMarketplaceEditAuthDataForm extends React.Component<IProps> {
    private rows: IFormRow[] = getFormRows();
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: ITEM_EDIT_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();
    }

    public render() {
        const { item } = this.props;
        return (
            <this.form
                formState={FormState.editing}
                rows={this.rows}
                onSubmit={this.saveItem}
                initialValues={{ ...item }}
            />
        );
    }

    private saveItem = (item: Bantikom.ConnectedMarketplace): Promise<{}> => {
        const delta = getDelta(this.props.item, item);

        return this.props.saveItem(delta, item.Id);
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.ConnectedMarketplace>) => {
        this.props.updateLocallyItem(response);
    }
}

export {
    IStateProps,
    IDispatchProps,
    ConnectedMarketplaceEditAuthDataForm
};

