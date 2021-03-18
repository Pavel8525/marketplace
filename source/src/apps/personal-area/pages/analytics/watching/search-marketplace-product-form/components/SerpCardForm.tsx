import i18n from "i18next";
import * as React from "react";
import { connect } from "react-redux";
import { formatNumber } from '@telerik/kendo-intl';

import {
    autoformFactory,
    FormState
} from "app/common/components";
import { ISingleODataResponse } from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke, IOperationState } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";
import { any } from "app/common/helpers/array-helper";

import { IEnvironmentSettings } from "app/common/contracts";

const SEARCH_RESULT_CARD_FORM = 'SEARCH_RESULT_CARD_FORM';

interface IOwnProps {
    marketplaceProduct: Bantikom.FoundMarketplaceProductResult;
}

interface IDispatchProps {
    createItem: Invoke<{}, {}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    watchinProductState: IOperationState<ISingleODataResponse<Bantikom.AddingWatchingProduct>>;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class SerpCardForm extends React.Component<IProps> {
    private form: any;

    constructor(props: IProps) {
        super(props);

        this.form = autoformFactory({
            formName: `${SEARCH_RESULT_CARD_FORM}_${props.marketplaceProduct.VendorCode}`
        }).getForm()
    }

    public render() {
        const { marketplaceProduct } = this.props;
        const {
            Name,
            BrandName,
            VendorCode,
            Url,
            LowImage,
            Color,
            Price,
            IsSoldOut
        } = marketplaceProduct;

        return (
            <>
                <li className="list-group-item py-4 px-4">
                    <this.form
                        formState={FormState.creating}
                        onSubmit={this.createItem}
                        initialValues={{ ...marketplaceProduct }}
                        submitTitle={i18n.t('watching-product:search.result.add-button')}
                        renderRows={false}
                        disableCheckDirty={true}
                    >
                        <h2 className="fs-lg fw-500">{Name}</h2>

                        <div className="fs-xs mt-1">
                            <a href={Url} target="_blank" className="text-success">{Url}</a>
                        </div>

                        <div className="mt-2">
                            <span className="text-muted">{i18n.t('watching-product:search.result.is-sold-out')}</span>{" "}
                            <b>{IsSoldOut ? i18n.t('watching-product:search.result.is-sold-out-no') : i18n.t('watching-product:search.result.is-sold-out-yes')}</b>
                            <br />

                            <span className="text-muted">{i18n.t('watching-product:search.result.price')}</span>{" "}<b>{formatNumber(Price, this.props.environmentSettings.localizationSettings.number2Format)}</b>
                            <br />
                            <span className="text-muted">{i18n.t('watching-product:search.result.vendor-code')}</span>{" "}<b>{VendorCode}</b>
                            <br />
                            <span className="text-muted">{i18n.t('watching-product:search.result.color')}</span>{" "}<b>{Color}</b>
                            <br />
                            <span className="text-muted">{i18n.t('watching-product:search.result.brand-name')}</span>{" "}<b>{BrandName}</b>
                        </div>

                        {any(LowImage) && (
                            <span className="fs-sm d-flex align-items-center mt-3">
                                {LowImage.map((url, key) => (
                                    <a key={key} className="mr-2 mt-1">
                                        <span
                                            className="d-block img-share"
                                            style={{ backgroundImage: "url('" + url + "')", backgroundSize: "cover", height: "96px", maxWidth: "76px", border: '2px solid #cb11ab' }}
                                        />
                                    </a>
                                ))}

                            </span>
                        )}
                    </this.form>
                </li>
            </>
        );
    }

    private createItem = (): Promise<{}> => {
        const {
            MarketplaceKind,
            Url,
            VendorCode,
            Name,
            Price,
            HighImage,
            LowImage } = this.props.marketplaceProduct;

        return this.props.createItem({
            Id: VendorCode,
            MarketplaceKind,
            Url,
            Name,
            Price,
            HighImage: any(HighImage) ? HighImage[0] : null,
            LowImage: any(LowImage) ? LowImage[0] : null
        });
    }
}

const SerpCardFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            environmentSettings: state.environmentSettings,
            watchinProductState: state.odataService.AddingWatchingProductCreateItem
        };
    },
    {
        createItem: Bantikom.AddingWatchingProductService.createAddingWatchingProductItem.invoke as Invoke<{}, {}>
    }
)(SerpCardForm);

export { SerpCardFormConnected as SerpCardForm };
