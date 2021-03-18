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
import { Bantikom } from 'app/common/core/api/proxy';
import {
    LinkCell,
    DataGrid,
    getDropDownItemValue,
    StringDropdownFilterCell,
    ContainerHeightType
} from 'app/common/components';
import { AddButton } from 'app/common/components/data-grid/components/ToolbarItems';
import { getEnumContactRole } from 'app/common/core/api/enum-source';
import { IDropDownItem, IChangeEventParams } from 'app/common/components/data-grid/contracts';
import { getNotSelectedDropDownItem } from 'app/common/components/data-grid/contracts/IDropDownItem';
import { getGuid } from 'app/common/core/api/odata-helper';
import { dataGridHeight } from 'app/common/constants';

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    setPrepareResponseSchemes: SetPrepareResponse<{}>;
    fetchItems: GetNextPage<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<Bantikom.Contact, {}>;
}

interface IOwnProps {
    gridHeight?: ContainerHeightType;
    leadId?: string;
    customerId?: string;
    openTarget?: '_self' | '_blank';
    gotoNewItemPage: () => void;
}

interface IState {
    request: any;
    stateFilter?: CompositeFilterDescriptor;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class ContactsTable extends React.Component<IProps, IState> {
    private gridRef = React.createRef<DataGrid>();
    private enumContactRole = getEnumContactRole();
    private contactRoleItems = this.enumContactRole
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
        const { leadId, customerId } = this.props;
        let filter: any = null;

        if (leadId) {
            filter = { LeadId: getGuid(leadId, 'eq') };
        }

        if (customerId) {
            filter = { CustomerId: getGuid(customerId, 'eq') };
        }

        return {
            filter: [filter],
            orderBy: ['LastModificationDate desc'],
            select: [
                'Id', 'Name',
                'LastModificationDate', 'CreationDate',
                'FirstName', 'LastName', 'MiddleName',
                'ContactRole',
                'Email', 'PhoneNumber',
                'RowVersion'
            ]
        }
    }

    private setPrepareResponseTask = (response: IResponsePayload<Bantikom.Contact>)
        : IResponsePayload<Bantikom.Contact> => {
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
            openTarget = '_blank',
            gridHeight = dataGridHeight
        } = this.props;

        const { request } = this.state;

        const { stateFilter } = this.state;
        const selectedState = stateFilter && getDropDownItemValue<string>(
            'ContactRole',
            stateFilter.filters,
            this.contactRoleItems,
            this.defaultDropDownItem);

        return (
            <>
                <DataGrid
                    id="contacts"
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
                        field="Name"
                        title={i18n.t("contacts:contacts-table.columns.name")}
                        cell={(props) => <LinkCell {...props} keyField="Id" path="managers/contacts" target={openTarget} />}
                    />
                    <GridColumn
                        field="ContactRole"
                        title={i18n.t("contacts:contacts-table.columns.contact-role")}
                        sortable={false}
                        filterCell={() =>
                            <StringDropdownFilterCell
                                data={this.contactRoleItems}
                                selected={selectedState}
                                defaultValue={this.defaultDropDownItem}
                                onChange={this.onContactRoleChange}
                            />
                        }
                    />

                    <GridColumn
                        field="PhoneNumber"
                        title={i18n.t("contacts:contacts-table.columns.phone-number")}
                    />

                    <GridColumn
                        field="Email"
                        title={i18n.t("contacts:contacts-table.columns.email")}
                    />

                    <GridColumn
                        field="LastModificationDate"
                        title={i18n.t("components:data-grid.columns.last-modification-date")}
                        filter="date"
                        format={this.props.environmentSettings.localizationSettings.dateFormat}
                        filterable={false}
                    />
                </DataGrid>

            </>
        );
    }

    private onContactRoleChange = (e: IChangeEventParams<string>) => {
        const fieldName = 'ContactRole';
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

export { IDispatchProps, IStateProps, IOwnProps, ContactsTable };
