import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { Panel, ContainerHeightType } from 'app/common/components';

import { ConnectedMarketplacesTable } from '../containers/ConnectedMarketplacesTable';


interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ConnectedMarketplacesListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("marketplaces:title")}
                    portalName="portal-page-header"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="products-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <ConnectedMarketplacesTable
                                gridHeight={ContainerHeightType.All}
                                gotoNewItemPage={this.gotoNewItemPage}
                            />
                        </Panel>
                    </div>
                </div>
            </>
        );
    }

    private gotoNewItemPage = () =>
        this.props.history.push("/personal/reference-book/connected-marketplaces/card/create-new-item");
}

export { 
    IStateProps, 
    IDispatchProps, 
    ConnectedMarketplacesListPage 
};