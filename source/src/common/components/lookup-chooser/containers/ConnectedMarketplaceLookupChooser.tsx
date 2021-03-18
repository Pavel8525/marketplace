import { connect } from "react-redux";
import React from "react";
import i18n from "app/common/core/translation/i18n";
import { bindActionCreators } from "redux";
import { GridColumn } from "@progress/kendo-react-grid";

import { Bantikom } from 'app/common/core/api/proxy';
import { GetNextPage, paginationReducerFactory } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';
import { getPageODataResponse, IPageableODataResponse } from "app/common/core/api/contracts/odata-response";

import { LinkCell } from "../..";

import { LookupChooser } from "../components/LookupChooser";
import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { MarketplaceKind } from "app/common/core/api/proxy-ext";

type ConnectedMarketplace = Bantikom.ConnectedMarketplace;

const getLookupName = (key: string): string => `ConnectedMarketplacePage_${key}`;

const reducerCreator = (reducerKey: string) => {
    const reducerFactory: any = paginationReducerFactory<IPageableODataResponse<ConnectedMarketplace>, {}>(
        `get:${reducerKey}`,
        "/ConnectedMarketplace",
        undefined,
        false,
        (response => getPageODataResponse<ConnectedMarketplace>(response))
    );

    reducerFactory.reducer = reducerFactory.paginationReducer;
    return reducerFactory;
}

let dataGridColumns: any;

interface IConnectedMarketplaceLookupChooser extends IOwnProps {
    marketplaceKind?: MarketplaceKind;
}

const ConnectedMarketplaceLookupChooserConnected = connect<IStateProps<ConnectedMarketplace>, IDispatchProps, IConnectedMarketplaceLookupChooser>(
    (state: any, props: IConnectedMarketplaceLookupChooser) => {
        const {
            id,
            marketplaceKind,

            onSave
        } = props;

        const request: any = {
            orderBy: ['LastModificationDate desc'],
            select: [
                'Name', 'Code', 'Id',
                'CreationDate', 'LastModificationDate',
                'MarketplaceKind'
            ]
        };
        if (marketplaceKind) {
            request.filter = { MarketplaceKind: marketplaceKind };
        }

        const reducerKey = getLookupName(id);

        dataGridColumns = dataGridColumns || [
            <GridColumn
                field="Name"
                title={i18n.t("marketplaces:table.columns.name")}
                cell={(props) => <LinkCell {...props} keyField="Id" path="reference-book/connected-marketplaces/card" target='_blank' />}
            />,
            <GridColumn
                field="Code"
                title={i18n.t("marketplaces:table.columns.code")}
            />,
            <GridColumn
                field="MarketplaceKind"
                title={i18n.t("marketplaces:table.columns.marketplace-kind")}
            />
        ];

        return {
            request,
            columns: dataGridColumns,
            relatedEntityName: 'Product',
            navigationProperty: 'Products',
            items: state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, reducerCreator).paginationReducer,
            commandAddButtonTitle: i18n.t("components:connected-marketplace-chooser.add"),

            onSave: onSave
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const reducerKey = getLookupName(props.id);

        return {
            fetchItems: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).getNextPage as GetNextPage<{}>, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).clear, dispatch)
        };
    }
)(LookupChooser);

export {
    IConnectedMarketplaceLookupChooser,
    ConnectedMarketplaceLookupChooserConnected as ConnectedMarketplaceLookupChooser
};