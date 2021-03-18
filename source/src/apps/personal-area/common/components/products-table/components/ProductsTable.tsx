import 'app/common/components/data-grid/styles/data-grid.css';

import *  as React from 'react';
import i18n from 'i18next';

import { GridCellProps, GridColumn } from '@progress/kendo-react-grid';
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
    ProductLookupChooser,
    TitleHeader
} from 'app/common/components';
import { AddButton, ImportProductButton, AddReferenceButton, RemoveReferenceButton } from 'app/common/components/data-grid/components/ToolbarItems';
import { getEnumMarketplaceKind, getEnumProductState } from 'app/common/core/api/enum-source';
import { IDropDownItem, IChangeEventParams } from 'app/common/components/data-grid/contracts';
import { getNotSelectedDropDownItem } from 'app/common/components/data-grid/contracts/IDropDownItem';
import { Clear } from 'app/common/core/data';
import { dataGridHeight } from 'app/common/constants';
import { getGuid } from 'app/common/core/api/odata-helper';
import { OperationChangeReference } from 'app/common/components/lookup-chooser/contracts';

type Product = Bantikom.Product;

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
    gridHeight?: ContainerHeightType | number;
    productGroupId?: string;
    openTarget?: '_self' | '_blank';
    showMultiLookupButton?: boolean;

    gotoNewItemPage?: (() => void) | string;
    gotoImportProductPage?: () => void;
    onReload?: () => void;
}

interface IState {
    request: any;
    isOpenChangeReferenceDrawer: boolean;
    stateFilter?: CompositeFilterDescriptor;
    operationChangeReference?: OperationChangeReference;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductsTable extends React.Component<IProps, IState> {
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
            <AddButton
                buttonOnClick={typeof this.props.gotoNewItemPage === 'function' ? this.props.gotoNewItemPage : null}
                href={typeof this.props.gotoNewItemPage === 'string' ? this.props.gotoNewItemPage : null}
            />
        ];

        if (this.props.gotoImportProductPage) {
            this.toolbarItems.push(<ImportProductButton buttonOnClick={this.props.gotoImportProductPage} />);
        }

        if (this.props.showMultiLookupButton) {
            this.toolbarItems.push(<AddReferenceButton buttonOnClick={() => this.openChangeReferenceDrawer(OperationChangeReference.add)} />);
            this.toolbarItems.push(<RemoveReferenceButton buttonOnClick={() => this.openChangeReferenceDrawer(OperationChangeReference.remove)} />)
        }

        this.props.setFilterItems(this.state.request);
        this.props.setPrepareResponseSchemes({ callback: this.setPrepareResponseTask });
    }

    private getRequest = (): {} => {
        const { productGroupId } = this.props;

        let request = {
            orderBy: ['LastModificationDate desc'],
            select: [
                'OwnerId',
                'Id', 'Name',
                'VendorCode', 'BarCode',
                'MarketPlaceKind',
                'ProductState', 'SaleState', 'ModerationState',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ],
            filter: { MarketPlaceKind: 'Internal' }
        };

        if (productGroupId) {
            const filterExpression = {
                Groups: {
                    any: { Id: getGuid(productGroupId, 'eq') }
                }
            };

            (request.filter as any) = {
                and: [request.filter, filterExpression]
            }
        }

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
            gridHeight = dataGridHeight,
            openTarget = '_self',
            productGroupId
        } = this.props;

        const {
            request,
            isOpenChangeReferenceDrawer,
            operationChangeReference
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
                    height={gridHeight}
                    toolbarItems={this.toolbarItems}
                >
                    <GridColumn
                        field="VendorCode"
                        title={i18n.t("products:table.columns.vendor-code")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={openTarget} />}
                    />
                    <GridColumn
                        field="BarCode"
                        title={i18n.t("products:table.columns.bar-code")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={openTarget} />}
                    />
                    <GridColumn
                        field="Name"
                        title={i18n.t("products:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={openTarget} />}
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
                    headerComponent={<TitleHeader title={i18n.t('components:product-group-chooser.title')} />}
                    mainComponent={
                        <ProductLookupChooser
                            id="product-lookup-chooser-products-table"
                            entityId={productGroupId}
                            entityName='ProductGroup'
                            requestKind='ByGroup'
                            selectKind="multiple"
                            operation={operationChangeReference}
                            onClose={this.closeChangeReferenceDrawer}
                            onSuccess={this.reloadData}
                        />
                    }
                    isOpen={isOpenChangeReferenceDrawer}
                    onClose={this.closeChangeReferenceDrawer}
                    minWidth={900}
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

    private openChangeReferenceDrawer = (operationChangeReference: OperationChangeReference) => {
        this.setState(() => ({
            isOpenChangeReferenceDrawer: true,
            operationChangeReference
        }))
    }

    private closeChangeReferenceDrawer = () => {
        this.setState(() => ({
            isOpenChangeReferenceDrawer: false
        }))
    }

    private reloadData = () => {
        this.gridRef.current.reload();
        if (this.props.onReload) {
            this.props.onReload();
        }
    }
}

export {
    IDispatchProps,
    IStateProps,
    IOwnProps,
    ProductsTable
};
