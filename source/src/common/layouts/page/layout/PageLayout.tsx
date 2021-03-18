import * as React from 'react';

import { getPackageInfo } from 'app/common/helpers/package-helper';
import {
    LeftMenu,
    Header,
    Footer,
    PageContent,
    ProductShortcuts,
    QuickMenu,
    PageSettings
} from '../components';
import { Messenger } from 'app/apps/messenger';

class PageLayout extends React.Component {
    private packageInfo = getPackageInfo();

    public render() {
        return (
            <>
                <div className="page-wrapper">
                    <div className="page-inner">
                        <LeftMenu
                            plaformName={this.packageInfo.displayName}
                            plaformDescription={this.packageInfo.description}
                            plaformLogo={this.packageInfo.logo}
                        />
                        <div className="page-content-wrapper">
                            <Header
                                plaformName={this.packageInfo.displayName}
                                plaformDescription={this.packageInfo.description}
                                plaformLogo={this.packageInfo.logo}
                            />

                            <PageContent />

                            <Footer />

                            <ProductShortcuts />

                            {/* BEGIN Color profile */}
                            <p id="js-color-profile" className="d-none">
                                <span className="color-primary-50"></span>
                                <span className="color-primary-100"></span>
                                <span className="color-primary-200"></span>
                                <span className="color-primary-300"></span>
                                <span className="color-primary-400"></span>
                                <span className="color-primary-500"></span>
                                <span className="color-primary-600"></span>
                                <span className="color-primary-700"></span>
                                <span className="color-primary-800"></span>
                                <span className="color-primary-900"></span>
                                <span className="color-info-50"></span>
                                <span className="color-info-100"></span>
                                <span className="color-info-200"></span>
                                <span className="color-info-300"></span>
                                <span className="color-info-400"></span>
                                <span className="color-info-500"></span>
                                <span className="color-info-600"></span>
                                <span className="color-info-700"></span>
                                <span className="color-info-800"></span>
                                <span className="color-info-900"></span>
                                <span className="color-danger-50"></span>
                                <span className="color-danger-100"></span>
                                <span className="color-danger-200"></span>
                                <span className="color-danger-300"></span>
                                <span className="color-danger-400"></span>
                                <span className="color-danger-500"></span>
                                <span className="color-danger-600"></span>
                                <span className="color-danger-700"></span>
                                <span className="color-danger-800"></span>
                                <span className="color-danger-900"></span>
                                <span className="color-warning-50"></span>
                                <span className="color-warning-100"></span>
                                <span className="color-warning-200"></span>
                                <span className="color-warning-300"></span>
                                <span className="color-warning-400"></span>
                                <span className="color-warning-500"></span>
                                <span className="color-warning-600"></span>
                                <span className="color-warning-700"></span>
                                <span className="color-warning-800"></span>
                                <span className="color-warning-900"></span>
                                <span className="color-success-50"></span>
                                <span className="color-success-100"></span>
                                <span className="color-success-200"></span>
                                <span className="color-success-300"></span>
                                <span className="color-success-400"></span>
                                <span className="color-success-500"></span>
                                <span className="color-success-600"></span>
                                <span className="color-success-700"></span>
                                <span className="color-success-800"></span>
                                <span className="color-success-900"></span>
                                <span className="color-fusion-50"></span>
                                <span className="color-fusion-100"></span>
                                <span className="color-fusion-200"></span>
                                <span className="color-fusion-300"></span>
                                <span className="color-fusion-400"></span>
                                <span className="color-fusion-500"></span>
                                <span className="color-fusion-600"></span>
                                <span className="color-fusion-700"></span>
                                <span className="color-fusion-800"></span>
                                <span className="color-fusion-900"></span>
                            </p>
                            {/* END Color profile */}
                        </div>
                    </div>
                </div>

                <QuickMenu />

                <Messenger />

                <PageSettings />
            </>
        );
    }
}

export { PageLayout };