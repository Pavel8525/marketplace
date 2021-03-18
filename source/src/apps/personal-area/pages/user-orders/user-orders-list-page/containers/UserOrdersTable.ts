import { connect } from "react-redux";

import { SetFilter, SetPrepareResponse, GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    UserOrdersTable
} from "../components/UserOrdersTable";

const UserOrdersTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.UserOrderPage
        };
    },
    {
        setFilterItems: Bantikom.UserOrderService.getUserOrderPage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.UserOrderService.getUserOrderPage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.UserOrderService.getUserOrderPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.UserOrderService.getUserOrderPage.clear
    }
)(UserOrdersTable);

export { UserOrdersTableConnected as UserOrdersTable };
