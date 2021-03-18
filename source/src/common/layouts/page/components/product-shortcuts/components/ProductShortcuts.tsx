import * as React from 'react';

function ProductShortcuts() {
    return (
        <>
            {/* BEGIN Product shortcuts */}
            <div className="modal fade modal-backdrop-transparent" id="modal-shortcut" tabIndex={-1} role="dialog" aria-labelledby="modal-shortcut" aria-hidden="true">
                <div className="modal-dialog modal-dialog-top modal-transparent" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <ul className="app-list w-auto h-auto p-0 text-left">
                                <li>
                                    <a href="intel_introduction.html" className="app-list-item text-white border-0 m-0">
                                        <div className="icon-stack">
                                            <i className="base base-7 icon-stack-3x opacity-100 color-primary-500 "></i>
                                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                                            <i className="fal fa-home icon-stack-1x opacity-100 color-white"></i>
                                        </div>
                                        <span className="app-list-name">Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="page_inbox_general.html" className="app-list-item text-white border-0 m-0">
                                        <div className="icon-stack">
                                            <i className="base base-7 icon-stack-3x opacity-100 color-success-500 "></i>
                                            <i className="base base-7 icon-stack-2x opacity-100 color-success-300 "></i>
                                            <i className="ni ni-envelope icon-stack-1x text-white"></i>
                                        </div>
                                        <span className="app-list-name">Inbox</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="intel_introduction.html" className="app-list-item text-white border-0 m-0">
                                        <div className="icon-stack">
                                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                                            <i className="fal fa-plus icon-stack-1x opacity-100 color-white"></i>
                                        </div>
                                        <span className="app-list-name">Add More</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* END Product shortcuts */}
        </>
    );
}

export { ProductShortcuts };