import * as React from 'react';
import i18n from 'i18next';

import { Bantikom } from 'app/common/core/api/proxy';
import {
    autoformFactory,
    FormState,
    ConnectedMarketplacesList,
    Marketplace
} from 'app/common/components';
import { Fetch, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Guid } from 'app/common/helpers/string-helper';


const PRODUCT_SITING_FORM = 'PRODUCT_SITING_FORM';

type CreateMarketplaceProductsResponse = Bantikom.CreateMarketplaceProductsResponse;

interface IValidationResult {
}

const validate = () => {
    const result: IValidationResult = {};

    return result;
}

interface IStateProps {
    createMarketplaceProductsState: IOperationState<ISingleODataResponse<CreateMarketplaceProductsResponse>>;
}

interface IDispatchProps {
    createMarketplaceProducts: InvokeSpecificUrl<{ request: Bantikom.CreateMarketplaceProductsRequest }, {}>;
    getProductLinks: Fetch<{}>;
}

interface IOwnProps {
    item: Bantikom.Product;
    goToStep: (stepName: Bantikom.ProductCreationStatus) => void;
}


type IProps = IOwnProps & IStateProps & IDispatchProps;

class SitingForm extends React.Component<IProps> {
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: PRODUCT_SITING_FORM,
            onSubmitSuccess: this.onSumbitSuccess
        }).getForm()
    }

    public render() {
        return (
            <this.form
                renderRows={false}
                formState={FormState.editing}
                onSubmit={this.createMarketplaceProducts}
                validate={validate}
                disableCheckDirty={true}
                submitTitle={i18n.t("product:creation-wizard.buttons.next")}

                showBackButton={true}
                backButtonTitle={i18n.t("product:creation-wizard.buttons.back")}
                onClickBackButton={this.goToBack}
            >
                <ConnectedMarketplacesList marketplacesList={null} />
            </this.form>
        );
    }

    private goToBack = () => this.props.goToStep("CommonOptions");

    private createMarketplaceProducts = (): Promise<{}> => {
        //TODO вставить взамен SelectedMarketplaces
        const request: Bantikom.CreateMarketplaceProductsRequest = {
            Id: Guid.newGuid(),
            SelectedMarketplaces: [
                { MarketplaceKind: 'Ozon', ConnectedMarketplaceId: null },
                { MarketplaceKind: 'WildberriesFBS', ConnectedMarketplaceId: null },
                { MarketplaceKind: 'Beru', ConnectedMarketplaceId: null },
                { MarketplaceKind: 'Wildberries', ConnectedMarketplaceId: null },
                { MarketplaceKind: 'Goods', ConnectedMarketplaceId: null },
                { MarketplaceKind: 'Lamoda', ConnectedMarketplaceId: null }
            ]
        };

        const promise = this.props.createMarketplaceProducts(
            { request },
            this.props.item.Id,
            {
                func: 'CreateMarketplaceProducts'
            });

        return promise;
    }

    private onSumbitSuccess = () => {
        this.props.getProductLinks({ key: this.props.item.Id, func: `GetProductLinks` });
    }
}

export {
    IStateProps,
    IDispatchProps,
    SitingForm
};
