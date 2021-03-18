import { connect } from "react-redux";

import { Bantikom } from "app/common/core/api/proxy";
import { GetNextPage, SetFilter, SetPrepareResponse } from "app/common/core/data";
import { IDispatchProps, IOwnProps, IStateProps, ObservationProductsTable } from "../components/ObservationProductsTable";

const ObservationProductService = Bantikom.ObservationProductService;

const ObservationProductsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ObservationProductPage,
        };
    },
    {
        setFilterItems: ObservationProductService.getObservationProductPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: ObservationProductService.getObservationProductPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: ObservationProductService.getObservationProductPage.getNextPage as GetNextPage<{}>,
        clear: ObservationProductService.getObservationProductPage.clear
    }
)(ObservationProductsTable);

export {
    ObservationProductsTableConnected as ObservationProductsTable
};
