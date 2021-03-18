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
    ContainerHeightType,
    Drawer,
    TitleHeader
} from 'app/common/components';
import { AddButton } from 'app/common/components/data-grid/components/ToolbarItems';
import { AbTestCreateForm } from '../containers/AbTestCreateForm';
import { drawerWidth } from 'app/common/constants';

type ProductGroup = Bantikom.ProductGroup;

const DRAWER_WIDTH = drawerWidth;


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
}

interface IState {
    request: any;
    abTestCreation_isOpen: boolean;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class AbTestsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private toolbarItems: JSX.Element[];

    constructor(props: IProps) {
        super(props);

        this.state = {
            request: this.getRequest(),
            abTestCreation_isOpen: false
        };

        this.toolbarItems = [
            <AddButton buttonOnClick={this.gotoNewItemPage} />
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
        const {
            request,
            abTestCreation_isOpen
        } = this.state;

        return (
            <>
                <DataGrid
                    id="abtests-table"
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
                        title={i18n.t("components:data-grid.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="promotions/abtest/card" target="_self" />}
                    />

                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("components:data-grid.columns.creation-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        width={250}
                    />

                </DataGrid>

                {/* A/B test create from */}
                <Drawer
                    headerComponent={
                        <TitleHeader title={i18n.t('abtests:drawers.ab-test-create-form.title')} />
                    }
                    mainComponent={
                        <AbTestCreateForm
                            gotoItem={this.ReloadData}
                        />
                    }
                    isOpen={abTestCreation_isOpen}
                    onClose={this.closeAbTestCreationDrawer}
                    minWidth={DRAWER_WIDTH}
                />
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    public ReloadData = () => {
        this.gridRef.current.reload();
        this.closeAbTestCreationDrawer();
    }

    private closeAbTestCreationDrawer = () => {
        this.setState(() => ({
            abTestCreation_isOpen: false
        }));
    }

    private gotoNewItemPage = () => {
        this.setState(() => ({
            abTestCreation_isOpen: true
        }))
    }
}

export {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    AbTestsTable
};
