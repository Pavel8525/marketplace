import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke } from "app/common/core/data";

import { IStateProps, IDispatchProps, SeoTopCreateForm } from "../components/SeoTopCreateForm";

const SeoTopObservationService = Bantikom.SeoTopObservationService;


const SeoTopCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.SeoTopObservationItem
        };
    },
    {
        createItem: SeoTopObservationService.createSeoTopObservationItem.invoke as Invoke<{}, {}>
    }
)(SeoTopCreateForm);

export { SeoTopCreateFormConnected as SeoTopCreateForm };
