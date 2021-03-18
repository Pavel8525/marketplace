import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Fetch, InvokeSpecificUrl } from "app/common/core/data";

import { PlatformServiceSubscription, IStateProps, IDispatchProps, IOwnProps } from "../components/PlatformServiceSubscription";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const PlatformServiceSubscriptionConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            subscriptionItemsState: state.odataService.UserPlatformServiceSubscriptionItems,
            subscribeToServiceState: state.odataService.UserPlatformServiceSubscriptionService_Subscribe
        };
    },
    {
        fetchSubscriptionItems: Bantikom.UserPlatformServiceSubscriptionService.getUserPlatformServiceSubscriptionItems.fetch as Fetch<{}>,
        subscribeToService: BantikomExt.UserPlatformServiceSubscriptionService.subscribe.invoke as InvokeSpecificUrl<{}, {}>
    }
)(PlatformServiceSubscription);

export { PlatformServiceSubscriptionConnected as PlatformServiceSubscription };
