import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import i18n from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { ContainerHeightType, Panel } from 'app/common/components';
import { PageHeader } from 'app/common/layouts/page/components';

import { AbTestsTable } from '../containers/AbTestsTable';


interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class AbTestsListPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("abtests:title")}
                    portalName="portal-page-header"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="product-groups-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <AbTestsTable
                                gridHeight={ContainerHeightType.All}
                            />
                        </Panel>
                    </div>
                </div>
            </>
        );
    }

}

export {
    IStateProps,
    IDispatchProps,
    AbTestsListPage
};
