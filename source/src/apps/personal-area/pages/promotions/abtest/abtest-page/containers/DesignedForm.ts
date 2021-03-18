import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Invoke, InvokeSpecificUrl } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    DesignedForm,
    IStateProps,
    IDispatchProps
} from "../components/DesignedForm";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const DesignedFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            state: state,
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.AbTestItem,
            createAbTestVariationState: state.odataService.AbTestVariationCreateItem
        };
    },
    {
        saveItem: Bantikom.AbTestService.saveAbTestItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.AbTestService.getAbTestItem.updateLocally,

        createAbTestVariation: Bantikom.AbTestVariationService.createAbTestVariationItem.invoke as Invoke<{}, {}>,
        publish: BantikomExt.AbTestService.publish.invoke as InvokeSpecificUrl<{}, {}>
    }
)(DesignedForm);

export { DesignedFormConnected as DesignedForm };
