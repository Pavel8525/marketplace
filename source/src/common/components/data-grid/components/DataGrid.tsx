import 'app/common/components/data-grid/styles/data-grid.css';

import * as React from 'react';
import {
    Grid,
    GridPageChangeEvent,
    GridFilterChangeEvent,
    GridSortChangeEvent,
    GridToolbar,
    GridColumnReorderEvent,
    GridColumnProps,
    GridNoRecords,
    GridDetailRowProps,
    GridExpandChangeEvent,
    GridItemChangeEvent
} from '@progress/kendo-react-grid';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { IntlProvider, load } from '@progress/kendo-react-intl';
import { debounce, sortBy, groupBy } from "underscore";

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import ruNumbers from 'cldr-numbers-full/main/ru/numbers.json';
import ruCurrencies from 'cldr-numbers-full/main/ru/currencies.json';
import ruCaGregorian from 'cldr-dates-full/main/ru/ca-gregorian.json';
import ruDateFields from 'cldr-dates-full/main/ru/dateFields.json';
import ruTimeZoneNames from 'cldr-dates-full/main/ru/timeZoneNames.json';
import enNumbers from 'cldr-numbers-full/main/en/numbers.json';
import enCurrencies from 'cldr-numbers-full/main/en/currencies.json';
import enCaGregorian from 'cldr-dates-full/main/en/ca-gregorian.json';
import enDateFields from 'cldr-dates-full/main/en/dateFields.json';
import enTimeZoneNames from 'cldr-dates-full/main/en/timeZoneNames.json';

import { IPaginationState, GetNextPage } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { any } from 'app/common/helpers/array-helper';
import {
    mergeRequest,
    combineFilter,
    getPageSettings,
    getSkipTakeSettings
} from 'app/common/components/data-grid/helpers/data-grid-helper';
import { DataGridLoader, FullHeightPanel, ContainerHeightType, PanelHeaderPortal } from 'app/common/components';
import i18n, { getCurrentLanguage } from 'app/common/core/translation/i18n';
import { applicationPrefixKey } from 'app/common/constants';
import { getBatchPayload } from 'app/common/core/api/odata-helper';
import { IOperationState } from 'app/common/core/data';

import { AddButton, CancelButton, ExportPdfButton, SaveButton } from './ToolbarItems';
import { getContentWindowHeight } from '../../panels/helpers/window-helper';
import { IContainerDeltaChanges, IDeltaChangeItem } from '../contracts';

load(
    likelySubtags,
    currencyData,
    weekData,
    ruNumbers,
    ruCurrencies,
    ruCaGregorian,
    ruDateFields,
    ruTimeZoneNames,
    enNumbers,
    enCurrencies,
    enCaGregorian,
    enDateFields,
    enTimeZoneNames
);

const FILTER_DEBOUNCE_INTERVAL = 300;
const EDITABLE_FIELD = "__EDITABLE__";
const EXPANDED_FIELD = "__EXPANDED__";
const NEWBY_FIELD = '__NEWBY__'
const REMOVE_FIELD = '__REMOVED__';

interface IColumnOrder {
    name: string;
    index: number;
}

interface IProps {
    id: string;

    request: {};
    fetchItems: GetNextPage<{}>;
    items: IPaginationState<{}, {}>;

    customFilter?: CompositeFilterDescriptor;
    initSort?: Array<SortDescriptor>;
    filterable?: boolean;
    pageable?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    reorderable?: boolean;
    editable?: boolean;

    height?: ContainerHeightType | number;
    heightOffset?: number;

    toolbarPortalName?: string;
    toolbarItems?: JSX.Element[];
    canExportToPdf?: boolean;
    locale?: string;

    NoRecordTitle?: string | JSX.Element;

    RowDetail?: React.ComponentType<GridDetailRowProps>;

    canAdd?: boolean;
    fieldIdName?: string;
    entityName?: string;
    applyBacthOperationState?: IOperationState<{}>;
    createDefaultItem?: () => any;
    onApplyBatchChanges?: (batchId: string, payload: {}) => Promise<{}>;
}

interface IState {
    dataState: {
        filter?: CompositeFilterDescriptor;
        sort?: Array<SortDescriptor>;
    },

    deltaChanges?: IContainerDeltaChanges;
}

