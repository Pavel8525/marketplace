import * as React from 'react';
import i18n from 'i18next';

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
    LookupEntityType,
    backwardLookupValue
} from 'app/common/components';
import { IFetchState, Invoke } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';

const ITEM_CREATE_FORM = 'CONTACT_CREATE_FORM';

interface IValidationResult {
    LegalEntityKind?: string;
}

const getFormRows = (): IFormRow[] => {
    const rows = [
        {
            fields: [
                {
                    name: 'CategoryId',
                    valueName: 'Category',
                    label: i18n.t('product:create.form.category-description'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.productCategory,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    initFilter: { MarketPlaceKind: "Internal" },
                    validate: [RequiredField]
                } as IField
            ],
            columntLayout: FormColumnLayout.duet
        },
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('product:create.form.name-description'),
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
                    name: 'ExtVendorCode',
                    label: i18n.t('product:create.form.ext-vendor-code-description'),
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

const validate = () => {
    const result: IValidationResult = {};

    return result;
}

interface IOwnProps {
    gotoItem: (itemId: string) => void;
}

interface IDispatchProps {
    createItem: Invoke<{}, {}>;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Product>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductCreateForm extends React.Component<IProps> {
    private rows: IFormRow[] = null;
    private form: any;

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
            <>
                <this.form
                    formState={FormState.creating}
                    rows={this.rows}
                    onSubmit={this.createItem}
                    validate={validate}
                />
            </>
        );
    }

    private createItem = (item: Bantikom.Product): Promise<{}> => {
        return this.props.createItem({ ...backwardLookupValue(item, this.rows), CreationStatus: 'Siting' });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Product>) => {
        this.props.gotoItem(response.item.Id);
    }
}

export {
    IStateProps,
    IDispatchProps,
    ProductCreateForm
};
