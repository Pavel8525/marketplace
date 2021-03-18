import 'app/common/components/data-grid/styles/data-grid.css';
import '../styles/user-orders-list.css';

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
import { getEnumOrderState } from 'app/common/core/api/enum-source';
import { IDropDownItem, IChangeEventParams } from 'app/common/components/data-grid/contracts';
import { getNotSelectedDropDownItem } from 'app/common/components/data-grid/contracts/IDropDownItem';

type UserOrder = Bantikom.UserOrder;

const NumberTaskCell = (props: GridCellProps) => {
    const userOrder = props.dataItem as UserOrder;
    const badTask = userOrder.NumberStoppedTasks;
    const doneTasks = userOrder.NumberDoneTasks + userOrder.NumberCanceledTasks;

    return (
        <td className="number-task-column">

            {!!userOrder.NumberNotStartedTasks && (
                <>
                    <span
                        style={{ color: 'gray' }}
                        title={i18n.t("user-orders:table.columns.number-all-tasks-cell.number-not-sarted-tasks")}
                    >
                        {userOrder.NumberNotStartedTasks}
                    </span>
                    {" / "}
                </>
            )}

            {!!badTask && (
                <>
                    <span
                        style={{ color: 'red' }}
                        title={i18n.t("user-orders:table.columns.number-all-tasks-cell.bad")}
                    >
                        {badTask}
                    </span>
                    {" / "}
                </>
            )}

            {!!userOrder.NumberInProgressTasks && (
                <>
                    <span
                        style={{ color: 'blue' }}
                        title={i18n.t("user-orders:table.columns.number-all-tasks-cell.in-progress")}
                    >
                        {userOrder.NumberInProgressTasks}
                    </span>
                    {" / "}
                </>
            )}

            {!!doneTasks && (
                <>
                    <span
                        style={{ color: 'limegreen' }}
                        title={i18n.t("user-orders:table.columns.number-all-tasks-cell.done")}
                    >
                        {doneTasks}
                    </span>
                    {" / "}
                </>
            )}

            <span
                title={i18n.t("user-orders:table.columns.number-all-tasks-cell.all")}
            >
                {userOrder.NumberAllTasks}
            </span>
        </td>
    );
}

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<Bantikom.UserOrder, {}>;
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

class UserOrdersTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private enumOrderState = getEnumOrderState();
    private orderStateItems = this.enumOrderState
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
                'OrderState',
                'IsClosed', 'ClosedReason',
                'IsError', 'ErrorReason',
                'CreationDate', 'LastModificationDate',
                'NumberAllTasks', 'NumberInProgressTasks', 'NumberStoppedTasks', 'NumberCanceledTasks', 'NumberDoneTasks', 'NumberNotStartedTasks'
            ],
            expand: {
                ServiceType: {
                    select: ['Id', 'Name', 'Paid']
                }
            }
        }
    }

    private setPrepareResponseTask = (response: IResponsePayload<Bantikom.UserOrder>)
        : IResponsePayload<Bantikom.UserOrder> => {
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
        const selectedOrderState = stateFilter && getDropDownItemValue<string>(
            'OrderState',
            stateFilter.filters,
            this.orderStateItems,
            this.defaultDropDownItem);

        return (
            <>
                <DataGrid
                    id="user-orders"
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
                        title={i18n.t("user-orders:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="user-orders/card" target="_self" />}
                        width={200}
                    />

                    <GridColumn
                        field="OrderState"
                        title={i18n.t("user-orders:table.columns.order-state")}
                        sortable={false}
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.orderStateItems}
                                selected={selectedOrderState}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onOrderStateChange}
                            />
                        }
                        width={250}
                    />

                    <GridColumn
                        field="ServiceType.Name"
                        title={i18n.t("user-orders:table.columns.service-type-name")}
                        sortable={false}
                        filterable={false}
                        width={250}
                    />

                    <GridColumn
                        field="NumberAllTasks"
                        title={i18n.t("user-orders:table.columns.number-all-tasks")}
                        sortable={false}
                        filterable={false}
                        width={200}
                        cell={NumberTaskCell}
                    />

                    <GridColumn
                        field="IsError"
                        title={i18n.t("user-orders:table.columns.is-error")}
                        width={200}
                        filter="boolean"
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

    private onOrderStateChange = (e: IChangeEventParams<string>) => {
        const fieldName = 'OrderState';
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
    UserOrdersTable
};
