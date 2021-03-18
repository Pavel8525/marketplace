import { connect } from "react-redux";

import { GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";
import { Infinite } from "app/common/components";

const ResultTable = connect<any, any, any, any>(
    (state: any) => state.odataService.SearchImportedProductInfinitePage,
    {
        fetchItems: Bantikom.SearchImportedProductService.getSearchImportedProductInfinitePage.getNextPage as GetNextPage<{}>
    }
)(Infinite);

export {
    ResultTable
};
