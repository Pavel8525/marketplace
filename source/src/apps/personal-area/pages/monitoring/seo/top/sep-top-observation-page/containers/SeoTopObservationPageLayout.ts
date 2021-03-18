import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { SeoTopObservationPage, IStateProps, IDispatchProps } from "../components/SeoTopObservationPage";
import { Bantikom } from "app/common/core/api/proxy";
import { Clear, Fetch, InvokeSpecificUrl } from "app/common/core/data";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const SeoTopObservationService = Bantikom.SeoTopObservationService;
const SeoTopObservationServiceExt = BantikomExt.SeoTopObservationService;

const SeoTopObservationPageWithTranslation = withTranslation()(SeoTopObservationPage);
const SeoTopObservationPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.SeoTopObservationItem,
            changeRefsState: state.odataService.SeoTopObservationService_ChangeRefs
        };
    },
    {
        fetchItem: SeoTopObservationService.getSeoTopObservationItem.fetch as Fetch<{}>,
        clear: SeoTopObservationService.getSeoTopObservationItem.clear as Clear,
        changeRefs: SeoTopObservationServiceExt.changeRefs.invoke as InvokeSpecificUrl<{}, {}>,
        clearChangeRefs: SeoTopObservationServiceExt.changeRefs.reset
    }
)(SeoTopObservationPageWithTranslation);

export {
    SeoTopObservationPageConnected as SeoTopObservationPageLayout
};
