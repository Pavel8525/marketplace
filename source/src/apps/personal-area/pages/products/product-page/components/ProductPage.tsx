import '../styles/product-page.css';

import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch, Clear } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FormState, FetchWithLoader } from 'app/common/components';

import { ProductCreateForm, CreationWizard } from './creation-wizard';
import { ProductCard } from './product-card/card';

const CREATE_NEW_ITEM = "create-new-item";

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    productLinksState: IFetchState<ISingleODataResponse<Bantikom.ProductLinksResult>>;
}

interface IDispatchProps {
    getProductLinks: Fetch<{}>;
    clearProductLinks: Clear;
}

interface IState {
    formState: FormState,
    itemId: string;
    currentProductTab: number;
    item?: Bantikom.ProductLink;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ProductPage extends React.Component<IProps, IState> {
    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        if (props.productLinksState.data && props.productLinksState.data.item) {
            const item = props.productLinksState.data.item.Links.find(s => s.Kind === "Internal");
            return {
                ...state,
                item
            }
        }

        return {
            ...state
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
        const { productLinksState } = this.props;
        const { item, formState } = this.state;

        const renderContent = () => {
            switch (formState) {
                case FormState.creating: {
                    return (
                        <Panel
                            uniqueIdentifier="product-create-form"
                            showHeader={true}
                            canCollapse={false}
                            canMaximize={false}
                            title={i18n.t("product:creation-wizard.steps.step-1")}
                        >
                            <ProductCreateForm
                                gotoItem={this.gotoItemPage}
                            />
                        </Panel>
                    );
                }
                case FormState.editing: {
                    return (
                        <FetchWithLoader fetchState={productLinksState}>
                            {item && (
                                <>
                                    {item.CreationStatus !== "Done" ?
                                        (
                                            <CreationWizard
                                                itemId={this.state.itemId}
                                            />
                                        ) : (
                                            <ProductCard
                                                productId={this.state.itemId}
                                                links={productLinksState.data.item.Links}
                                            />
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
                    title={formState === FormState.creating ? i18n.t("product:create.title") : item ? item.Name : ""}
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
        this.fetchProductLinks();
    }

    public componentWillUnmount() {
        this.props.clearProductLinks();
    }

    private fetchProductLinks = () => {
        const { itemId } = this.state;
        if (itemId !== CREATE_NEW_ITEM) {
            this.props.getProductLinks({ key: itemId, func: `GetProductLinks` })
        }
    }

    private gotoItemPage = (itemId: string) => {
        this.props.history.push(`/personal/products/card/${itemId}`);

        this.setState(() => ({
            ...this.state,
            itemId,
            formState: FormState.editing
        }));

        this.fetchProductLinks();
    }
}

export { IDispatchProps, IStateProps, ProductPage };