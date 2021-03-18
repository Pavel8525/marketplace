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
    ISelectOption,
    MaxLengthLongField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { IFetchState, Invoke } from "app/common/core/data";
import { getEnumMarketplaceKind } from "app/common/core/api/enum-source";

const ITEM_CREATE_FORM = 'CONNECTED_MARKETPLACE_CREATE_FORM';

const getFormRows = (): IFormRow[] => {
    const markeplaceKindSource: ISelectOption[] = getEnumMarketplaceKind().filter(item => item.value !== 'Internal');
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('marketplace:create.form.name'),
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
                    label: i18n.t('marketplace:create.form.marketplace-kind'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    required: true,
                    validate: [RequiredField],
                    options: markeplaceKindSource,
                    textField: 'name',
                    keyField: 'value'
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
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
    itemState: IFetchState<ISingleODataResponse<Bantikom.ConnectedMarketplace>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ConnectedMarketplaceCreateForm extends React.Component<IProps> {
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
            <this.form
                formState={FormState.creating}
                rows={this.rows}
                onSubmit={this.createItem}
            />
        );
    }

    private createItem = (item: Bantikom.ConnectedMarketplace): Promise<{}> => {
        return this.props.createItem({ ...item });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.ConnectedMarketplace>) =>
        this.props.gotoItem(response.item.Id);
}

export {
    IDispatchProps,
    IStateProps,
    ConnectedMarketplaceCreateForm
};
