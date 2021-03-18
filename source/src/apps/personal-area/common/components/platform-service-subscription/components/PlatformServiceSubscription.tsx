import * as React from 'react';
import i18n from 'i18next';
import * as toastr from 'toastr';

import { Guid } from 'app/common/helpers/string-helper';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch, InvokeSpecificUrl, IOperationState } from 'app/common/core/data';
import { IMultipleODataResponse, ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { FormState, FetchWithLoader, AlertPanel, autoformFactory } from 'app/common/components';

const PLATFORM_SERVICE_SUBSCRIBE_FORM = 'PLATFORM_SERVICE_SUBSCRIBE_FORM';
const NOTIFY_RELEASE_FORM = 'NOTIFY_RELEASE_FORM';

interface IDispatchProps {
    fetchSubscriptionItems: Fetch<{}>;
    subscribeToService: InvokeSpecificUrl<{ request: Bantikom.PlatformServiceSubscribeRequest }, {}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    subscriptionItemsState: IFetchState<IMultipleODataResponse<Bantikom.UserPlatformServiceSubscription>>;
    subscribeToServiceState: IOperationState<ISingleODataResponse<Bantikom.PlatformServiceSubscribeResponse>>;
}

interface IState {
    haveSubscription?: boolean;
    subscription?: Bantikom.UserPlatformServiceSubscription;
}

interface IOwnProps {
    serviceCode: string;
    serviceOptions?: string;
    promo?: React.ReactNode;
    showSubscribeForm?: boolean;
    showNotifyReleaseForm?: boolean;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class PlatformServiceSubscription extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            haveSubscription: props.subscriptionItemsState.data === null
                ? null
                : props.subscriptionItemsState.data.items.length > 0,
            subscription: props.subscriptionItemsState.data === null
                ? null
                : props.subscriptionItemsState.data.items.length > 0 && props.subscriptionItemsState.data.items[0]
        }
    }

    private subscribeToPlatformServiceForm: any;
    private notifyReleaseForm: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            haveSubscription: null
        }

        this.subscribeToPlatformServiceForm = autoformFactory({
            formName: `${PLATFORM_SERVICE_SUBSCRIBE_FORM}:${props.serviceOptions}`,
            showNotification: false
        }).getForm();

        this.notifyReleaseForm = autoformFactory({
            formName: `${NOTIFY_RELEASE_FORM}:${props.serviceOptions}`,
            showNotification: false
        }).getForm();
    }

    public render() {
        const {
            haveSubscription,
            subscription
        } = this.state;
        const {
            subscriptionItemsState,
            children,
            promo,
            showSubscribeForm,
            showNotifyReleaseForm
        } = this.props;

        return (
            <>
                <FetchWithLoader fetchState={subscriptionItemsState}>
                    {haveSubscription === false && (
                        <>
                            {promo
                                ? promo
                                : <AlertPanel
                                    message={i18n.t("components:platform-service-subscription.dont-have-subscription")}
                                    type={"info"}
                                />
                            }

                            {showSubscribeForm &&
                                <>
                                    <this.subscribeToPlatformServiceForm
                                        renderRows={false}
                                        onSubmit={this.subscribeToService}
                                        submitTitle={i18n.t("components:platform-service-subscription.forms.subscribe-form.submit-button")}
                                        disableCheckDirty={true}
                                    />
                                </>
                            }

                            {showNotifyReleaseForm &&
                                <>
                                    <this.notifyReleaseForm
                                        renderRows={false}
                                        onSubmit={this.notifyAboutRelease}
                                        submitTitle={i18n.t("components:platform-service-subscription.forms.notify-release.submit-button")}
                                        disableCheckDirty={true}
                                    />
                                </>
                            }

                        </>
                    )}

                    {haveSubscription === true && subscription && (
                        <>
                            {!showNotifyReleaseForm && children && (
                                React.Children.map(children, (column: JSX.Element, idx) => column && React.cloneElement(column, { ref: idx }))
                            )}

                            {showNotifyReleaseForm && subscription.NotifyAboutRelease && (
                                <>
                                    {promo}

                                    <AlertPanel
                                        message={i18n.t("components:platform-service-subscription.you-subscribe-notyte-about-release")}
                                        type={"info"}
                                    />
                                </>
                            )}
                        </>
                    )}


                </FetchWithLoader>
            </>
        )
    }

    public componentDidMount() {
        this.fetchItem();
    }

    private fetchItem() {
        this.props.fetchSubscriptionItems({
            filter: {
                Enabled: true,
                PlatformServiceOptions: {
                    PlatformServiceType: { Code: this.props.serviceCode }
                }
            }
        });
    }

    private subscribeToService = (): Promise<{}> => {
        const request: Bantikom.PlatformServiceSubscribeRequest = {
            Id: Guid.newGuid(),
            ServiceCode: this.props.serviceCode,
            Options: this.props.serviceOptions,
            NotifyAboutRelease: false
        }
        const promise = this.props.subscribeToService(
            { request },
            null,
            { func: 'Subscribe' }
        );

        promise.then((response: { data: Bantikom.PlatformServiceSubscribeResponse }) => {
            if (response.data.Success) {
                toastr.success(null, i18n.t('notifications:rest.successfully'));
                this.fetchItem();
            } else {
                toastr.warning(null, response.data.Message);
            }
        });

        return promise;
    }

    private notifyAboutRelease = (): Promise<{}> => {
        const request: Bantikom.PlatformServiceSubscribeRequest = {
            Id: Guid.newGuid(),
            ServiceCode: this.props.serviceCode,
            Options: this.props.serviceOptions,
            NotifyAboutRelease: true
        }
        const promise = this.props.subscribeToService(
            { request },
            null,
            { func: 'Subscribe' }
        );

        promise.then((response: { data: Bantikom.PlatformServiceSubscribeResponse }) => {
            if (response.data.Success) {
                toastr.success(null, i18n.t('notifications:rest.successfully'));
                this.fetchItem();
            } else {
                toastr.warning(null, response.data.Message);
            }
        });

        return promise;
    }
}

export {
    IOwnProps,
    IDispatchProps,
    IStateProps,
    PlatformServiceSubscription
};
