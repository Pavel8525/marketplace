import *  as React from 'react';
import i18n from 'i18next';
import { GridColumn } from '@progress/kendo-react-grid';

import { IEnvironmentSettings } from 'app/common/contracts';
import {
    IPaginationState,
    GetNextPage,
    SetFilter
} from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Bantikom } from 'app/common/core/api/proxy';
import { DataGrid } from 'app/common/components';
import { Clear, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';
import { getBatchHeaders, getGuid } from 'app/common/core/api/odata-helper';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Guid } from 'app/common/helpers/string-helper';

type ObservationProductKeyword = Bantikom.ObservationProductKeyword;

interface IDispatchProps {
    setFilterItems: SetFilter<{}>;
    fetchItems: GetNextPage<{}>;
    clear: Clear;
    save: InvokeSpecificUrl<{}, {}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<ObservationProductKeyword, {}>;
    saveState: IOperationState<ISingleODataResponse<{}>>;
}

interface IOwnProps {
    observationProductId: string;
    toolbarPortalName?: string;
}

interface IState {
    request: any;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;


class ObservationProductKeywordsTable extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            request: this.getRequest()
        };

        this.props.setFilterItems(this.state.request);
    }

    private gridRef = React.createRef<DataGrid>();

    public render() {
        const {
            items,
            toolbarPortalName,
            saveState,
            fetchItems
        } = this.props;


        const {
            request,
        } = this.state;

        return (
            <>
                <DataGrid
                    id="observation-product-keywords-table"
                    ref={this.gridRef}
                    request={request}
                    fetchItems={fetchItems}
                    items={items}
                    filterable={false}
                    initSort={[{ field: 'CreationDate', dir: 'asc' }]}
                    height={300}
                    toolbarPortalName={toolbarPortalName}
                    editable={true}
                    canAdd={true}
                    createDefaultItem={this.createDefaultItem}
                    entityName={"ObservationProductKeyword"}
                    applyBacthOperationState={saveState}
                    onApplyBatchChanges={this.onApplyChages}
                >
                    <GridColumn
                        field="Name"
                        title={i18n.t("monitoring:seo-top.observation-page.products.keywords.table.columns.name")}
                        editor="text"
                    />

                    <GridColumn
                        field="Synonyms"
                        title={i18n.t("monitoring:seo-top.observation-page.products.keywords.table.columns.synonyms")}
                        editor="text"
                    />

                    <GridColumn
                        field="Enabled"
                        title={i18n.t("monitoring:seo-top.observation-page.products.keywords.table.columns.enabled")}
                        editor="boolean"
                    />
                </DataGrid>
            </>
        );
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private getRequest = (): {} => {
        const { observationProductId } = this.props;

        let request = {
            select: [
                'Enabled', 'Synonyms',
                'Id', 'Name',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ],
            filter: { ObservationProductId: getGuid(observationProductId, 'eq') }
        };

        return request;
    }

    private onApplyChages = (batchId: string, payload: string): Promise<{}> => {
        const promise = this.props.save(
            payload,
            null,
            null,
            getBatchHeaders(batchId)
        );

        promise.then(() => {
            this.gridRef.current.reload();
        });

        return promise;
    }

    private createDefaultItem = (): Partial<Bantikom.ObservationProductKeyword> => {
        return {
            Name: '',
            Synonyms: '',
            Enabled: true,
            Id: Guid.newGuid(),
            ObservationProductId: this.props.observationProductId
        }
    }
}

export {
    IDispatchProps,
    IStateProps,
    IOwnProps,
    ObservationProductKeywordsTable
};