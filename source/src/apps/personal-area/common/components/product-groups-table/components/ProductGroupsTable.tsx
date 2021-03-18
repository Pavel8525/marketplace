import 'app/common/components/data-grid/styles/data-grid.css';

import *  as React from 'react';
import i18n from 'i18next';

import { GridColumn } from '@progress/kendo-react-grid';
import { parseDate } from '@telerik/kendo-intl';

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
    ContainerHeightType
} from 'app/common/components';
import { AddButton } from 'app/common/components/data-grid/components/ToolbarItems';

type ProductGroup = Bantikom.ProductGroup;

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<ProductGroup, {}>;
}

interface IOwnProps {
    gridHeight?: ContainerHeightType;
    gotoNewItemPage: () => void;
}

interface IState {
    request: any;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ProductGroupsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
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
                'CountItems',
                'CreationDate', 'LastModificationDate'
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

        return (
            <>
                <DataGrid
                    id="product-groups"
                    ref={this.gridRef}
                    request={request}
                    fetchItems={this.props.fetchItems}
                    items={this.props.items}
                    initSort={[{ field: 'LastModificationDate', dir: 'desc' }]}
                    height={gridHeight}
                    toolbarItems={this.toolbarItems}
                >
                    <GridColumn
                        field="LastModificationDate"
                        title={i18n.t("components:data-grid.columns.last-modification-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        width={250}
                    />

                    <GridColumn
                        field="Name"
                        title={i18n.t("product-groups:table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="product-groups/card" target="_self" />}
                    />

                    <GridColumn
                        field="CountItems"
                        title={i18n.t("product-groups:table.columns.count-items")}
                        filter="numeric"
                    />

                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("components:data-grid.columns.creation-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        width={250}
                    />

                </DataGrid>
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }
}

export {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    ProductGroupsTable
};
