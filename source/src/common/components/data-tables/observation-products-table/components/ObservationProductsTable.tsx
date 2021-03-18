import 'app/common/components/data-grid/styles/data-grid.css';

import *  as React from 'react';
import i18n from 'i18next';

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
    StringDropdownFilterCell,
    Drawer,
    TitleHeader,
    ProductFinder
} from 'app/common/components';
import { getEnumMarketplaceKind, getEnumProductState } from 'app/common/core/api/enum-source';
import { IDropDownItem, IChangeEventParams } from 'app/common/components/data-grid/contracts';
import { getNotSelectedDropDownItem } from 'app/common/components/data-grid/contracts/IDropDownItem';
import { Clear } from 'app/common/core/data';
import { drawerWidth } from 'app/common/constants';
import { getGuid } from 'app/common/core/api/odata-helper';
import { DropdownToolbarButton } from 'app/common/components/data-grid/components/DropdownToolbarButton';
import { MarketplaceKind } from 'app/common/core/api/proxy-ext';
import { ISelectorResult } from 'app/common/components/entities-selector/contracts';

type Product = Bantikom.Product;

const DrawerWidth = drawerWidth;

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<Product, {}>;
}

interface IOwnProps {
    observationId: string;
    observationMarketplaceKind: MarketplaceKind;

    onSave: (result: ISelectorResult) => Promise<{}>;
    onSumbitSuccess?: (response: {}) => void;
    onReload?: () => void;
}

interface IState {
    request: any;
    isOpenChangeReferenceDrawer: boolean;
    searchKind?: Bantikom.SearchKind;
    stateFilter?: CompositeFilterDescriptor;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ObservationProductsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private enumProductState = getEnumProductState();
    private productStateItems = this.enumProductState
        .map(item => ({ text: item.name, value: item.value } as IDropDownItem<string>));
    private defaultDropDownItem: IDropDownItem<string> = getNotSelectedDropDownItem();

    private marketplaceKindItems = getEnumMarketplaceKind()
        .map(item => ({ text: item.name, value: item.value } as IDropDownItem<string>));

    private toolbarItems: JSX.Element[];

    constructor(props: IProps) {
        super(props);

        this.state = {
            request: this.getRequest(),
            isOpenChangeReferenceDrawer: false
        };

        this.toolbarItems = [
            <DropdownToolbarButton
                name={i18n.t("monitoring:seo-top.observation-page.products.toolbar.add-product-button")}
                iconClassName={"k-icon k-i-plus-outline"}
            >
                <button className="dropdown-item" onClick={() => { this.productFinder_openDrawer('ProductCatalog') }}>{i18n.t("monitoring:seo-top.observation-page.products.toolbar.product-catalog")}</button>
                <button className="dropdown-item" onClick={() => { this.productFinder_openDrawer('ProductGroup') }}>{i18n.t("monitoring:seo-top.observation-page.products.toolbar.product-group")}</button>
                <button className="dropdown-item" onClick={() => { this.productFinder_openDrawer('MarketplaceApi') }}>{i18n.t("monitoring:seo-top.observation-page.products.toolbar.marketplace-api")}</button>
                <button className="dropdown-item" onClick={() => { this.productFinder_openDrawer('MarketplaceSearch') }}>{i18n.t("monitoring:seo-top.observation-page.products.toolbar.marketplace-search")}</button>
            </DropdownToolbarButton>
        ];

        this.props.setFilterItems(this.state.request);
        this.props.setPrepareResponseSchemes({ callback: this.setPrepareResponseTask });
    }

    private getRequest = (): {} => {
        const { observationId } = this.props;

        let request = {
            orderBy: ['LastModificationDate desc'],
            select: [
                'OwnerId',
                'Id', 'Name',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ],
            filter: { ObservationId: getGuid(observationId, 'eq') }
        };

        return request;
    }

    private setPrepareResponseTask = (response: IResponsePayload<Product>)
        : IResponsePayload<Product> => {
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
            observationMarketplaceKind,

            onSave
        } = this.props;

        const {
            request,
            isOpenChangeReferenceDrawer,
            searchKind
        } = this.state;

        const { stateFilter } = this.state;
        const selectedProductStateFilter = stateFilter && getDropDownItemValue<string>(
            'ProductState',
            stateFilter.filters,
            this.productStateItems,
            this.defaultDropDownItem);

        const selectedMarketplaceKindFilter = stateFilter && getDropDownItemValue<string>(
            'MarketPlaceKind',
            stateFilter.filters,
            this.marketplaceKindItems,
            this.defaultDropDownItem);

        return (
            <>
                <DataGrid
                    id="products"
                    ref={this.gridRef}
                    request={request}
                    fetchItems={this.props.fetchItems}
                    items={this.props.items}
                    customFilter={stateFilter}
                    initSort={[{ field: 'LastModificationDate', dir: 'desc' }]}
                    height={ContainerHeightType.All}
                    toolbarItems={this.toolbarItems}
                >
                    <GridColumn
                        field="VendorCode"
                        title={i18n.t("products:table.columns.vendor-code")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target="_blank" />}
                    />
                    <GridColumn
                        field="BarCode"
                        title={i18n.t("products:table.columns.bar-code")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target="_blank" />}
                    />
                    <GridColumn
                        field="Name"
                        title={i18n.t("products:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target="_blank" />}
                    />
                    <GridColumn
                        field="MarketPlaceKind"
                        title={i18n.t("products:table.columns.marketplace")}
                        sortable={true}
                        filterable={true}
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.marketplaceKindItems}
                                selected={selectedMarketplaceKindFilter}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onMarketplaceKindFilterChange}
                            />
                        }
                    />
                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("components:data-grid.columns.creation-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                    />
                    <GridColumn
                        field="ProductState"
                        title={i18n.t("products:table.columns.product-state")}
                        sortable={false}
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.productStateItems}
                                selected={selectedProductStateFilter}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onProductStateFilterChange}
                            />
                        }
                    />
                </DataGrid>

                <Drawer
                    headerComponent={<TitleHeader title={i18n.t('monitoring:seo-top.observation-page.products.product-finder.title')} />}
                    mainComponent={
                        <ProductFinder
                            searchKind={searchKind}
                            marketplaceKind={observationMarketplaceKind}

                            onSave={onSave}
                            onSumbitSuccess={this.productFinder_onSubmitSuccess}
                            onClose={this.productFinder_closeDrawer}
                        />
                    }
                    isOpen={isOpenChangeReferenceDrawer}
                    onClose={this.productFinder_closeDrawer}
                    minWidth={DrawerWidth}
                />
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onProductStateFilterChange = (e: IChangeEventParams<string>) => {
        const fieldName = 'ProductState';
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

    private onMarketplaceKindFilterChange = (e: IChangeEventParams<string>) => {
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

    private productFinder_openDrawer = (searchKind: Bantikom.SearchKind) => {
        this.setState(() => ({
            isOpenChangeReferenceDrawer: true,
            searchKind
        }))
    }

    private productFinder_closeDrawer = () => {
        this.setState(() => ({
            isOpenChangeReferenceDrawer: false
        }))
    }

    private productFinder_onSubmitSuccess = (response: {}) => {
        this.gridRef.current.reload();
        this.productFinder_closeDrawer();

        if (this.props.onSumbitSuccess) {
            this.props.onSumbitSuccess(response);
        }
    }

}

export {
    IDispatchProps,
    IStateProps,
    IOwnProps,
    ObservationProductsTable
};
