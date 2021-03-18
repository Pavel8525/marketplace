import *  as React from 'react';
import i18n from 'i18next';

import { connect } from 'react-redux';
import { GridColumn } from '@progress/kendo-react-grid';
import { parseDate } from '@telerik/kendo-intl';

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
import { Bantikom } from 'app/common/core/api/proxy';
import {
    LinkCell,
    DataGrid,
    ContainerHeightType
} from 'app/common/components';
import { AddButton } from 'app/common/components/data-grid/components/ToolbarItems';

interface IDispatchProps {
    setFilterLeads: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchLeads: GetNextPage<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    leads: IPaginationState<Bantikom.Lead, {}>;
}

interface IOwnProps {
    gridHeight?: ContainerHeightType;
    gotoNewLeadPage: () => void;
}

interface IState {
    request: any;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class LeadsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();

    private toolbarItems: JSX.Element[];

    constructor(props: IProps) {
        super(props);

        this.state = {
            request: this.getRequest()
        };

        this.toolbarItems = [
            <AddButton buttonOnClick={this.props.gotoNewLeadPage} />
        ];

        this.props.setFilterLeads(this.state.request);
        this.props.setPrepareResponseSchemes({ callback: this.setPrepareResponseTask });
    }

    private getRequest = (): {} => {
        return {
            orderBy: ['LastModificationDate desc'],
            select: [
                'OwnerId',
                'Id', 'Name',
                'CreationDate', 'LastModificationDate',
                'LegalEntityKind', 'Status',
                'Country', 'Region', 'City', 'SiteUrl',
                'RowVersion'
            ]
        }
    }

    private setPrepareResponseTask = (response: IResponsePayload<Bantikom.Lead>)
        : IResponsePayload<Bantikom.Lead> => {
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
                    id="leads"
                    ref={this.gridRef}
                    request={request}
                    fetchItems={this.props.fetchLeads}
                    items={this.props.leads}
                    initSort={[{ field: 'LastModificationDate', dir: 'desc' }]}
                    height={gridHeight}
                    toolbarItems={this.toolbarItems}
                >
                    <GridColumn
                        field="Name"
                        title={i18n.t("schemes:schemes-table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="managers/leads" target="_self" />}
                        width="400px"
                    />
                    <GridColumn
                        field="CreationDate"
                        title={i18n.t("schemes:schemes-table.columns.creation-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                    />
                    <GridColumn
                        field="LastModificationDate"
                        title={i18n.t("schemes:schemes-table.columns.modification-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                    />
                    <GridColumn
                        field="Comment"
                        title={i18n.t("schemes:schemes-table.columns.comment")}
                    />
                    <GridColumn
                        field="TagsString"
                        title={i18n.t("schemes:schemes-table.columns.tags")}
                    />
                    <GridColumn
                        field="HasPublish"
                        title={i18n.t("schemes:schemes-table.columns.published")}
                        filter="boolean"
                    />
                </DataGrid>

            </>
        );
    }
}

const LeadsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            leads: state.odataService.LeadPage
        };
    },
    {
        setFilterLeads: Bantikom.LeadService.getLeadPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.LeadService.getLeadPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchLeads: Bantikom.LeadService.getLeadPage.getNextPage as GetNextPage<{}>
    }
)(LeadsTable);

export { LeadsTableConnected as LeadsTable };