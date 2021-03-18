import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { IEnvironmentSettings } from 'app/common/contracts';
import { PageHeader } from 'app/common/layouts/page/components';
import i18n from 'app/common/core/translation/i18n';
import { ContainerHeightType, Panel } from 'app/common/components';

import { UserOrdersTable } from '../containers';

interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class UserOrdersListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("user-orders:title")}
                    portalName="portal-page-header"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="user-orders-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <UserOrdersTable
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
        this.props.history.push("/personal/user-orders/card/create-new-item");
}

export {
    IStateProps,
    IDispatchProps,
    UserOrdersListPage
};
