import * as React from 'react';

function PageSettings() {
    return (
        <>
            {/* BEGIN Page Settings */}
            <div className="modal fade js-modal-settings modal-backdrop-transparent" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-right modal-md">
                    <div className="modal-content">
                        <div className="dropdown-header bg-trans-gradient d-flex justify-content-center align-items-center w-100">
                            <h4 className="m-0 text-center color-white">
                                Layout Settings
                            <small className="mb-0 opacity-80">User Interface Settings</small>
                            </h4>
                            <button type="button" className="close text-white position-absolute pos-top pos-right p-2 m-1 mr-2" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i className="fal fa-times"></i></span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="settings-panel">
                                <div className="mt-4 d-table w-100 px-5">
                                    <div className="d-table-cell align-middle">
                                        <h5 className="p-0">
                                            App Layout
                                    </h5>
                                    </div>
                                </div>
                                <div className="list" id="fh">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="header-function-fixed"></a>
                                    <span className="onoffswitch-title">Fixed Header</span>
                                    <span className="onoffswitch-title-desc">header is in a fixed at all times</span>
                                </div>
                                <div className="list" id="nff">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-function-fixed"></a>
                                    <span className="onoffswitch-title">Fixed Navigation</span>
                                    <span className="onoffswitch-title-desc">left panel is fixed</span>
                                </div>
                                <div className="list" id="nfm">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-function-minify"></a>
                                    <span className="onoffswitch-title">Minify Navigation</span>
                                    <span className="onoffswitch-title-desc">Skew nav to maximize space</span>
                                </div>
                                <div className="list" id="nfh">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-function-hidden"></a>
                                    <span className="onoffswitch-title">Hide Navigation</span>
                                    <span className="onoffswitch-title-desc">roll mouse on edge to reveal</span>
                                </div>
                                <div className="list" id="nft">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-function-top"></a>
                                    <span className="onoffswitch-title">Top Navigation</span>
                                    <span className="onoffswitch-title-desc">Relocate left pane to top</span>
                                </div>
                                <div className="list" id="mmb">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-main-boxed"></a>
                                    <span className="onoffswitch-title">Boxed Layout</span>
                                    <span className="onoffswitch-title-desc">Encapsulates to a container</span>
                                </div>
                                <div className="expanded">
                                    <ul className="">
                                        <li>
                                            <div className="bg-fusion-50" data-action="toggle" data-class="mod-bg-1"></div>
                                        </li>
                                        <li>
                                            <div className="bg-warning-200" data-action="toggle" data-class="mod-bg-2"></div>
                                        </li>
                                        <li>
                                            <div className="bg-primary-200" data-action="toggle" data-class="mod-bg-3"></div>
                                        </li>
                                        <li>
                                            <div className="bg-success-300" data-action="toggle" data-class="mod-bg-4"></div>
                                        </li>
                                    </ul>
                                    <div className="list" id="mbgf">
                                        <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-fixed-bg"></a>
                                        <span className="onoffswitch-title">Fixed Background</span>
                                    </div>
                                </div>
                                <div className="mt-4 d-table w-100 px-5">
                                    <div className="d-table-cell align-middle">
                                        <h5 className="p-0">
                                            Mobile Menu
                                    </h5>
                                    </div>
                                </div>
                                <div className="list" id="nmp">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-mobile-push"></a>
                                    <span className="onoffswitch-title">Push Content</span>
                                    <span className="onoffswitch-title-desc">Content pushed on menu reveal</span>
                                </div>
                                <div className="list" id="nmno">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-mobile-no-overlay"></a>
                                    <span className="onoffswitch-title">No Overlay</span>
                                    <span className="onoffswitch-title-desc">Removes mesh on menu reveal</span>
                                </div>
                                <div className="list" id="sldo">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="nav-mobile-slide-out"></a>
                                    <span className="onoffswitch-title">Off-Canvas <sup>(beta)</sup></span>
                                    <span className="onoffswitch-title-desc">Content overlaps menu</span>
                                </div>
                                <div className="mt-4 d-table w-100 px-5">
                                    <div className="d-table-cell align-middle">
                                        <h5 className="p-0">
                                            Accessibility
                                    </h5>
                                    </div>
                                </div>
                                <div className="list" id="mbf">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-bigger-font"></a>
                                    <span className="onoffswitch-title">Bigger Content Font</span>
                                    <span className="onoffswitch-title-desc">content fonts are bigger for readability</span>
                                </div>
                                <div className="list" id="mhc">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-high-contrast"></a>
                                    <span className="onoffswitch-title">High Contrast Text (WCAG 2 AA)</span>
                                    <span className="onoffswitch-title-desc">4.5:1 text contrast ratio</span>
                                </div>
                                <div className="list" id="mcb">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-color-blind"></a>
                                    <span className="onoffswitch-title">Daltonism <sup>(beta)</sup> </span>
                                    <span className="onoffswitch-title-desc">color vision deficiency</span>
                                </div>
                                <div className="list" id="mpc">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-pace-custom"></a>
                                    <span className="onoffswitch-title">Preloader Inside</span>
                                    <span className="onoffswitch-title-desc">preloader will be inside content</span>
                                </div>
                                <div className="mt-4 d-table w-100 px-5">
                                    <div className="d-table-cell align-middle">
                                        <h5 className="p-0">
                                            Global Modifications
                                    </h5>
                                    </div>
                                </div>
                                <div className="list" id="mcbg">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-clean-page-bg"></a>
                                    <span className="onoffswitch-title">Clean Page Background</span>
                                    <span className="onoffswitch-title-desc">adds more whitespace</span>
                                </div>
                                <div className="list" id="mhni">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-hide-nav-icons"></a>
                                    <span className="onoffswitch-title">Hide Navigation Icons</span>
                                    <span className="onoffswitch-title-desc">invisible navigation icons</span>
                                </div>
                                <div className="list" id="dan">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-disable-animation"></a>
                                    <span className="onoffswitch-title">Disable CSS Animation</span>
                                    <span className="onoffswitch-title-desc">Disables CSS based animations</span>
                                </div>
                                <div className="list" id="mhic">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-hide-info-card"></a>
                                    <span className="onoffswitch-title">Hide Info Card</span>
                                    <span className="onoffswitch-title-desc">Hides info card from left panel</span>
                                </div>
                                <div className="list" id="mlph">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-lean-subheader"></a>
                                    <span className="onoffswitch-title">Lean Subheader</span>
                                    <span className="onoffswitch-title-desc">distinguished page header</span>
                                </div>
                                <div className="list" id="mnl">
                                    <a href="#" className="btn btn-switch" data-action="toggle" data-class="mod-nav-link"></a>
                                    <span className="onoffswitch-title">Hierarchical Navigation</span>
                                    <span className="onoffswitch-title-desc">Clear breakdown of nav links</span>
                                </div>
                                <div className="list mt-1">
                                    <span className="onoffswitch-title">Global Font Size <small>(RESETS ON REFRESH)</small> </span>
                                    <div className="btn-group btn-group-sm btn-group-toggle my-2" data-toggle="buttons">
                                        <label className="btn btn-default btn-sm" data-action="toggle-swap" data-class="root-text-sm" data-target="html">
                                            <input type="radio" name="changeFrontSize" /> SM
                                    </label>
                                        <label className="btn btn-default btn-sm" data-action="toggle-swap" data-class="root-text" data-target="html">
                                            <input type="radio" name="changeFrontSize" defaultChecked={false} /> MD
                                    </label>
                                        <label className="btn btn-default btn-sm" data-action="toggle-swap" data-class="root-text-lg" data-target="html">
                                            <input type="radio" name="changeFrontSize" /> LG
                                    </label>
                                        <label className="btn btn-default btn-sm" data-action="toggle-swap" data-class="root-text-xl" data-target="html">
                                            <input type="radio" name="changeFrontSize" /> XL
                                    </label>
                                    </div>
                                    <span className="onoffswitch-title-desc d-block mb-0">Change <strong>root</strong> font size to effect rem
                                    values</span>
                                </div>
                                <hr className="mb-0 mt-4" />
                                <div className="mt-2 d-table w-100 pl-5 pr-3">
                                    <div className="fs-xs text-muted p-2 alert alert-warning mt-3 mb-2">
                                        <i className="fal fa-exclamation-triangle text-warning mr-2"></i>The settings below uses localStorage to load
                                        the external CSS file as an overlap to the base css. Due to network latency and CPU utilization, you may
                                        experience a brief flickering effect on page load which may show the intial applied theme for a split
                                        second. Setting the prefered style/theme in the header will prevent this from happening.
                                    </div>
                                </div>
                                <div className="mt-2 d-table w-100 pl-5 pr-3">
                                    <div className="d-table-cell align-middle">
                                        <h5 className="p-0">
                                            Theme colors
                                    </h5>
                                    </div>
                                </div>
                                <div className="expanded theme-colors pl-5 pr-3">
                                    <ul className="m-0">
                                        <li>
                                            <a href="#" id="myapp-0" data-action="theme-update" data-themesave data-theme="" data-toggle="tooltip" data-placement="top" title="Wisteria (base css)" data-original-title="Wisteria (base css)"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-1" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-1.css" data-toggle="tooltip" data-placement="top" title="Tapestry" data-original-title="Tapestry"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-2" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-2.css" data-toggle="tooltip" data-placement="top" title="Atlantis" data-original-title="Atlantis"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-3" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-3.css" data-toggle="tooltip" data-placement="top" title="Indigo" data-original-title="Indigo"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-4" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-4.css" data-toggle="tooltip" data-placement="top" title="Dodger Blue" data-original-title="Dodger Blue"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-5" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-5.css" data-toggle="tooltip" data-placement="top" title="Tradewind" data-original-title="Tradewind"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-6" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-6.css" data-toggle="tooltip" data-placement="top" title="Cranberry" data-original-title="Cranberry"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-7" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-7.css" data-toggle="tooltip" data-placement="top" title="Oslo Gray" data-original-title="Oslo Gray"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-8" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-8.css" data-toggle="tooltip" data-placement="top" title="Chetwode Blue" data-original-title="Chetwode Blue"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-9" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-9.css" data-toggle="tooltip" data-placement="top" title="Apricot" data-original-title="Apricot"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-10" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-10.css" data-toggle="tooltip" data-placement="top" title="Blue Smoke" data-original-title="Blue Smoke"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-11" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-11.css" data-toggle="tooltip" data-placement="top" title="Green Smoke" data-original-title="Green Smoke"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-12" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-12.css" data-toggle="tooltip" data-placement="top" title="Wild Blue Yonder" data-original-title="Wild Blue Yonder"></a>
                                        </li>
                                        <li>
                                            <a href="#" id="myapp-13" data-action="theme-update" data-themesave data-theme="/css/themes/cust-theme-13.css" data-toggle="tooltip" data-placement="top" title="Emerald" data-original-title="Emerald"></a>
                                        </li>
                                    </ul>
                                </div>
                                <hr className="mb-0 mt-4" />
                                <div className="pl-5 pr-3 py-3 bg-faded">
                                    <div className="row no-gutters">
                                        <div className="col-6 pr-1">
                                            <a href="#" className="btn btn-outline-danger fw-500 btn-block" data-action="app-reset">Reset Settings</a>
                                        </div>
                                        <div className="col-6 pl-1">
                                            <a href="#" className="btn btn-danger fw-500 btn-block" data-action="factory-reset">Factory Reset</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span id="saving"></span>
                        </div>
                    </div>
                </div>
            </div>
            {/* END Page Settings */}
        </>
    );
}

export { PageSettings };