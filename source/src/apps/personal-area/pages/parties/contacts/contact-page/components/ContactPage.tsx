import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';

import { PageHeader, Breadcrumb } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FormState, FetchWithLoader } from 'app/common/components';
import { ContactCreateForm } from './ContactCreateForm';
import { ContactEditForm } from './ContactEditForm';

const CREATE_NEW_ITEM = "create-new-item";

interface IDispatchProps {
    fetchItem: Fetch<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<Bantikom.Contact>>;
}

interface IState {
    formState: FormState,
    itemId: string;
    leadId?: string;
    customerId?: string;
    item?: Bantikom.Contact;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;


class ContactPage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const queryParams: any = queryString.parse(location.search);
        const itemId = (this.props.match.params as any).contactId;

        this.state = {
            formState: itemId === CREATE_NEW_ITEM ? FormState.creating : FormState.editing,
            itemId: itemId,
            leadId: queryParams.leadId || null,
            customerId: queryParams.customerId || null
        };
    }

    public render() {
        const { itemState } = this.props;
        const { item, formState, leadId, customerId } = this.state;

        const renderContent = () => {
            switch (formState) {
                case FormState.creating: {
                    return (
                        <Panel
                            uniqueIdentifier="lead-create-form"
                            canCollapse={false}
                            canMaximize={false}
                            showHeader={true}
                            title={i18n.t("lead:create.panels.lead-create-form")}
                        >
                            <ContactCreateForm
                                leadId={leadId}
                                customerId={customerId}
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
                                    <Breadcrumb
                                        currentTitle={item.Name}
                                    />
                                    <Panel
                                        uniqueIdentifier="contact-edit-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("contact:edit.panels.contact-edit-form")}
                                    >
                                        <ContactEditForm
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
                    title={formState === FormState.creating ? i18n.t("lead:create.title") : item ? item.Name : ""}
                    description={formState === FormState.creating ? i18n.t("lead:common.description") : ""}
                    portalName="portal-page-header"
                    iconClassName="fa-tags"
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
        this.props.history.push(`/personal/managers/contacts/${itemId}`);

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

export { IDispatchProps, IStateProps, ContactPage };
