import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Fetch } from "app/common/core/data";

import { ContactPage, IStateProps, IDispatchProps } from "../components/ContactPage";

const ContactPageWithTranslation = withTranslation()(ContactPage);
const ContactPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.ContactItem
        };
    },
    {
        fetchItem: Bantikom.ContactService.getContactItem.fetch as Fetch<{}>
    }
)(ContactPageWithTranslation);

export { ContactPageConnected as ContactPageLayout };