import * as React from 'react';
import { authService } from 'app/common/core/auth';

function QuickMenu() {
    return (
        <>
            {/* BEGIN Quick Menu */}
            <nav className="shortcut-menu d-none d-sm-block">
                <input type="checkbox" className="menu-open" name="menu-open" id="menu_open" />
                <label htmlFor="menu_open" className="menu-open-button ">
                    <span className="app-shortcut-icon d-block"/>
                </label>
                <a href="#" className="menu-item btn" data-toggle="tooltip" data-placement="left" title="Scroll Top">
                    <i className="fal fa-arrow-up"/>
                </a>
                <a className="menu-item btn" data-toggle="tooltip" data-placement="left" title="Logout" onClick={authService.logOut}>
                    <i className="fal fa-sign-out"/>
                </a>
                <a href="#" className="menu-item btn" data-action="app-fullscreen" data-toggle="tooltip" data-placement="left" title="Full Screen">
                    <i className="fal fa-expand"/>
                </a>
                <a href="#" className="menu-item btn" data-action="app-print" data-toggle="tooltip" data-placement="left" title="Print page">
                    <i className="fal fa-print"/>
                </a>
                <a href="#" className="menu-item btn" data-action="app-voice" data-toggle="tooltip" data-placement="left" title="Voice command">
                    <i className="fal fa-microphone"/>
                </a>
            </nav>
            {/* END Quick Menu */}
        </>
    );
}

export { QuickMenu };