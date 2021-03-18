import { connect } from "react-redux";
import React from "react";
import i18n from "app/common/core/translation/i18n";
import { bindActionCreators } from "redux";
import { GridColumn } from "@progress/kendo-react-grid";

import { Bantikom } from 'app/common/core/api/proxy';
import { GetNextPage, paginationReducerFactory } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';
import { getPageODataResponse, IPageableODataResponse } from "app/common/core/api/contracts/odata-response";
import { getGuid } from "app/common/core/api/odata-helper";
import { BantikomExt } from "app/common/core/api/proxy-ext";
import { InvokeSpecificUrl } from "app/common/core/data";
import { LinkCell } from "../..";

import { LookupChooser } from "../components/LookupChooser";
import { IStateProps, IDispatchProps, IOwnProps, OperationChangeReference } from "../contracts";

type Product = Bantikom.Product;

const getLookupName = (key: string): string => `ProductPage_${key}`;

const reducerCreator = (reducerKey: string) => {
    const reducerFactory: any = paginationReducerFactory<IPageableODataResponse<Product>, {}>(
        `get:${reducerKey}`,
        "/Product",
        undefined,
        false,
        (response => getPageODataResponse<Product>(response))
    );

    reducerFactory.reducer = reducerFactory.paginationReducer;
    return reducerFactory;
}

let dataGridColumns: any;

const ProductLookupChooserConnected = connect<IStateProps<Product>, IDispatchProps, IOwnProps>(
    (state: any, props: IOwnProps) => {
        const {
            entityId,
            id,
            operation,
            requestKind,

            onSave
        } = props;

        const filters: any[] = [];
        switch (requestKind) {
            case 'ByGroup': {
                const filter: any = operation == OperationChangeReference.add
                    ? {
                        and: [{
                            MarketPlaceKind: 'Internal'
                        }, {
                            not: {
                                Groups: {
                                    any: { Id: getGuid(entityId, 'eq') }
                                }
                            }
                        }]
                    } : {
                        and: [{
                            MarketPlaceKind: 'Internal'
                        }, {
                            Groups: {
                                any: { Id: getGuid(entityId, 'eq') }
                            }
                        }]
                    };

                filters.push(filter);

                break;
            }
            case 'ByHeadProduct': {
                const filter: any = {
                    and: {
                        HeadProductId: getGuid(entityId, 'eq'),
                        ConnectedMarketplaceId: getGuid(null, 'ne')
                    }
                }

                filters.push(filter);

                break;
            }
            case 'ByCurrentEntity': {
                const filter: any = {
                    and: {
                        Id: getGuid(entityId, 'eq'),
                        ConnectedMarketplaceId: getGuid(null, 'ne')
                    },
                }

                filters.push(filter);

                break;
            }
        }

        const request = {
            orderBy: ['LastModificationDate desc'],
            select: [
                'OwnerId', 'Id',
                'Name', 'VendorCode', 'BarCode',
                'CreationDate', 'LastModificationDate',
                'RowVersion'
            ],
            expand: { ConnectedMarketplace: { select: ['Name', 'Id'] } },
            filter: [...filters]
        };
        const reducerKey = getLookupName(id);

        dataGridColumns = dataGridColumns || [
            <GridColumn
                field="VendorCode"
                title={i18n.t("products:table.columns.vendor-code")}
                cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={null} />}
            />,
            <GridColumn
                field="Name"
                title={i18n.t("products:table.columns.name")}
                cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={null} />}
            />,
            <GridColumn
                field="ConnectedMarketplace.Name"
                title={i18n.t("products:table.columns.marketplace")}
            />,
            <GridColumn
                field="BarCode"
                title={i18n.t("products:table.columns.bar-code")}
                cell={(props) => <LinkCell {...props} keyField="Id" path="products/card" target={null} />}
            />
        ];

        return {
            request,
            columns: dataGridColumns,
            relatedEntityName: 'Product',
            navigationProperty: 'Products',
            items: state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, reducerCreator).paginationReducer,

            onSave: onSave
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const reducerKey = getLookupName(props.id);

        return {
            changeRefs: bindActionCreators(BantikomExt.ProductGroupService.changeRefs.invoke as InvokeSpecificUrl<{}, {}>, dispatch),
            fetchItems: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).getNextPage as GetNextPage<{}>, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).clear, dispatch)
        };
    }
)(LookupChooser);

export {
    ProductLookupChooserConnected as ProductLookupChooser
};