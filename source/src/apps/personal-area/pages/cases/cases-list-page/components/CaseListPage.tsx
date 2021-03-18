import * as React from 'react';
import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { parseDate } from '@telerik/kendo-intl';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { any } from 'app/common/helpers/array-helper';
import { PageHeader, Breadcrumb } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { IPaginationState, GetNextPage, SetFilter, IResponsePayload, SetPrepareResponse } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Bantikom } from 'app/common/core/api/proxy';
import { Panel, FetchWithLoader } from 'app/common/components';
import { Card } from './Card';
import { stringUTF8ToBase64 } from 'app/common/helpers/string-helper';

interface IDispatchProps {
    setFilterCases: SetFilter<{}>;
    setPrepareResponseCases: SetPrepareResponse<{}>;
    fetchCases: GetNextPage<{}>;
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    cases: IPaginationState<Bantikom.Case, {}>;
}

interface IState {
    dataState: {
        filter?: CompositeFilterDescriptor;
        sort?: Array<SortDescriptor>;
    }
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class CasesListPage extends React.Component<IProps, IState> {
    private request: {} = {
        select: [
            'Id', 'Name', 'Code',
            'LogoPath', 'Order', 'Description', 'HelpUrl',
            'CreationDate', 'LastModificationDate',
            'RowVersion'
        ]
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            dataState: {}
        };

        this.props.setFilterCases(this.request);
        this.props.setPrepareResponseCases({ callback: this.setPrepareResponseTask });
    }

    private setPrepareResponseTask = (response: IResponsePayload<Bantikom.Case>)
        : IResponsePayload<Bantikom.Case> => {
        if (any(response.items)) {
            response.items.forEach(item => {
                item.CreationDate = parseDate(item.CreationDate.toString());
                item.LastModificationDate = parseDate(item.LastModificationDate.toString());
            });
        }
        return response;
    }

    public render() {
        const { cases } = this.props;
        const {
            items,
            fetching,
        } = cases;

        return (
            <>
                <PageHeader
                    title={i18n.t("cases:title")}
                    portalName="portal-page-header"
                    description={i18n.t("cases:description")}
                />

                <Breadcrumb />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="panel-1"
                            fetching={fetching}
                            showHeader={false}
                        >
                            <div className="card-deck">
                                <FetchWithLoader fetchState={cases}>
                                    {any(items) && (
                                        items.map((item, key) => (
                                            <Card
                                                key={key}
                                                name={item.Name}
                                                description={item.Description}
                                                helpUrl={item.HelpUrl}
                                                logoPath={item.LogoPath}
                                                buttonTitle={i18n.t("cases:card.button-title")}
                                                buttonOnClick={() => this.onClickCase(item)}
                                            />
                                        ))
                                    )}
                                </FetchWithLoader>

                                <Card
                                    name={i18n.t("cases:card-offer.name")}
                                    description={i18n.t("cases:card-offer.description")}
                                    logoPath="/img/card-backgrounds/cover-2-lg.png"
                                    helpUrl={i18n.t("cases:card-offer.helpurl-title")}
                                    buttonTitle={i18n.t("cases:card-offer.button-title")}
                                    buttonClassName="btn-warning"
                                    buttonOnClick={this.onClickSuspendOffer}
                                />
                            </div>
                        </Panel>
                    </div>
                </div>
            </>
        );
    }

    public componentDidMount() {
        this.fetchCases(this.request);
    }

    private fetchCases = (request: {}, pageNo?: number, pageSize?: number) => {
        this.props.fetchCases(request, pageNo, pageSize);
    }

    private onClickCase = (selectedCase: Bantikom.Case) => {
        this.props.history.push(`/personal/campaigns/master/${stringUTF8ToBase64(selectedCase.Code)}`);
    }

    private onClickSuspendOffer() {
        alert('some offer');
    }

}

const CasesListPageWithTranslation = withTranslation()(CasesListPage);
const CasesListPageConnected = withRouter(connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            cases: state.odataService.CasePage
        };
    },
    {
        setFilterCases: Bantikom.CaseService.getCasePage.setFilter as SetFilter<{}>,
        setPrepareResponseCases: Bantikom.CaseService.getCasePage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchCases: Bantikom.CaseService.getCasePage.getNextPage as GetNextPage<{}>
    }
)(CasesListPageWithTranslation));

export { CasesListPageConnected as CaseListPage };