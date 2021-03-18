import * as React from 'react';
import { AppShortucts } from './AppShortcuts';
import { UserNotifications } from '../../user-notifications';
import { UserMenu } from './UserMenu';

interface IProps {
    plaformName: string;
    plaformDescription: string
    plaformLogo?: string;
}

class Header extends React.PureComponent<IProps> {
    public render() {
        const {
            plaformName,
            plaformDescription,
            plaformLogo
        } = this.props;

        return (
            <>
                {/* BEGIN Page Header */}
                <header className="page-header" role="banner">
                    {/* we need this logo when user switches to nav-function-top */}
                    <div className="page-logo">
                        <a href="#" className="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut">
                            <img src={plaformLogo} alt={plaformDescription} aria-roledescription="logo" />
                            <span className="page-logo-text mr-1">{plaformName}</span>
                            <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
                            <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
                        </a>
                    </div>

                    {/* DOC: nav menu layout change shortcut */}
                    <div className="hidden-md-down dropdown-icon-menu position-relative">
                        <a href="#" className="header-btn btn js-waves-off" data-action="toggle" data-class="nav-function-hidden" title="Hide Navigation">
                            <i className="ni ni-menu"></i>
                        </a>
                        <ul>
                            <li>
                                <a href="#" className="btn js-waves-off" data-action="toggle" data-class="nav-function-minify" title="Minify Navigation">
                                    <i className="ni ni-minify-nav"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="btn js-waves-off" data-action="toggle" data-class="nav-function-fixed" title="Lock Navigation">
                                    <i className="ni ni-lock-nav"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* DOC: mobile button appears during mobile width */}
                    <div className="hidden-lg-up">
                        <a href="#" className="header-btn btn press-scale-down" data-action="toggle" data-class="mobile-nav-on">
                            <i className="ni ni-menu"></i>
                        </a>
                    </div>

                    <div className="search">
                        <div id="portal-page-header" />
                        {/*
                        <form className="app-forms hidden-xs-down" role="search" action="page_search.html" autoComplete="off">
                            <input type="text" id="search-field" placeholder="Search for anything" className="form-control" tabIndex={1} />
                            <a href="#" className="btn-danger btn-search-close js-waves-off d-none" data-action="toggle" data-class="mobile-search-on">
                                <i className="fal fa-times"></i>
                            </a>
                        </form>
                        */}
                    </div>
                    
                    {/* activate app search icon (mobile) */}
                    <div className="ml-auto d-flex">
                        <div className="hidden-sm-up">
                            <a href="#" className="header-icon" data-action="toggle" data-class="mobile-search-on" data-focus="search-field" title="Search">
                                <i className="fal fa-search"></i>
                            </a>
                        </div>
                    </div>

                    {/* app settings */}
                    <div className="hidden-md-down">
                        <a href="#" className="header-icon" data-toggle="modal" data-target=".js-modal-settings">
                            <i className="fal fa-cog"></i>
                        </a>
                    </div>

                    {/* app shortcuts */}
                    <AppShortucts />

                    {/* app message */}
                    <a href="#" className="header-icon" data-toggle="modal" data-target=".js-modal-messenger">
                        <i className="fal fa-globe"></i>
                        <span className="badge badge-icon">!</span>
                    </a>

                    {/* app notification */}
                    <UserNotifications />

                    {/* app user menu */}
                    <UserMenu />
                </header>
                {/* END Page Header */}
            </>
        );
    }
}

export { Header };