class DataGrid extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dataState: {
                sort: this.props.initSort ? [...this.props.initSort] : null
            },
            deltaChanges: this.props.editable ? { IsDirty: false, Changes: [], OriginItems: [] } : null
        };

        this.filterDebounce = debounce(() => this.fetchItems(this.getDataState(null, null), 0, null), FILTER_DEBOUNCE_INTERVAL);

        this.toolbarItems = [
            ...this.props.toolbarItems || [],
            this.props.canAdd ? <AddButton buttonOnClick={this.addItem} /> : null,
            this.props.canExportToPdf ? <ExportPdfButton /> : null
        ].filter(item => item != null);

        if (props.id) {
            this.COLUMN_ORDERING_KEY = `${applicationPrefixKey}:components:data-grid:${props.id.toLowerCase()}:column-ordering`;
        }
    }

    private filterDebounce: () => void;
    private toolbarItems: JSX.Element[] = [];
    private COLUMN_ORDERING_KEY: string;
    private gridRef = React.createRef<Grid>();

    public render() {
        const {
            locale = getCurrentLanguage(),
            height,
            heightOffset = 0,
            NoRecordTitle = i18n.t("components:data-grid.messages.no-record-title"),
            filterable = true,
            pageable = true,
            sortable = true,
            resizable = true,
            reorderable = true,
            editable = false,
            toolbarPortalName,
            applyBacthOperationState,

            RowDetail,

        } = this.props;
        const {
            items,
            count,
            pageNo,
            pageSize
        } = this.props.items;
        const {
            deltaChanges
        } = this.state;

        const columns = this.getOrderedColumns();
        const calculateHeight = getContentWindowHeight(height, heightOffset);
        const calculateHeightStyle = calculateHeight ? { height: calculateHeight } : null;
        let toolbarItems = [...this.toolbarItems];

        if (editable) {
            toolbarItems.unshift(
                <SaveButton disabled={!deltaChanges.IsDirty} buttonOnClick={this.onSaveChanges} />,
                <CancelButton disabled={!deltaChanges.IsDirty} buttonOnClick={this.onCancelChanges} />
            );
        }

        return (
            <FullHeightPanel
                height={height}
                heightOffset={heightOffset}
            >
                <IntlProvider locale={locale} >
                    <Grid
                        ref={this.gridRef}
                        style={calculateHeightStyle}
                        data={items}
                        total={count}

                        pageable={pageable}
                        filterable={filterable}
                        sortable={sortable}
                        resizable={resizable}
                        reorderable={reorderable}

                        expandField={EXPANDED_FIELD}
                        detail={RowDetail}

                        editField={editable ? EDITABLE_FIELD : null}
                        onItemChange={editable ? this.editItem : null}

                        onPageChange={this.onPageChange}
                        onSortChange={this.onSortChange}
                        onFilterChange={this.onFilterChange}
                        onScroll={this.onScroll}
                        onColumnReorder={this.onColumnReorder}

                        onExpandChange={this.expandChange}

                        {...getSkipTakeSettings(pageNo, pageSize)}
                        {...this.state.dataState}
                    >

                        {!toolbarPortalName && any(toolbarItems) && (
                            <GridToolbar>
                                {toolbarItems.map((item, key) => (
                                    <div key={key} style={{ display: 'inline', paddingLeft: '5px' }}>
                                        {item}
                                    </div>
                                ))}

                            </GridToolbar>
                        )}

                        <GridNoRecords>
                            {NoRecordTitle}
                        </GridNoRecords>

                        {React.Children.map(columns, (column: JSX.Element, idx) => React.cloneElement(column, { ref: idx }))}

                    </Grid>
                </IntlProvider>

                {(this.props.items.fetching || (applyBacthOperationState && applyBacthOperationState.performing === true)) && (
                    <DataGridLoader />
                )}

                {toolbarPortalName && any(toolbarItems) && (
                    <PanelHeaderPortal portalName={toolbarPortalName}>
                        {toolbarItems.map((item, key) => (
                            <div key={key} style={{ display: 'inline', paddingLeft: '5px' }}>
                                {item}
                            </div>
                        ))}
                    </PanelHeaderPortal>
                )}


            </FullHeightPanel>
        );
    }

    public componentDidMount() {
        this.fetchItems(this.getDataState(null, null), null, null);

        if (this.props.height === ContainerHeightType.All) {
            window.addEventListener('resize', this.onWindowResize);
        }
    }

    public componentWillUnmount() {
        if (this.props.height === ContainerHeightType.All) {
            window.removeEventListener('resize', this.onWindowResize);
        }
    }

    public componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevProps.customFilter != this.props.customFilter) {
            this.onFilterChange({ filter: this.state.dataState.filter } as GridFilterChangeEvent);
        }
    }

    public reload = () => {
        this.fetchItems(this.getDataState(null, null), null, null);

        this.setState(() => ({
            deltaChanges: this.props.editable ? { IsDirty: false, Changes: [], OriginItems: [] } : null
        }))
    }

    private fetchItems = (dataState: State, pageNo: number, pageSize: number): Promise<void> => {
        const request = this.props.request;
        const composeRequest = mergeRequest(request, dataState);
        pageNo = pageNo != null ? pageNo : this.props.items.pageNo;
        pageSize = pageSize || this.props.items.pageSize;

        const promise = this.props.fetchItems(composeRequest, pageNo, pageSize);

        promise.then(() => {
            if (this.props.editable && any(this.props.items.items)) {
                this.props.items.items.forEach(item => (item as any)[EDITABLE_FIELD] = true);

                const originItems = this.props.items.items.map(item => Object.assign({}, item));

                this.setState(() => ({
                    deltaChanges: {
                        ...this.state.deltaChanges,
                        OriginItems: originItems
                    }
                }));
            }
        })

        this.setState(() => ({
            dataState: {
                ...dataState
            }
        }));

        return promise;
    }

    private getDataState = (filter: CompositeFilterDescriptor, sort: Array<SortDescriptor>) => {
        const dataState = {
            filter: filter !== null ? filter : this.state.dataState.filter,
            sort: sort || this.state.dataState.sort
        }

        return { ...dataState };
    }

    private onPageChange = (e: GridPageChangeEvent) => {
        const { pageNo, pageSize } = getPageSettings(e.page.skip, e.page.take);
        this.fetchItems(this.getDataState(null, null), pageNo, pageSize);
    }

    private onSortChange = (event: GridSortChangeEvent) => this.fetchItems(this.getDataState(null, event.sort), null, null);

    private onFilterChange = (event: GridFilterChangeEvent) => {
        const { customFilter } = this.props;
        this.setState(() => ({
            dataState: {
                ...this.state.dataState,
                filter: combineFilter(event.filter, customFilter)
            }
        }));

        this.filterDebounce();
    }


    private onScroll = () => {
        //infinite grid
        //https://www.telerik.com/kendo-react-ui/components/grid/scroll-modes/

        /*
        grid.scrollable="virtual"
                    
        const e = event.nativeEvent;
        if (e.target.scrollTop + 10 >= e.target.scrollHeight - e.target.clientHeight) {
            const moreData = availableProducts.splice(0, 10);
            if (moreData.length > 0) {
                this.setState({ gridData: this.state.gridData.concat(moreData) });
            }
        }
        */
    }

    private onWindowResize = () => this.forceUpdate();

    private getOrderedColumns = (): React.ReactNode[] => {
        const { children } = this.props;
        const columnOrdersString = localStorage.getItem(this.COLUMN_ORDERING_KEY);

        if (!columnOrdersString) {
            return children as React.ReactNode[];
        }

        let columnOrders = JSON.parse(columnOrdersString) as IColumnOrder[];

        if (!any(columnOrders)) {
            return children as React.ReactNode[];
        }

        columnOrders = sortBy(columnOrders, 'orderIndex');
        let newIndex = (children as []).length;

        const nodes: { index: number, node: React.ReactNode }[] = React.Children.map(children, (node, _) => {
            const field = (node as any).props.field;
            const foundColumnOrder = columnOrders.find(co => co.name === field);
            const index = foundColumnOrder ? foundColumnOrder.index : (newIndex++);

            return { index, node };
        });

        const sorted = sortBy(nodes, 'index').map(item => item.node);

        return sorted;
    }

    private onColumnReorder = (event: GridColumnReorderEvent) => {
        if (!this.COLUMN_ORDERING_KEY) {
            return;
        }

        const columns = sortBy(event.columns, 'orderIndex')
            .map<IColumnOrder>((column: GridColumnProps) => ({ name: column.field, index: column.orderIndex }));

        localStorage.setItem(this.COLUMN_ORDERING_KEY, JSON.stringify(columns));
    }

    private expandChange = (event: GridExpandChangeEvent) => {
        event.dataItem[EXPANDED_FIELD] = !event.dataItem[EXPANDED_FIELD];
        this.forceUpdate();
    }

    private addItem = () => {
        const {
            createDefaultItem,
            editable,
            fieldIdName = 'Id',
            entityName,
            items
        } = this.props;
        const {
            deltaChanges
        } = this.state;

        if (editable && createDefaultItem) {
            const defaultItem = createDefaultItem();
            defaultItem[EDITABLE_FIELD] = true;
            defaultItem[NEWBY_FIELD] = true;

            const changes = [...deltaChanges.Changes];
            for (var prop in defaultItem) {
                const change: IDeltaChangeItem = {
                    entityName,
                    entityId: defaultItem[fieldIdName],
                    fieldName: prop,
                    originValue: null,
                    changedValue: defaultItem[prop]
                };

                changes.push(change);
            }

            items.items.push(defaultItem);

            this.setState(() => ({
                deltaChanges: {
                    Changes: changes,
                    IsDirty: any(changes),
                    OriginItems: [...deltaChanges.OriginItems, Object.assign({}, defaultItem)]
                },
            }));
        }
    }

    private editItem = (event: GridItemChangeEvent) => {
        const {
            field,
            dataItem
        } = event;
        let {
            value
        } = event;
        const {
            entityName,
            fieldIdName = 'Id',
            items
        } = this.props;
        const {
            deltaChanges
        } = this.state;
        const entityId = dataItem[fieldIdName];
        const originItem = deltaChanges.OriginItems.find(item => item[fieldIdName] === entityId);
        const originValue = originItem[field];
        const changedItem: any = items.items.find((item: any) => item[fieldIdName] === entityId);

        // Fix is origin value string and nulled
        //
        if (originValue === null && typeof value === 'string' && value === '') {
            value = null;
        }

        let changes = [...deltaChanges.Changes];

        // Remove uncommited previous changes
        //
        changes = changes.filter(item => (item.entityId === entityId && item.fieldName == field) == false);

        // Add only updated change 
        //
        if (originValue !== value) {
            const change: IDeltaChangeItem = {
                entityName,
                entityId,
                fieldName: field,
                originValue: originItem[field],
                changedValue: value
            }

            changes.push(change);
            changedItem[field] = value;

        } else if (changedItem[field] != value) {
            changedItem[field] = value;
        }

        this.setState(() => ({
            deltaChanges: {
                ...deltaChanges,
                IsDirty: any(changes),
                Changes: changes
            }
        }));
    }

    private onSaveChanges = () => {
        const {
            editable,
            entityName,
            fieldIdName = 'Id',

            onApplyBatchChanges
        } = this.props;
        const {
            deltaChanges
        } = this.state;

        if (!(editable && any(deltaChanges.Changes) && onApplyBatchChanges)) {
            return;
        }

        const changes = groupBy(deltaChanges.Changes, (item) => item.entityId);
        const requests: any[] = [];
        for (let id in changes) {

            const originItem = deltaChanges.OriginItems.find((item: any) => item[fieldIdName] === id);
            const method = originItem[NEWBY_FIELD] === true ? 'POST' : originItem[REMOVE_FIELD] ? 'DELET' : 'PATCH';
            const requestUri = originItem[NEWBY_FIELD] === true ? entityName : entityName + '(' + id + ')';
            const data: any = {};
            changes[id].forEach(changeItem => {
                data[changeItem.fieldName] = changeItem.changedValue;
            });

            // Remove services fields
            //
            delete data[EXPANDED_FIELD];
            delete data[EDITABLE_FIELD];
            delete data[NEWBY_FIELD];
            delete data[REMOVE_FIELD];
            if (originItem[NEWBY_FIELD] === true) {
                delete data[fieldIdName];
            }

            requests.push({ requestUri, method, data });
        }

        // Get payload
        //
        const payload = getBatchPayload(requests);
        const batchId = payload.split(/\r?\n/)[1].trim().substring(2);
        onApplyBatchChanges(batchId, payload);

        // TODO parse responses
        //
        /*
        (window as any).odatajs.oData.request({
            requestUri: "http://192.168.30.10/api/$batch",
            method: "POST",
            data: {
                __batchRequests: [{ __changeRequests: requests }]
            }
        }, function (data: any, response: any) {
            //console.log(data.__batchResponses[0].data.value);
        }, undefined, (window as any).odatajs.oData.batch.batchHandler);*/
    }

    private onCancelChanges = () => {
        const {
            fieldIdName = 'Id',
            items
        } = this.props;
        const {
            Changes
        } = this.state.deltaChanges;

        Changes.forEach(changeItem => {
            const originItem: any = items.items.find((item: any) => item[fieldIdName] === changeItem.entityId);
            if (originItem) {
                originItem[changeItem.fieldName] = changeItem.originValue;
            }
        });

        this.props.items.items = [...this.props.items.items.filter((item: any) => !item[NEWBY_FIELD])];

        this.setState(() => ({
            deltaChanges: {
                ...this.state.deltaChanges,
                IsDirty: false,
                Changes: []
            }
        }))
    }
};

export { DataGrid };
