import { connect } from "react-redux";

import { SetFilter, SetPrepareResponse, GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    SeoTopTable
} from "../components/SeoTopTable";

const SeoTopObservationService = Bantikom.SeoTopObservationService;

const SeoTopTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.SeoTopObservationPage
        };
    },
    {
        setFilterItems: SeoTopObservationService.getSeoTopObservationPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: SeoTopObservationService.getSeoTopObservationPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: SeoTopObservationService.getSeoTopObservationPage.getNextPage as GetNextPage<{}>,
        clear: SeoTopObservationService.getSeoTopObservationPage.clear
    }
)(SeoTopTable);

export { SeoTopTableConnected as SeoTopTable };
