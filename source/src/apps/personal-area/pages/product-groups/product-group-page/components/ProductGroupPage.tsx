import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import i18n from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { FetchWithLoader, FormState, Panel } from 'app/common/components';
import { PageHeader } from 'app/common/layouts/page/components';
import { Clear, Fetch, IFetchState } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Bantikom } from 'app/common/core/api/proxy';

import { ProductGroupCreateForm, ProductGroupEditForm } from '../containers';
import { ProductsTable } from 'app/apps/personal-area/common';

const CREATE_NEW_ITEM = "create-new-item";

interface IDispatchProps {
    fetchItem: Fetch<{}>;
    clear: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<Bantikom.ProductGroup>>;
}

interface IState {
    formState: FormState,
    itemId: string;
    item?: Bantikom.ProductGroup;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ProductGroupPage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const itemId = (this.props.match.params as any).productGroupId;

        this.state = {
            formState: itemId === CREATE_NEW_ITEM ? FormState.creating : FormState.editing,
            itemId: itemId
        };
    }

    public render() {
        const { itemState } = this.props;
        const { item, formState } = this.state;

        const renderContent = () => {
            switch (formState) {
                case FormState.creating: {
                    return (
                        <Panel
                            uniqueIdentifier="product-group-create-form"
                            canCollapse={false}
                            canMaximize={false}
                            showHeader={true}
                            title={i18n.t("product-group:create.panels.product-group-create-form")}
                        >
                            <ProductGroupCreateForm
                                gotoItem={this.gotoItemPage}
                            />
                        </Panel>
                    );
                }
                case FormState.editing: {
                    return (
                        <FetchWithLoader fetchState={itemState} showLoadingOnFirstLoad={true}>
                            {item && (
                                <>
                                    <Panel
                                        uniqueIdentifier="product-group-edit-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("product-group:edit.panels.product-group-edit-form")}
                                    >
                                        <ProductGroupEditForm item={item} />
                                    </Panel>

                                    <Panel
                                        uniqueIdentifier="product-group-products-table"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("product-group:edit.panels.product-group-products-table")}
                                    >
                                        <ProductsTable
                                            productGroupId={item.Id}
                                            openTarget='_blank'
                                            gotoNewItemPage={`/personal/products/card/${CREATE_NEW_ITEM}?productGroupId=${item.Id}`}
                                            showMultiLookupButton={true}
                                            onReload={this.onReloadProductsTable}
                                        />
                                    </Panel>
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
                    title={formState === FormState.creating ? i18n.t("product-group:create.title") : item ? item.Name : ""}
                    portalName="portal-page-header"
                    iconClassName="fa-bags-shopping"
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

    public componentWillUnmount() {
        this.props.clear();
    }

    private gotoItemPage = (itemId: string) => {
        this.props.history.push(`/personal/product-groups/card/${itemId}`);

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
            this.props.fetchItem({
                key: itemId
            });
        }
    }

    private onReloadProductsTable = () => {
        this.fetchItem();
    }
}

export {
    IStateProps,
    IDispatchProps,
    ProductGroupPage
};
