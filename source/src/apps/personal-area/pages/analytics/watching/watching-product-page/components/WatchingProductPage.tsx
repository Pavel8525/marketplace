import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FormState, FetchWithLoader } from 'app/common/components';
import { WatchingProductCreateForm } from './WatchingProductCreateForm';
import { SearchMarketplaceProductForm } from '../..';

const CREATE_NEW_ITEM = "create-new-item";

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemProductState: IFetchState<ISingleODataResponse<Bantikom.Product>>;
}

interface IDispatchProps {
    fetchProductItem: Fetch<{}>;
}

interface IState {
    formState: FormState,
    itemId: string;
    currentProductTab: number;
    item?: Bantikom.Product;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class WatchingProductPage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemProductState.data && props.itemProductState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const itemId = (this.props.match.params as any).productId;

        this.state = {
            formState: itemId === CREATE_NEW_ITEM ? FormState.creating : FormState.editing,
            itemId: itemId,
            currentProductTab: 0
        };
    }

    public render() {
        const { itemProductState } = this.props;
        const { item, formState } = this.state;

        const renderContent = () => {
            switch (formState) {
                case FormState.creating: {
                    return (
                        <Panel
                            uniqueIdentifier="product-create-form"
                            canCollapse={false}
                            canMaximize={false}
                            showHeader={true}
                            title={i18n.t("watching-product:create.panels.watching-product-create-form")}
                        >
                            <SearchMarketplaceProductForm
                                gotoItem={this.gotoItemPage}
                            />
                        </Panel>
                    );
                }
                case FormState.editing: {
                    return (
                        <FetchWithLoader fetchState={itemProductState}>
                            {item && (
                                <>
                                    {item.CreationStatus !== "Done" ?
                                        (
                                            {/* <CreationWizard item={item} /> */ }
                                        ) : (
                                            {/* <ProductCard product={item} /> */ }
                                        )
                                    }
                                </>
                            )}
                        </FetchWithLoader>
                    );
                }
            }
        };

        return (
            <>
                <PageHeader
                    title={formState === FormState.creating ? i18n.t("watching-product:create.title") : item ? item.Name : ""}
                    portalName="portal-page-header"
                    iconClassName="fa-shopping-basket"
                />

                <div className="row">
                    <div className="col-xl-12">
                        {renderContent()}
                    </div>
                </div>
            </>
        )
    }

    public componentDidMount() {
        this.fetchItem();
    }

    private gotoItemPage = (itemId: string) => {
        this.props.history.push(`/personal/products/card/${itemId}`);

        this.setState(() => ({
            ...this.state,
            itemId,
            formState: FormState.editing
        }));

        this.fetchItem();
    }

    private fetchItem() {
        const { itemId } = this.state;
        if (itemId !== CREATE_NEW_ITEM) {
            const expand = {
                WatchingProduct: { select: ['Name', 'Id', 'ExtendedId'] },
                ProductMarketplace: {
                    select: ['Name', 'Id'],
                    expand: { HeadProduct: { select: ['Name', 'Id'] } }
                }
            };
            this.props.fetchProductItem({ key: itemId, expand });
        }
    }

}

export { IDispatchProps, IStateProps, WatchingProductPage };