import { connect } from "react-redux";

import { SetFilter, SetPrepareResponse, GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    ProductGroupsTable
} from "../components/ProductGroupsTable";

const ProductGroupsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ProductGroupPage
        };
    },
    {
        setFilterItems: Bantikom.ProductGroupService.getProductGroupPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.ProductGroupService.getProductGroupPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.ProductGroupService.getProductGroupPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ProductGroupService.getProductGroupPage.clear
    }
)(ProductGroupsTable);

export { ProductGroupsTableConnected as ProductGroupsTable };
