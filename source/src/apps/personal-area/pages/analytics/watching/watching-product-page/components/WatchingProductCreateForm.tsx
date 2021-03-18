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
    MaxLengthUrl
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getEnumWatchingProductMarketplaceKind } from "app/common/core/api/enum-source";
import { Bantikom } from "app/common/core/api/proxy";
import { IFetchState, Invoke } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";

const ITEM_CREATE_FORM = 'WATCHING_PRODUCT_CREATE_FORM';

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

class WatchingProductCreateForm extends React.Component<IProps> {
    private enumMarketplaceKind: ISelectOption[] = getEnumWatchingProductMarketplaceKind();
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
            />
        );
    }

    private getFormRows = (): IFormRow[] => {
        const formRows = [
            {
                fields: [
                    {
                        name: 'MarketPlaceKind',
                        label: i18n.t('watching-product:create.form.market-place-kind'),
                        type: FieldType.enum,
                        control: FieldControl.materialDropDown,
                        required: true,
                        validate: [RequiredField],
                        options: this.enumMarketplaceKind,
                        keyField: 'value',
                        textField: 'name'
                    } as IField
                ],
                columntLayout: FormColumnLayout.trio
            },
            {
                fields: [
                    {
                        name: 'ExtendedId',
                        label: i18n.t('watching-product:create.form.extended-id'),
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
                        name: 'Url',
                        label: i18n.t('watching-product:create.form.url'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [MaxLengthUrl]
                    } as IField
                ],
                columntLayout: FormColumnLayout.duet
            }
        ];

        return formRows;
    }

    private createItem = (item: Bantikom.WatchingProduct): Promise<{}> => {
        return this.props.createItem({ ...item, Name: item.ExtendedId || item.Url });
    }

    private onSumbitSuccess = (response: ISingleODataResponse<Bantikom.WatchingProduct>) => {
        //this.props.gotoItem(response.item.Id);

    }
}

const WatchingProductCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.AddingWatchingProductItem
        };
    },
    {
        createItem: Bantikom.AddingWatchingProductService.createAddingWatchingProductItem.invoke as Invoke<{}, {}>
    }
)(WatchingProductCreateForm);

export { WatchingProductCreateFormConnected as WatchingProductCreateForm };
