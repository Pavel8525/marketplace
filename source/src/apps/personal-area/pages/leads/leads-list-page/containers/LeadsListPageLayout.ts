import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { LeadsListPage, IStateProps, IDispatchProps } from "../components/LeadsListPage";

const LeadsListPageWithTranslation = withTranslation()(LeadsListPage);
const LeadsListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            leads: state.odataService.LeadPage
        };
    },
    {
    }
)(LeadsListPageWithTranslation);

export { LeadsListPageConnected as LeadsListPageLayout };