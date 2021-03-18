import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke } from "app/common/core/data";

import { IStateProps, IDispatchProps, AbTestCreateForm } from "../components/AbTestCreateForm";

const AbTestCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.AbTestItem
        };
    },
    {
        createItem: Bantikom.AbTestService.createAbTestItem.invoke as Invoke<{}, {}>
    }
)(AbTestCreateForm);

export { AbTestCreateFormConnected as AbTestCreateForm };
