import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader, Breadcrumb } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Bantikom } from 'app/common/core/api/proxy';
import { IFetchState, Fetch } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FormState, FetchWithLoader } from 'app/common/components';

import { LeadCreateForm } from './LeadCreateForm';
import { LeadEditForm } from './LeadEditForm';
import { LeadEditAddressForm } from './LeadEditAddressForm';
import { ContactsTable } from 'app/apps/personal-area/common';

const CREATE_NEW_ITEM = "create-new-item";

interface IDispatchProps {
    fetchLead: Fetch<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    leadState: IFetchState<ISingleODataResponse<Bantikom.Lead>>;
}

interface IState {
    formState: FormState,
    leadId: string;
    lead?: Bantikom.Lead;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;


class LeadPage extends React.Component<IProps, IState> {

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            lead: props.leadState.data && props.leadState.data.item
        }
    }

    constructor(props: IProps) {
        super(props);

        const leadId = (this.props.match.params as any).leadId;
        this.state = {
            formState: leadId === CREATE_NEW_ITEM ? FormState.creating : FormState.editing,
            leadId: leadId
        };
    }

    public render() {
        const { leadState } = this.props;
        const { lead, formState } = this.state;

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
                            <LeadCreateForm
                                gotoLead={this.gotoLeadPage}
                            />
                        </Panel>
                    );
                }
                case FormState.editing: {
                    return (
                        <FetchWithLoader fetchState={leadState}>
                            {lead && (
                                <>
                                    <Breadcrumb
                                        currentTitle={lead.Name}
                                    />
                                    <Panel
                                        uniqueIdentifier="lead-edit-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        title={i18n.t("lead:edit.panels.lead-edit-form")}
                                    >
                                        <LeadEditForm lead={lead} />
                                    </Panel>

                                    <Panel
                                        uniqueIdentifier="lead-edit-address-form"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        iconClassName="fa-address-card"
                                        title={i18n.t("lead:edit.panels.lead-edit-address-form")}
                                    >
                                        <LeadEditAddressForm lead={lead} />
                                    </Panel>

                                    <Panel
                                        uniqueIdentifier="lead-edit-contacts-grid"
                                        canCollapse={true}
                                        canMaximize={true}
                                        showHeader={true}
                                        showIcon={true}
                                        iconClassName="fa-address-book"
                                        title={i18n.t("lead:edit.panels.lead-edit-contacts-grid")}
                                    >
                                        <ContactsTable
                                            openTarget="_blank"
                                            leadId={lead.Id}
                                            gotoNewItemPage={this.gotoContactPage}
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
                    title={formState === FormState.creating ? i18n.t("lead:create.title") : lead ? lead.Name : ""}
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
        this.fetchLead();
    }

    private gotoLeadPage = (leadId: string) => {
        this.props.history.push(`/personal/managers/leads/${leadId}`);

        this.setState(() => ({
            ...this.state,
            leadId: leadId,
            formState: FormState.editing
        }));

        this.fetchLead();
    }

    private gotoContactPage = () =>
        window.open(`/personal/managers/contacts/create-new-item?leadId=${this.state.leadId}`);

    private fetchLead() {
        const { leadId } = this.state;
        if (leadId !== CREATE_NEW_ITEM) {
            this.props.fetchLead({ key: leadId });
        }
    }
}

export { IDispatchProps, IStateProps, LeadPage };