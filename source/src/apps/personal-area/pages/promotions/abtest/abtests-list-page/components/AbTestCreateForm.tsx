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
    MaxLengthLongField,
    Panel,
    LookupEntityType
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { IFetchState, Invoke } from "app/common/core/data";
import { ListItemProps } from "@progress/kendo-react-dropdowns";
import { getEnumTestSubject } from "app/common/core/api/enum-source";
import { AbTest } from "app/common/core/api/proxy-ext";

const ITEM_CREATE_FORM = 'ABTEST_CREATE_FORM';

const productItemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => {
    const itemChildren = <span>{i18n.t(`enums:MarketPlaceKind.${itemProps.dataItem.MarketPlaceKind}`)} / {itemProps.dataItem.Name}</span>;
    return React.cloneElement(li, li.props, itemChildren);
};

const getFormRows = (): IFormRow[] => {
    const testSubjects = getEnumTestSubject().filter(item => item.value !== 'Nothing');
    const rows = [
        {
            fields: [
                {
                    name: 'Name',
                    label: i18n.t('abtest:create.form.name'),
                    type: FieldType.string,
                    control: FieldControl.materialText,
                    required: true,
                    validate: [RequiredField, MaxLengthLongField]
                } as IField,
                {
                    name: 'ProductId',
                    label: i18n.t('abtest:create.form.product-id'),
                    type: FieldType.reference,
                    control: FieldControl.lookup,
                    entityType: LookupEntityType.product,
                    textField: "Name",
                    keyField: "Id",
                    required: true,
                    validate: [RequiredField],
                    fetchOnLoad: false,
                    selectFields: ['MarketPlaceKind'],
                    itemRender: productItemRender
                } as IField,
                {
                    name: 'Subject',
                    label: i18n.t('abtest:create.form.subject'),
                    description: i18n.t('abtest:create.form.subject-description'),
                    type: FieldType.enum,
                    control: FieldControl.materialDropDown,
                    required: true,
                    validate: [RequiredField],
                    options: testSubjects,
                    keyField: 'value',
                    textField: 'name'
                } as IField
            ],
            columntLayout: FormColumnLayout.solo
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
    itemState: IFetchState<ISingleODataResponse<AbTest>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class AbTestCreateForm extends React.Component<IProps> {
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
            <Panel
                uniqueIdentifier="abtest-create-form"
                showHeader={false}
                showIcon={false}
            >
                <this.form
                    formState={FormState.creating}
                    rows={this.rows}
                    onSubmit={this.createItem}
                />
            </Panel>
        );
    }

    private createItem = (formData: any): Promise<{}> => {
        const item: AbTest = { ...formData, ProductId: formData.ProductId.Id };

        return this.props.createItem({ ...item });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<AbTest>) =>
        this.props.gotoItem(response.item.Id);
}

export {
    IDispatchProps,
    IStateProps,
    AbTestCreateForm
};
