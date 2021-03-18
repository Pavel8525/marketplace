import i18n from "i18next";
import * as React from "react";

import {
    autoformFactory,
    FieldControl,
    FieldType, FormColumnLayout,
    FormState, IField,
    IFormRow,
    MaxLengthLongField,
    RequiredField,
    ISelectOption
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { InvokeSpecificUrl, IFetchState } from "app/common/core/data";
import { getEnumMarketplaceKind } from "app/common/core/api/enum-source";
import { getDelta } from "app/common/helpers/object-helper";

const ITEM_EDIT_FORM = 'CONNECTED_MARKETPLACE_EDIT_FORM';

const getFormRows = (): IFormRow[] => {
    const markeplaceKindSource: ISelectOption[] = getEnumMarketplaceKind().filter(item => item.value !== 'Internal');
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('marketplace:edit.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'MarketplaceKind',
                    label: i18n.t('marketplace:edit.form.marketplace-kind'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    required: true,
                    validate: [RequiredField],
                    options: markeplaceKindSource,
                    textField: 'name',
                    keyField: 'value',
                    disabled: true
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'Active',
                    label: i18n.t('marketplace:edit.form.active'),
                    type: FieldType.boolean,
                    control: FieldControl.switch
                } as IField,
            ],
            columntLayout: FormColumnLayout.trio
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

class ConnectedMarketplaceEditForm extends React.Component<IProps> {
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
    ConnectedMarketplaceEditForm
};

