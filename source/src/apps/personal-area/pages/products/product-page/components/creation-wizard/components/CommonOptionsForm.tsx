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
    forwardLookupValue,
    backwardLookupValue
} from 'app/common/components';
import { IFetchState, InvokeSpecificUrl } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { getDelta } from 'app/common/helpers/object-helper';

const ITEM_EDIT_FORM = 'PRODUCT_COMMON_OPTIONS_FORM';

interface IValidationResult {
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
    item: Bantikom.Product;
    request: {};
    goToStep: (stepName: Bantikom.ProductCreationStatus) => void;
}

interface IDispatchProps {
    saveItem: InvokeSpecificUrl<{}, {}>;
    updateLocallyItem: (data: any) => void;
}

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Product>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class CommonOptionsForm extends React.Component<IProps> {
    private rows: IFormRow[] = null;
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: ITEM_EDIT_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm();
        this.rows = getFormRows();
    }

    public render() {
        let item = forwardLookupValue(this.props.item, this.rows);

        return (
            <>
                <this.form
                    formState={FormState.creating}
                    initialValues={{ ...item }}
                    rows={this.rows}
                    onSubmit={this.saveItem}
                    validate={validate}
                    disableCheckDirty={true}
                    submitTitle={i18n.t("product:creation-wizard.buttons.next")}
                />
            </>
        );
    }

    private saveItem = (item: Bantikom.Product): Promise<{}> => {
        const delta = getDelta(this.props.item, backwardLookupValue(item, this.rows));

        if (delta) {
            return this.props.saveItem(delta, item.Id, { ...this.props.request });
        }

        return new Promise<{}>((resolve) => resolve(this.props.itemState.data));
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.Product>) => {
        this.props.updateLocallyItem(response);
        this.props.goToStep("Siting");
    }
}

export {
    IStateProps,
    IDispatchProps,
    CommonOptionsForm
};
