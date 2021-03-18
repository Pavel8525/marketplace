import i18n from "i18next";
import * as React from "react";

import {
    autoformFactory,
    FieldControl,
    FieldType, FormColumnLayout,
    FormState, IField,
    IFormRow,
    MaxLengthLongField,
    RequiredField
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { InvokeSpecificUrl, IFetchState } from "app/common/core/data";
import { getDelta } from "app/common/helpers/object-helper";

const ITEM_EDIT_FORM = 'PRODUCT_GROUP_EDIT_FORM';

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('product-group:edit.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField,
                {
                    name: 'CountItems',
                    label: i18n.t('product-group:edit.form.count-items'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    disabled: true
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        }
    ];

    return rows;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.ProductGroup>>;
}

interface IOwnProps {
    item: Bantikom.ProductGroup;
}

interface IDispatchProps {
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
}

type IProps = IDispatchProps & IStateProps & IOwnProps;

class ProductGroupEditForm extends React.Component<IProps> {
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

    private saveItem = (item: Bantikom.ProductGroup): Promise<{}> => {
        const delta = getDelta(this.props.item, item);

        return this.props.saveItem(delta, item.Id);
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.ProductGroup>) => {
        this.props.updateLocallyItem(response);
    }
}

export {
    IStateProps,
    IDispatchProps,
    ProductGroupEditForm
};

