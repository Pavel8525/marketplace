import * as React from 'react';
import { Switch, Route } from 'react-router';
import {
    BlankPage,
    CaseListPage,
    CommingSoonPage,
    LeadsListPageLayout,
    LeadPageLayout,
    ContactPageLayout,
    ProductsListPageLayout,
    ProductPageLayout,
    WatchingProductsListPageLayout,
    WatchingProductPageLayout,
    ConnectedMarketplacesListPageLayout,
    ConnectedMarketplacePageLayout,
    ImportProductPageLayout,
    UserOrdersListPageLayout,
    UserOrderPageLayout,
    ProductGroupsListPageLayout,
    ProductGroupPageLayout,
    AbTestsListPageLayout,
    AbTestPageLayout,
    SeoTopListPageLayout,
    SeoTopPromo,
    SeoTopObservationPageLayout
} from 'app/apps/personal-area';
import ControlExamplePage from "app/common/layouts/page/components/control-example-page/ControlExamplePage";
import ConnectedMarketplacesList from "app/common/components/lists/connected-marketplaces-list";
import { PlatformServiceSubscription } from 'app/apps/personal-area/common/components';
import { PlatformServicesType } from 'app/common/core';

class PageContent extends React.Component {

    public render() {
        return (
            <>
                {/* BEGIN Page Content */}
                <main id="js-page-content" role="main" className="page-content">
                    <Switch>
                        <Route path="/personal/marketplace-list" component={ConnectedMarketplacesList} />
                        <Route path="/personal/control-example-page" component={ControlExamplePage} />
                        <Route path="/personal/blank" component={BlankPage} />
                        <Route path="/personal/cases" component={CaseListPage} />

                        <Route path="/personal/managers/leads/:leadId" component={LeadPageLayout} />
                        <Route path="/personal/managers/leads" component={LeadsListPageLayout} />
                        <Route path="/personal/managers/contacts/:contactId" component={ContactPageLayout} />

                        <Route path="/personal/products/list/:filterName" component={ProductsListPageLayout} />
                        <Route path="/personal/products/card/:productId" component={ProductPageLayout} />
                        <Route path="/personal/products/import-product" component={ImportProductPageLayout} />

                        <Route path="/personal/analytics/watching-products/list" component={WatchingProductsListPageLayout} />
                        <Route path="/personal/analytics/watching-products/card/:productId" component={WatchingProductPageLayout} />

                        <Route path="/personal/reference-book/connected-marketplaces/list" component={ConnectedMarketplacesListPageLayout} />
                        <Route path="/personal/reference-book/connected-marketplaces/card/:connectedMarketplaceId" component={ConnectedMarketplacePageLayout} />

                        <Route path="/personal/user-orders/list/:serviceType" component={UserOrdersListPageLayout} />
                        <Route path="/personal/user-orders/card/:userOrderId" component={UserOrderPageLayout} />

                        <Route path="/personal/product-groups/list" component={ProductGroupsListPageLayout} />
                        <Route path="/personal/product-groups/card/:productGroupId" component={ProductGroupPageLayout} />

                        <Route path="/personal/promotions/abtest/list" component={AbTestsListPageLayout} />
                        <Route path="/personal/promotions/abtest/card/:abtestId" component={AbTestPageLayout} />

                        <Route
                            path="/personal/monitoring/seo/top/list"
                            render={(routeProps: any) =>
                                <PlatformServiceSubscription
                                    serviceCode={PlatformServicesType.MonitoringSerpTop}
                                    promo={<SeoTopPromo />}
                                    showSubscribeForm={true}
                                >
                                    <SeoTopListPageLayout {...routeProps} />
                                </PlatformServiceSubscription>
                            }
                        />
                        <Route
                            path="/personal/monitoring/seo/top/card/:observationId"
                            render={(routeProps: any) =>
                                <PlatformServiceSubscription
                                    serviceCode={PlatformServicesType.MonitoringSerpTop}
                                    promo={<SeoTopPromo />}
                                    showSubscribeForm={true}
                                >
                                    <SeoTopObservationPageLayout {...routeProps} />
                                </PlatformServiceSubscription>
                            }
                        />

                        {/* TODO */}
                        <Route path="/personal/support/card/:ticketId" component={CommingSoonPage} />

                        <Route exact={true} path="/personal" component={BlankPage} />
                        <Route render={() => <h1>Page not founds</h1>} />
                    </Switch>
                </main>

                {/* this overlay is activated only when mobile menu is triggered */}
                <div className="page-content-overlay" data-action="toggle" data-class="mobile-nav-on" />

                {/* END Page Content */}
            </>
        );
    }
}

export { PageContent };
