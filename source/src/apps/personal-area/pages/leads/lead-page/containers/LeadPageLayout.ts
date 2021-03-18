import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Fetch } from "app/common/core/data";

import { LeadPage, IStateProps, IDispatchProps } from "../components/LeadPage";

const LeadPageWithTranslation = withTranslation()(LeadPage);
const LeadPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            leadState: state.odataService.LeadItem
        };
    },
    {
        fetchLead: Bantikom.LeadService.getLeadItem.fetch as Fetch<{}>
    }
)(LeadPageWithTranslation);

export { LeadPageConnected as LeadPageLayout };