import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Clear, Fetch } from "app/common/core/data";

import { AbTestPage, IStateProps, IDispatchProps } from "../components/AbTestPage";

const AbTestPageWithTranslation = withTranslation()(AbTestPage);
const AbTestPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.AbTestItem
        };
    },
    {
        fetchItem: Bantikom.AbTestService.getAbTestItem.fetch as Fetch<{}>,
        clear: Bantikom.AbTestService.getAbTestItem.clear as Clear
    }
)(AbTestPageWithTranslation);

export {
    AbTestPageConnected as AbTestPageLayout
};
