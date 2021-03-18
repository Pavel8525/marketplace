import 'app/common/components/data-grid/styles/data-grid.css';

import *  as React from 'react';
import i18n from 'i18next';

import { connect } from 'react-redux';
import { GridColumn } from '@progress/kendo-react-grid';
import { parseDate } from '@telerik/kendo-intl';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { any } from 'app/common/helpers/array-helper';
import { IEnvironmentSettings } from 'app/common/contracts';
import {
    IPaginationState,
    GetNextPage,
    SetFilter,
    IResponsePayload,
    SetPrepareResponse
} from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Bantikom } from 'app/common/core/api/proxy';
import {
    LinkCell,
    DataGrid,
    ContainerHeightType,
    getDropDownItemValue,
    StringDropdownFilterCell
} from 'app/common/components';
import { AddButton } from 'app/common/components/data-grid/components/ToolbarItems';
import { getEnumMarketplaceKind } from 'app/common/core/api/enum-source';
import { IDropDownItem, IChangeEventParams } from 'app/common/components/data-grid/contracts';
import { getNotSelectedDropDownItem } from 'app/common/components/data-grid/contracts/IDropDownItem';
import { RUSSIAN_LANGUAGE } from 'app/common/core/translation/i18n';

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<Bantikom.Product, {}>;
}

interface IOwnProps {
    gridHeight?: ContainerHeightType;
    gotoNewItemPage: () => void;
}

interface IState {
    request: any;
    stateFilter?: CompositeFilterDescriptor;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class WatchingProductsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private enumMarketplaceKind = getEnumMarketplaceKind();
    private marketplaceKindItems = this.enumMarketplaceKind
        .map(item => ({ text: item.name, value: item.value } as IDropDownItem<string>));
    private defaultDropDownItem: IDropDownItem<string> = getNotSelectedDropDownItem();

    private toolbarItems: JSX.Element[];

    constructor(props: IProps) {
        super(props);

        this.state = {
            request: this.getRequest()
        };

        this.toolbarItems = [
            <AddButton buttonOnClick={this.props.gotoNewItemPage} />
        ];

        this.props.setFilterItems(this.state.request);
        this.props.setPrepareResponseSchemes({ callback: this.setPrepareResponseTask });
    }

    private getRequest = (): {} => {
        return {
            orderBy: ['LastModificationDate desc'],
            select: [
                'OwnerId',
                'Id', 'Name',
                'MarketPlaceKind',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ],
            expand: {
                WatchingProduct: { select: ['Name', 'Id', 'ExtendedId', 'SalePrice', 'LowImage', 'HighImage'] },
                ProductMarketplace: {
                    select: ['Name', 'Id'],
                    expand: { HeadProduct: { select: ['Name', 'Id'] } }
                }
            }
        }
    }

    private setPrepareResponseTask = (response: IResponsePayload<Bantikom.Product>)
        : IResponsePayload<Bantikom.Product> => {
        if (any(response.items)) {
            response.items.forEach(item => {
                item.CreationDate = parseDate(item.CreationDate.toString());
                item.LastModificationDate = parseDate(item.LastModificationDate.toString());
            });
        }
        return response;
    }

    public render() {
        const {
            gridHeight = ContainerHeightType.Auto
        } = this.props;

        const { request } = this.state;

        const { stateFilter } = this.state;
        const selectedState = stateFilter && getDropDownItemValue<string>(
            'MarketPlaceKind',
            stateFilter.filters,
            this.marketplaceKindItems,
            this.defaultDropDownItem);

        return (
            <>
                <DataGrid
                    id="watching-products"
                    ref={this.gridRef}
                    request={request}
                    fetchItems={this.props.fetchItems}
                    items={this.props.items}
                    customFilter={stateFilter}
                    initSort={[{ field: 'LastModificationDate', dir: 'desc' }]}
                    height={gridHeight}
                    toolbarItems={this.toolbarItems}
                    locale={RUSSIAN_LANGUAGE}
                >
                    <GridColumn
                        field="WatchingProduct.ExtendedId"
                        title={i18n.t("watching-products:table.columns.vendor-code")}
                        width="150px"
                        cell={(props) => <LinkCell {...props} keyField="Id" path="analytics/watching-products/card" target="_self" />}
                    />
                    <GridColumn
                        field="WatchingProduct.ExtendedId"
                        title={i18n.t("watching-products:table.columns.vendor-code")}
                        width="100px"
                        sortable={false}
                        filterable={false}
                        cell={(props) => {
                            return (
                                <td>
                                    <span
                                        className="d-block img-share"
                                        style={{ backgroundImage: "url('" + props.dataItem.WatchingProduct.LowImage + "')", backgroundSize: "cover", height: "96px", maxWidth: "76px", border: '2px solid #cb11ab' }}
                                    />
                                </td>
                            )
                        }
                        }
                    />

                    <GridColumn
                        field="WatchingProduct.Name"
                        title={i18n.t("watching-products:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="analytics/watching-products/card" target="_self" />}
                    />

                    <GridColumn
                        field="MarketPlaceKind"
                        title={i18n.t("watching-products:table.columns.market-place-kind")}
                        sortable={false}
                        width="150px"
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.marketplaceKindItems}
                                selected={selectedState}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onProductStateChange}
                            />
                        }
                    />
                    <GridColumn
                        field="WatchingProduct.SalePrice"
                        title={i18n.t("watching-products:table.columns.name")}
                        width="150px"
                        format={this.props.environmentSettings.localizationSettings.number2FormatFull}
                    />
                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("components:data-grid.columns.creation-date")}
                        filter="date"
                        width="150px"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                    />
                </DataGrid>
            </>
        );
    }

    private onProductStateChange = (e: IChangeEventParams<string>) => {
        const fieldName = 'MarketPlaceKind';
        let stateFilter: CompositeFilterDescriptor = null;
        if (e.value != null) {
            const filters = [{ field: fieldName, operator: e.operator, value: e.value.value }];
            stateFilter = {
                logic: 'and',
                filters
            }
        }

        this.setState(() => ({
            stateFilter
        }));
    }
}

const WatchingProductsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.WatchingProductLinkPage
        };
    },
    {
        setFilterItems: Bantikom.WatchingProductLinkService.getWatchingProductLinkPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.WatchingProductLinkService.getWatchingProductLinkPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.WatchingProductLinkService.getWatchingProductLinkPage.getNextPage as GetNextPage<{}>
    }
)(WatchingProductsTable);

export { WatchingProductsTableConnected as WatchingProductsTable };