import * as React from 'react';
import classNames from 'classnames';

import { getApplicationAddons } from 'app/common/helpers/application-helper';
import { any, mapIfAny } from 'app/common/helpers/array-helper';


class AppShortucts extends React.PureComponent {
    private addons = getApplicationAddons().sort((a, b) => (a.order - b.order));

    public render() {
        if (!any(this.addons)) {
            return null;
        }

        return (
            <>
                <div>
                    <a href="#" className="header-icon" data-toggle="dropdown" title="My Apps">
                        <i className="fal fa-cube"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-animated w-auto h-auto">
                        <div className="dropdown-header bg-trans-gradient d-flex justify-content-center align-items-center rounded-top">
                            <h4 className="m-0 text-center color-white">
                                Quick Shortcut
                                <small className="mb-0 opacity-80">User Applications & Addons</small>
                            </h4>
                        </div>

                        <div className="custom-scroll h-100">
                            <ul className="app-list">
                                {mapIfAny(this.addons, (item, key) => (
                                    <li key={key}>
                                        <a href={item.url || "#"} className="app-list-item hover-white">
                                            <span className="icon-stack">
                                                <i className="base-2 icon-stack-3x color-primary-600"></i>
                                                <i className="base-3 icon-stack-2x color-primary-700"></i>
                                                <i className={classNames("ni icon-stack-1x text-white fs-lg", item.logoClass)}></i>
                                            </span>
                                            <span className="app-list-name">{item.name}</span>
                                        </a>
                                    </li>
                                ))}

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-2 icon-stack-3x color-primary-400"></i>
                                            <i className="base-10 text-white icon-stack-1x"></i>
                                            <i className="ni md-profile color-primary-800 icon-stack-2x"></i>
                                        </span>
                                        <span className="app-list-name">Account</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-9 icon-stack-3x color-success-400"></i>
                                            <i className="base-2 icon-stack-2x color-success-500"></i>
                                            <i className="ni ni-shield icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Security</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-18 icon-stack-3x color-info-700"></i>
                                            <span className="position-absolute pos-top pos-left pos-right color-white fs-md mt-2 fw-400">28</span>
                                        </span>
                                        <span className="app-list-name">Calendar</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-7 icon-stack-3x color-info-500"></i>
                                            <i className="base-7 icon-stack-2x color-info-700"></i>
                                            <i className="ni ni-graph icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Stats</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-4 icon-stack-3x color-danger-500"></i>
                                            <i className="base-4 icon-stack-1x color-danger-400"></i>
                                            <i className="ni ni-envelope icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Messages</span>
                                    </a>
                                </li>
                                
                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-4 icon-stack-3x color-fusion-400"></i>
                                            <i className="base-5 icon-stack-2x color-fusion-200"></i>
                                            <i className="base-5 icon-stack-1x color-fusion-100"></i>
                                            <i className="fal fa-keyboard icon-stack-1x color-info-50"></i>
                                        </span>
                                        <span className="app-list-name">Notes</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-16 icon-stack-3x color-fusion-500"></i>
                                            <i className="base-10 icon-stack-1x color-primary-50 opacity-30"></i>
                                            <i className="base-10 icon-stack-1x fs-xl color-primary-50 opacity-20"></i>
                                            <i className="fal fa-dot-circle icon-stack-1x text-white opacity-85"></i>
                                        </span>
                                        <span className="app-list-name">Photos</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-19 icon-stack-3x color-primary-400"></i>
                                            <i className="base-7 icon-stack-2x color-primary-300"></i>
                                            <i className="base-7 icon-stack-1x fs-xxl color-primary-200"></i>
                                            <i className="base-7 icon-stack-1x color-primary-500"></i>
                                            <i className="fal fa-globe icon-stack-1x text-white opacity-85"></i>
                                        </span>
                                        <span className="app-list-name">Maps</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-5 icon-stack-3x color-success-700 opacity-80"></i>
                                            <i className="base-12 icon-stack-2x color-success-700 opacity-30"></i>
                                            <i className="fal fa-comment-alt icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Chat</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-5 icon-stack-3x color-warning-600"></i>
                                            <i className="base-7 icon-stack-2x color-warning-800 opacity-50"></i>
                                            <i className="fal fa-phone icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Phone</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="app-list-item hover-white">
                                        <span className="icon-stack">
                                            <i className="base-6 icon-stack-3x color-danger-600"></i>
                                            <i className="fal fa-chart-line icon-stack-1x text-white"></i>
                                        </span>
                                        <span className="app-list-name">Projects</span>
                                    </a>
                                </li>

                                <li className="w-100">
                                    <a href="#" className="btn btn-default mt-4 mb-2 pr-5 pl-5"> Add more apps </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}

export { AppShortucts };