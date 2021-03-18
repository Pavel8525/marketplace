import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { IPaginationState } from 'app/common/core/data/reducers/pagination-reducer-factory';
import { Bantikom } from 'app/common/core/api/proxy';
import { Panel, ContainerHeightType } from 'app/common/components';
import { ProductsTable } from 'app/apps/personal-area/common';

interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    items: IPaginationState<Bantikom.Product, {}>;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class ProductsListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("products:title")}
                    portalName="portal-page-header"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="products-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <ProductsTable
                                gridHeight={ContainerHeightType.All}
                                gotoNewItemPage={this.gotoNewItemPage}
                                gotoImportProductPage={this.gotoImportProductPage}
                            />
                        </Panel>
                    </div>
                </div>
            </>
        );
    }

    private gotoNewItemPage = () =>
        this.props.history.push("/personal/products/card/create-new-item");

    private gotoImportProductPage = () =>
        this.props.history.push("/personal/products/import-product");
}

export { IStateProps, IDispatchProps, ProductsListPage };
