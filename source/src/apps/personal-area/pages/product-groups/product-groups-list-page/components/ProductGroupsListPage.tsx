import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import i18n from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { ContainerHeightType, Panel } from 'app/common/components';
import { PageHeader } from 'app/common/layouts/page/components';
import { ProductGroupsTable } from 'app/apps/personal-area/common';

interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ProductGroupsListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("product-groups:title")}
                    portalName="portal-page-header"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="product-groups-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <ProductGroupsTable
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
        this.props.history.push("/personal/product-groups/card/create-new-item");
}

export {
    IStateProps,
    IDispatchProps,
    ProductGroupsListPage
};
