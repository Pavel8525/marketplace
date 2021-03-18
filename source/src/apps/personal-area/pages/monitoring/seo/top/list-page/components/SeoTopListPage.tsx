import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import i18n from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { ContainerHeightType, Panel } from 'app/common/components';
import { PageHeader } from 'app/common/layouts/page/components';

import { SeoTopTable } from '../containers/SeoTopTable';


interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class SeoTopListPage extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <>
                <PageHeader
                    title={i18n.t("monitoring:seo-top.list-page.title")}
                    portalName="portal-page-header"
                    iconClassName="fa-sort-amount-up-alt"
                />

                <div className="row">
                    <div className="col-xl-12">
                        <Panel
                            uniqueIdentifier="seo-top-table"
                            showHeader={false}
                            hidePadding={true}
                        >
                            <SeoTopTable
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
    SeoTopListPage
};
