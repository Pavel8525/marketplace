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
    ISelectOption,
    RequiredField,
    MaxLengthLongField
} from "app/common/components";
import { IMultipleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getEnumWatchingProductMarketplaceKind } from "app/common/core/api/enum-source";
import { Bantikom } from "app/common/core/api/proxy";
import { IFetchState, Fetch, Clear } from "app/common/core/data";
import { any } from "app/common/helpers/array-helper";

import { SerpCardForm } from "./SerpCardForm";

const SEARCH_MARKETPLACE_PRODUCT_FORM = 'SEARCH_MARKETPLACE_PRODUCT_FORM';

interface IOwnProps {
    leadId?: string;
    customerId?: string;
    gotoItem: (itemId: string) => void;
}

interface IDispatchProps {
    searchItems: Fetch<{}>;
    clear: Clear;
}

interface IStateProps {
    itemState: IFetchState<IMultipleODataResponse<Bantikom.FoundMarketplaceProductResult>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class SearchMarketplaceProductForm extends React.Component<IProps> {
    private enumMarketplaceKind: ISelectOption[] = getEnumWatchingProductMarketplaceKind();
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: SEARCH_MARKETPLACE_PRODUCT_FORM,
            resultType: 'multiple',
            showNotification: false
        }).getForm()
    }

    public render() {
        const { itemState } = this.props;
        const result = itemState.data && itemState.data.items;

        return (
            <>
                <div>
                    <this.form
                        formState={FormState.creating}
                        rows={this.getFormRows()}
                        onSubmit={this.searchItem}
                        submitTitle={i18n.t('watching-product:search.form.submit-title')}
                    />
                </div>

                {any(result) && (
                    <div className="card">
                        <ul className="list-group list-group-flush">
                            {result.map((item, key) => (
                                <SerpCardForm key={key} marketplaceProduct={item} />
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private getFormRows = (): IFormRow[] => {
        const formRows = [
            {
                fields: [
                    {
                        name: 'searchCode',
                        label: i18n.t('watching-product:search.form.search-code'),
                        type: FieldType.string,
                        control: FieldControl.materialText,
                        validate: [RequiredField, MaxLengthLongField],
                        required: true
                    } as IField
                ],
                columntLayout: FormColumnLayout.solo
            },
            {
                fields: [
                    {
                        name: 'marketplaceKind',
                        label: i18n.t('watching-product:search.form.market-place-kind'),
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
            }
        ];

        return formRows;
    }

    private searchItem = ({ searchCode, marketplaceKind }: any): Promise<void> => {
        this.props.clear();

        const pattern = encodeURIComponent(btoa(searchCode));

        return this.props.searchItems({
            func: `GetMarketplaceProduct(marketplaceKind='${marketplaceKind}',searchCode='${pattern}')`
        });
    }
}

export {
    IStateProps,
    IDispatchProps,
    SearchMarketplaceProductForm
};
