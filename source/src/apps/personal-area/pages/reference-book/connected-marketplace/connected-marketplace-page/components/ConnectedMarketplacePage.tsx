import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FormState, FetchWithLoader } from 'app/common/components';

import { ConnectedMarketplaceCreateForm } from '../containers/ConnectedMarketplaceCreateForm';
import { ConnectedMarketplaceEditForm } from '../containers/ConnectedMarketplaceEditForm';
import { ConnectedMarketplaceEditAuthDataForm } from '../containers/ConnectedMarketplaceEditAuthDataForm';

const CREATE_NEW_ITEM = "create-new-item";

interface IDispatchProps {
    fetchItem: Fetch<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<Bantikom.ConnectedMarketplace>>;
}

interface IState {
    formState: FormState,
    itemId: string;
    item?: Bantikom.ConnectedMarketplace;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ConnectedMarketplacePage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const itemId = (this.props.match.params as any).connectedMarketplaceId;

        this.state = {
            formState: itemId === CREATE_NEW_ITEM ? FormState.creating : FormState.editing,
            itemId: itemId
        };
    }

    public render() {
        const { itemState } = this.props;
        const { item, formState } = this.state;

        const renderContent = () => {
            switch (formState) {
                case FormState.creating: {
                    return (
                        <Panel
                            uniqueIdentifier="connected-marketplace-create-form"
                            canCollapse={false}
                            canMaximize={false}
                            showHeader={true}
                            title={i18n.t("marketplace:create.panels.connected-marketplace-create-form")}
                        >
                            <ConnectedMarketplaceCreateForm
                                gotoItem={this.gotoItemPage}
                            />
                        </Panel>
                    );
                }
                case FormState.editing: {
                    return (
                        <FetchWithLoader fetchState={itemState}>
                            {item && (
                                <>
                                    <Panel
                                        uniqueIdentifier="connected-marketplace-edit-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("marketplace:edit.panels.connected-marketplace-edit-form")}
                                    >
                                        <ConnectedMarketplaceEditForm
                                            item={item}
                                        />
                                    </Panel>

                                    <Panel
                                        uniqueIdentifier="connected-marketplace-edit-authdata-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        iconClassName={"fa-shield"}
                                        title={i18n.t("marketplace:edit.panels.connected-marketplace-edit-authdata-form")}
                                    >
                                        <ConnectedMarketplaceEditAuthDataForm
                                            item={item}
                                        />
                                    </Panel>
                                </>
                            )}

                        </FetchWithLoader>
                    );
                }
            }
        };

        return (
            <>
                <PageHeader
                    title={formState === FormState.creating ? i18n.t("marketplace:create.title") : item ? item.Name : ""}
                    portalName="portal-page-header"
                    iconClassName="fa-store"
                />

                <div className="row">
                    <div className="col-xl-12">
                        {renderContent()}
                    </div>
                </div>
            </>
        )
    }

    public componentDidMount() {
        this.fetchItem();
    }

    private gotoItemPage = (itemId: string) => {
        this.props.history.push(`/personal/reference-book/connected-marketplaces/card/${itemId}`);

        this.setState(() => ({
            ...this.state,
            itemId,
            formState: FormState.editing
        }));

        this.fetchItem();
    }

    private fetchItem() {
        const { itemId } = this.state;
        if (itemId !== CREATE_NEW_ITEM) {
            this.props.fetchItem({ key: itemId });
        }
    }
}

export {
    IDispatchProps,
    IStateProps,
    ConnectedMarketplacePage
};
