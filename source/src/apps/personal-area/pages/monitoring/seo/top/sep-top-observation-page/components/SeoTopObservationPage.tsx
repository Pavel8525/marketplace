import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import i18n from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { FetchWithLoader, FormState, ObservationProductsTable, Panel } from 'app/common/components';
import { PageHeader } from 'app/common/layouts/page/components';
import { Clear, Fetch, IFetchState, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Bantikom } from 'app/common/core/api/proxy';
import { ISelectorResult, OperationChangeReference } from 'app/common/components/entities-selector/contracts';
import { Guid } from 'app/common/helpers/string-helper';

type SeoTopObservation = Bantikom.SeoTopObservation;
type ObservationProductsChangeEntityReferenceListRequest = Bantikom.ObservationProductsChangeEntityReferenceListRequest;
type ObservationProductsChangeEntityReferenceListResponse = Bantikom.ObservationProductsChangeEntityReferenceListResponse;

interface IDispatchProps {
    fetchItem: Fetch<{}>;
    clear: Clear;

    changeRefs: InvokeSpecificUrl<{ request: ObservationProductsChangeEntityReferenceListRequest }, {}>;
    clearChangeRefs: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<SeoTopObservation>>;
    changeRefsState: IOperationState<ISingleODataResponse<ObservationProductsChangeEntityReferenceListResponse>>;
}

interface IState {
    itemId: string;
    item?: SeoTopObservation;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class SeoTopObservationPage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const itemId = (this.props.match.params as any).observationId;

        this.state = {
            itemId: itemId
        };
    }

    public render() {
        const { itemState } = this.props;
        const { item, itemId } = this.state;

        return (
            <>
                <PageHeader
                    title={item && item.Name}
                    portalName="portal-page-header"
                    iconClassName="fa-sort-amount-up-alt"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <FetchWithLoader fetchState={itemState} showLoadingOnFirstLoad={true}>
                            {item && (
                                <>
                                    <Panel
                                        uniqueIdentifier="seo-top-observation-edit-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("monitoring:seo-top.observation-page.edit-form.title")}
                                    >
                                        <h1>Common properties</h1>
                                        {/* <ProductGroupEditForm item={item} /> */}
                                    </Panel>

                                    <Panel
                                        uniqueIdentifier="seo-top-observation-products-table"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("monitoring:seo-top.observation-page.products.title")}
                                    >
                                        <ObservationProductsTable
                                            observationId={itemId}
                                            observationMarketplaceKind={item.MarketplaceKind}
                                            onSave={this.changeRefs}
                                        />
                                    </Panel>
                                </>
                            )}

                        </FetchWithLoader>
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

    private fetchItem() {
        const { itemId } = this.state;
        this.props.fetchItem({
            key: itemId
        });
    }

    private onReloadProductsTable = () => {
        this.fetchItem();
    }

    private changeRefs = (result: ISelectorResult): Promise<{}> => {
        const { itemId } = this.state;
        const {
            changeRefs
        } = this.props;

        const request: ObservationProductsChangeEntityReferenceListRequest = {
            Id: Guid.newGuid(),
            RelatedEntities: result.items.map((item: Bantikom.Product) => ({
                Id: item.Id,
                EntityName: result.relatedEntityName
            })),
            NavigationProperty: result.navigationProperty,
            Added: result.operation == OperationChangeReference.add,
            All: false,
            Query: null,
            SearchKind: result.tag as Bantikom.SearchKind
        };

        const promise = changeRefs(
            { request },
            itemId,
            { func: `ChangeRefs` }
        );
        return promise;
    }
}

export {
    IStateProps,
    IDispatchProps,
    SeoTopObservationPage
};
