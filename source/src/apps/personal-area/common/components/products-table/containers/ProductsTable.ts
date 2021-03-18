import { connect } from "react-redux";

import { Bantikom } from "app/common/core/api/proxy";
import { GetNextPage, SetFilter, SetPrepareResponse } from "app/common/core/data";
import { IDispatchProps, IOwnProps, IStateProps, ProductsTable } from "../components/ProductsTable";

const ProductsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ProductPage
        };
    },
    {
        setFilterItems: Bantikom.ProductService.getProductPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.ProductService.getProductPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.ProductService.getProductPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ProductService.getProductPage.clear
    }
)(ProductsTable);

export { ProductsTableConnected as ProductsTable };