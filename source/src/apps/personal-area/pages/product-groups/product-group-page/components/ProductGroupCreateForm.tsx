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
    MaxLengthLongField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { IFetchState, Invoke } from "app/common/core/data";

const ITEM_CREATE_FORM = 'PRODUCT_GROUP_CREATE_FORM';

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('product-group:create.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
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
    itemState: IFetchState<ISingleODataResponse<Bantikom.ProductGroup>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductGroupCreateForm extends React.Component<IProps> {
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

    private createItem = (item: Bantikom.ProductGroup): Promise<{}> => {
        return this.props.createItem({ ...item });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.ProductGroup>) =>
        this.props.gotoItem(response.item.Id);
}

export {
    IDispatchProps,
    IStateProps,
    ProductGroupCreateForm
};
