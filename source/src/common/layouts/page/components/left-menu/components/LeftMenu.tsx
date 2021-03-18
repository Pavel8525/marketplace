import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import i18n from "i18next";

import { getCurrentUser } from 'app/common/helpers/current-user-helper';
import { NavigationItem } from 'app/common/core';

interface IOwnProps {
    plaformName: string;
    plaformDescription: string
    plaformLogo?: string;
}

type IProps = IOwnProps & WithTranslation;

class LeftMenu extends React.PureComponent<IProps> {
    private currentUser = getCurrentUser();

    public render() {
        const {
            plaformName,
            plaformDescription,
            plaformLogo
        } = this.props;

        const {
            userFullName,
            countryName,
            logoPath,
            email
        } = this.currentUser;

        return (
            <>
                {/* BEGIN Left Aside */}
                <aside className="page-sidebar">
                    <div className="page-logo">
                        <a href="#" className="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut">
                            <img src={plaformLogo} alt={plaformDescription} aria-roledescription="logo" />
                            <span className="page-logo-text mr-1">{plaformName}</span>
                            <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
                            <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
                        </a>
                    </div>

                    {/* BEGIN PRIMARY NAVIGATION */}
                    <nav id="js-primary-nav" className="primary-nav" role="navigation">
                        <div className="nav-filter">
                            <div className="position-relative">
                                <input type="text" id="nav_filter_input" placeholder="Filter menu" className="form-control" />
                                <a href="#" className="btn-primary btn-search-close js-waves-off" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar">
                                    <i className="fal fa-chevron-up"></i>
                                </a>
                            </div>
                        </div>

                        {/*
                        <div className="info-card">
                            <img src={logoPath} className="profile-image rounded-circle" alt={email} />
                            <div className="info-card-text">
                                <a href="#" className="d-flex align-items-center text-white">
                                    <span className="text-truncate text-truncate-sm d-inline-block">
                                        {userFullName}
                                    </span>
                                </a>

                                {countryName && (
                                    <span className="d-inline-block text-truncate text-truncate-sm">from {countryName}</span>
                                )}

                            </div>
                            <img src="/img/card-backgrounds/cover-2-lg.png" className="cover" alt="cover" />
                            <a href="#" className="pull-trigger-btn" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar" data-focus="nav_filter_input">
                                <i className="fal fa-angle-down"></i>
                            </a>
                        </div>
                        */}

                        <ul id="js-nav-menu" className="nav-menu">
                            <li className="nav-title">{i18n.t("left-menu:metrics-reports.title")}</li>
                            <li>
                                <a href="#" title="Dashboards" data-filter-tags="dashboard metric indicator report">
                                    <i className="fal fa-tachometer-alt"></i>
                                    <span className="nav-link-text">{i18n.t("left-menu:metrics-reports.dashboards")}</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="dashboard metric indicator report main">
                                            <span className="nav-link-text">Main</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="dashboard metric indicator report marketing">
                                            <span className="nav-link-text">Marketing</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="dashboard metric indicator report technical">
                                            <span className="nav-link-text">Technical</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" title="Dashboards" data-filter-tags="report">
                                    <i className="fal fa-chart-line"></i>
                                    <span className="nav-link-text">{i18n.t("left-menu:metrics-reports.reports")}</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="nps csat ces">
                                            <i className="fal fa-user-plus"></i>
                                            <span className="nav-link-text">NPS, CSAT, CES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="staff personal people employee">
                                            <i className="fal fa-male"></i>
                                            <span className="nav-link-text">Staff qualification</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="sales goods product order">
                                            <i className="fal fa-gift"></i>
                                            <span className="nav-link-text">Best sales</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="risk factor">
                                            <i className="fal fa-fire"></i>
                                            <span className="nav-link-text">Risk factors</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            {/* Monitoring */}
                            <li className="nav-title">{i18n.t("Мониторинг")}</li>
                            <NavigationItem to="/personal/analytics/watching-products/list" activeClassName="active" data-filter-tags="lead">
                                <i className="fal fa-analytics"></i>
                                <span className="nav-link-text">{i18n.t("Мониторинг артикула")}</span>
                            </NavigationItem>
                            <li>
                                <a href="#" data-filter-tags="">
                                    <i className="fal fa-spider-web"></i>
                                    <span className="nav-link-text">{i18n.t("Поисковая выдача")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/monitoring/seo/top/list" activeClassName="active" data-filter-tags="">
                                        <i className="fal fa-sort-amount-up-alt"></i>
                                        <span className="nav-link-text">{i18n.t("Позиция в ТОП")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>
                            <li>
                                <a href="#" data-filter-tags="">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("Цены")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/monitoring/product-price" activeClassName="active" data-filter-tags="">
                                        <i className="fal fa-analytics"></i>
                                        <span className="nav-link-text">{i18n.t("Изменения цены")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>
                            <li>
                                <a href="#" data-filter-tags="">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("Склад")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/monitoring/product-price" activeClassName="active" data-filter-tags="">
                                        <i className="fal fa-analytics"></i>
                                        <span className="nav-link-text">{i18n.t("Лимиты на складе")}</span>
                                    </NavigationItem>
                                </ul>
                                <ul>
                                    <NavigationItem to="/personal/monitoring/product-price" activeClassName="active" data-filter-tags="">
                                        <i className="fal fa-analytics"></i>
                                        <span className="nav-link-text">{i18n.t("Остатки на складе")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>
                            <li>
                                <a href="#" data-filter-tags="">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("Площадки")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/monitoring/product-price" activeClassName="active" data-filter-tags="">
                                        <i className="fal fa-analytics"></i>
                                        <span className="nav-link-text">{i18n.t("Новые товарные группы")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>





                            {/* Products */}
                            <li className="nav-title">{i18n.t("Каталог Товаров")}</li>
                            <NavigationItem to="/personal/products/list/all" activeClassName="active" data-filter-tags="product">
                                <i className="fal fa-shopping-basket"></i>
                                <span className="nav-link-text">{i18n.t("Товары")}</span>
                                <span className="dl-ref bg-primary-500 hidden-nav-function-minify hidden-nav-function-top">10 +</span>
                            </NavigationItem>

                            <NavigationItem to="/personal/product-groups/list" activeClassName="active" data-filter-tags="lead">
                                <i className="fal fa-bags-shopping"></i>
                                <span className="nav-link-text">{i18n.t("Группы товаров")}</span>
                            </NavigationItem>



                            <NavigationItem to="/personal/orders/leads" activeClassName="active" data-filter-tags="lead">
                                <i className="fal fa-star"></i>
                                <span className="nav-link-text">{i18n.t("Бренды")}</span>
                            </NavigationItem>

                            <li className="nav-title">{i18n.t("Продвижение")}</li>
                            <li>
                                <a href="#" data-filter-tags="tariff payment">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("Кампания")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/promotions/abtest/list" activeClassName="active" data-filter-tags="plan tariff">
                                        <i className="fal fa-cubes" />
                                        <span className="nav-link-text">{i18n.t("A/B Эксперименты")}</span>
                                    </NavigationItem>

                                    <NavigationItem to="/personal/account/payments" activeClassName="active" data-filter-tags="payment">
                                        <i className="fal fa-money-bill-alt" />
                                        <span className="nav-link-text">{i18n.t("Выкупы")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>
                            <li>
                                <a href="#" data-filter-tags="tariff payment">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("Оптимизация")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/account/payments" activeClassName="active" data-filter-tags="payment">
                                        <i className="fal fa-money-bill-alt" />
                                        <span className="nav-link-text">{i18n.t("Опросы")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>

                            {/* Orders */}
                            <li className="nav-title">{i18n.t("left-menu:orders.title")}</li>
                            <NavigationItem to="/personal/user-orders/list/all" activeClassName="active" data-filter-tags="booking">
                                <i className="fal fa-file-check"></i>
                                <span className="nav-link-text">{i18n.t("left-menu:orders.user-orders")}</span>
                            </NavigationItem>
                            <NavigationItem to="/personal/orders/tickets" activeClassName="active" data-filter-tags="ticket">
                                <i className="fal fa-ticket-alt"></i>
                                <span className="nav-link-text">{i18n.t("left-menu:orders.tickets")}</span>
                            </NavigationItem>

                            {/* Reference book */}
                            <li className="nav-title">{i18n.t("left-menu:reference-book.title")}</li>
                            <NavigationItem to="/personal/reference-book/connected-marketplaces/list" activeClassName="active" data-filter-tags="lead">
                                <i className="fal fa-store"></i>
                                <span className="nav-link-text">{i18n.t("left-menu:reference-book.marketplaces-list")}</span>
                            </NavigationItem>
                            <NavigationItem to="/personal" activeClassName="active" data-filter-tags="">
                                <i className="fal fa-sitemap"></i>
                                <span className="nav-link-text">{i18n.t("Категории")}</span>
                            </NavigationItem>

                            {/* Leads */}
                            <li className="nav-title">{i18n.t("Клиенты и Договора")}</li>
                            <NavigationItem to="/personal/managers/leads" activeClassName="active" data-filter-tags="lead">
                                <i className="fal fa-tags"></i>
                                <span className="nav-link-text">{i18n.t("Лиды")}</span>
                                <span className="dl-ref bg-primary-500 hidden-nav-function-minify hidden-nav-function-top">10 +</span>
                            </NavigationItem>

                            {/* Other */}
                            <li className="nav-title">{i18n.t("left-menu:other.title")}</li>
                            <li>
                                <a href="#" data-filter-tags="tariff payment">
                                    <i className="fal fa-money-bill"></i>
                                    <span className="nav-link-text">{i18n.t("left-menu:other.tariffs-payment")}</span>
                                </a>
                                <ul>
                                    <NavigationItem to="/personal/account/plans" activeClassName="active" data-filter-tags="plan tariff">
                                        <i className="fal fa-cubes" />
                                        <span className="nav-link-text">{i18n.t("left-menu:other.tariffs-payment-plans")}</span>
                                    </NavigationItem>

                                    <NavigationItem to="/personal/account/payments" activeClassName="active" data-filter-tags="payment">
                                        <i className="fal fa-money-bill-alt" />
                                        <span className="nav-link-text">{i18n.t("left-menu:other.tariffs-payment-payments")}</span>
                                    </NavigationItem>
                                </ul>
                            </li>
                            <NavigationItem to="/personal/access-managment" activeClassName="active" data-filter-tags="access">
                                <i className="fal fa-key" />
                                <span className="nav-link-text">{i18n.t("left-menu:other.access-management")}</span>
                            </NavigationItem>

                            {/* Development */}
                            <li className="nav-title">{i18n.t("left-menu:development-settings.title")}</li>
                            <NavigationItem to="/personal/control-example-page" activeClassName="active" data-filter-tags="group">
                                <i className="fal fa-bicycle" />
                                <span className="nav-link-text">UI controls</span>
                            </NavigationItem>
                            <NavigationItem to="/personal/cases" activeClassName="active" data-filter-tags="case">
                                <i className="fal fa-star"></i>
                                <span className="nav-link-text">{i18n.t("left-menu:campaigns-reserches.cases")}</span>
                            </NavigationItem>

                        </ul>
                    </nav>
                    {/* END PRIMARY NAVIGATION */}

                    {/* NAV FOOTER */}
                    {/*
                    <div className="nav-footer shadow-top">
                        <a href="#" data-action="toggle" data-class="nav-function-minify" className="hidden-md-down">
                            <i className="ni ni-chevron-right"></i>
                            <i className="ni ni-chevron-right"></i>
                        </a>
                        <ul className="list-table m-auto nav-footer-buttons">
                            <li>
                                <a data-toggle="tooltip" data-placement="top" title="Chat logs">
                                    <i className="fal fa-comments"></i>
                                </a>
                            </li>
                            <li>
                                <a data-toggle="tooltip" data-placement="top" title="Support Chat">
                                    <i className="fal fa-life-ring"></i>
                                </a>
                            </li>
                            <li>
                                <a data-toggle="tooltip" data-placement="top" title="Make a call">
                                    <i className="fal fa-phone"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    */}
                    {/* END NAV FOOTER */}
                </aside>
                {/* END Left Aside */}
            </>
        );
    }

    public componentDidMount() {
        const initApp = (window as any).initApp;
        const navHooks = (window as any).myapp_config.navHooks;
        initApp.buildNavigation(navHooks);
    }
}

const LeftMenuWithTranslation = withTranslation()(LeftMenu);
export { LeftMenuWithTranslation as LeftMenu };
