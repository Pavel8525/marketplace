import *  as React from 'react';
import i18n from 'i18next';

import { GridColumn } from '@progress/kendo-react-grid';
import { parseDate } from '@telerik/kendo-intl';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import 'app/common/components/data-grid/styles/data-grid.css';

import { any } from 'app/common/helpers/array-helper';
import { IEnvironmentSettings } from 'app/common/contracts';
import {
    IPaginationState,
    GetNextPage,
    SetFilter,
    IResponsePayload,
    SetPrepareResponse
} from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Clear } from 'app/common/core/data';

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

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
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

class ConnectedMarketplacesTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private enumMarketplaceKind = getEnumMarketplaceKind().filter((kind) => kind.value !== 'Internal');
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
                'Id', 'Name', 'Active',
                'MarketplaceKind', 'LoginState', 'ApiState',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ]
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
        const selectedMarketplaceKind = stateFilter && getDropDownItemValue<string>(
            'MarketplaceKind',
            stateFilter.filters,
            this.marketplaceKindItems,
            this.defaultDropDownItem);

        return (
            <>
                <DataGrid
                    id="connected-marketplaces"
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
                        field="LastModificationDate"
                        title={i18n.t("components:data-grid.columns.last-modification-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        width={200}
                    />

                    <GridColumn
                        field="Name"
                        title={i18n.t("marketplaces:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="reference-book/connected-marketplaces/card" target="_self" />}
                    />

                    <GridColumn
                        field="MarketplaceKind"
                        title={i18n.t("marketplaces:table.columns.marketplace-kind")}
                        sortable={false}
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.marketplaceKindItems}
                                selected={selectedMarketplaceKind}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onMarketplaceKindChange}
                            />
                        }
                        width={200}
                    />

                    <GridColumn
                        field="Active"
                        title={i18n.t("marketplaces:table.columns.active")}
                        width={200}
                        filter="boolean"
                        sortable={false}
                    />

                    <GridColumn
                        field="LoginState"
                        title={i18n.t("marketplaces:table.columns.login-state")}
                        width={200}
                        filterable={false}
                        sortable={false}
                    />

                    <GridColumn
                        field="ApiState"
                        title={i18n.t("marketplaces:table.columns.api-state")}
                        width={200}
                        filterable={false}
                        sortable={false}
                    />

                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("components:data-grid.columns.creation-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        width={200}
                    />

                </DataGrid>
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onMarketplaceKindChange = (e: IChangeEventParams<string>) => {
        const fieldName = 'MarketplaceKind';
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

export {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    ConnectedMarketplacesTable
};
