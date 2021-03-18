import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { PageHeader, Breadcrumb } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { IPaginationState } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Bantikom } from 'app/common/core/api/proxy';
import { Panel, ContainerHeightType } from 'app/common/components';

import { LeadsTable } from './LeadsTable';


interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    leads: IPaginationState<Bantikom.Lead, {}>;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class LeadsListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("leads:title")}
                    portalName="portal-page-header"
                    description={i18n.t("leads:description")}
                />

                <Breadcrumb />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="researches-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <LeadsTable
                                gridHeight={ContainerHeightType.All}
                                gotoNewLeadPage={this.gotoNewLeadPage}
                            />
                        </Panel>
                    </div>
                </div>
            </>
        );
    }

    private gotoNewLeadPage = () => 
        this.props.history.push("/personal/managers/leads/create-new-item");
}

export { IStateProps, IDispatchProps, LeadsListPage };