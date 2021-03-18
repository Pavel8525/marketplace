import { connect } from "react-redux";

import { SetFilter, SetPrepareResponse, GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    AbTestsTable
} from "../components/AbTestsTable";

const AbTestsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.AbTestPage
        };
    },
    {
        setFilterItems: Bantikom.AbTestService.getAbTestPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.AbTestService.getAbTestPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.AbTestService.getAbTestPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.AbTestService.getAbTestPage.clear
    }
)(AbTestsTable);

export { AbTestsTableConnected as AbTestsTable };
