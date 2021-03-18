import * as React from 'react';

function Messenger() {
    return (
        <>
            {/* BEGIN Messenger */}
            <div className="modal fade js-modal-messenger modal-backdrop-transparent" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-right">
                    <div className="modal-content h-100">
                        <div className="dropdown-header bg-trans-gradient d-flex align-items-center w-100">
                            <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                                <span className="mr-2">
                                    <span className="rounded-circle profile-image d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-d.png')", backgroundSize: "cover" }}></span>
                                </span>
                                <div className="info-card-text">
                                    <a className="fs-lg text-truncate text-truncate-lg text-white" data-toggle="dropdown" aria-expanded="false">
                                        Tracey Chang
                                    <i className="fal fa-angle-down d-inline-block ml-1 text-white fs-md"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">Send Email</a>
                                        <a className="dropdown-item" href="#">Create Appointment</a>
                                        <a className="dropdown-item" href="#">Block User</a>
                                    </div>
                                    <span className="text-truncate text-truncate-md opacity-80">IT Director</span>
                                </div>
                            </div>
                            <button type="button" className="close text-white position-absolute pos-top pos-right p-2 m-1 mr-2" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i className="fal fa-times"></i></span>
                            </button>
                        </div>
                        <div className="modal-body p-0 h-100 d-flex">
                            <div className="msgr-list d-flex flex-column bg-faded border-faded border-top-0 border-right-0 border-bottom-0 position-absolute pos-top pos-bottom">
                                <div>
                                    <div className="height-4 width-3 h3 m-0 d-flex justify-content-center flex-column color-primary-500 pl-3 mt-2">
                                        <i className="fal fa-search"></i>
                                    </div>
                                    <input type="text" className="form-control bg-white" id="msgr_listfilter_input" placeholder="Filter contacts" aria-label="FriendSearch" data-listfilter="#js-msgr-listfilter" />
                                </div>
                                <div className="flex-1 h-100 custom-scroll">
                                    <div className="w-100">
                                        <ul id="js-msgr-listfilter" className="list-unstyled m-0">
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="tracey chang online">
                                                    <div className="d-table-cell align-middle status status-success status-sm ">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-d.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            Tracey Chang
                                                        <small className="d-block font-italic text-success fs-xs">
                                                                Online
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="oliver kopyuv online">
                                                    <div className="d-table-cell align-middle status status-success status-sm ">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-b.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            Oliver Kopyuv
                                                        <small className="d-block font-italic text-success fs-xs">
                                                                Online
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="dr john cook phd away">
                                                    <div className="d-table-cell align-middle status status-warning status-sm ">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-e.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            Dr. John Cook PhD
                                                        <small className="d-block font-italic fs-xs">
                                                                Away
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney online">
                                                    <div className="d-table-cell align-middle status status-success status-sm ">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-g.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            Ali Amdaney
                                                        <small className="d-block font-italic fs-xs text-success">
                                                                Online
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="sarah mcbrook online">
                                                    <div className="d-table-cell align-middle status status-success status-sm">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-h.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            Sarah McBrook
                                                        <small className="d-block font-italic fs-xs text-success">
                                                                Online
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney offline">
                                                    <div className="d-table-cell align-middle status status-sm">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-a.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            oliver.kopyuv@gotbootstrap.com
                                                        <small className="d-block font-italic fs-xs">
                                                                Offline
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney busy">
                                                    <div className="d-table-cell align-middle status status-danger status-sm">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-j.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            oliver.kopyuv@gotbootstrap.com
                                                        <small className="d-block font-italic fs-xs text-danger">
                                                                Busy
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney offline">
                                                    <div className="d-table-cell align-middle status status-sm">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-c.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            oliver.kopyuv@gotbootstrap.com
                                                        <small className="d-block font-italic fs-xs">
                                                                Offline
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney inactive">
                                                    <div className="d-table-cell align-middle">
                                                        <span className="profile-image-md rounded-circle d-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-m.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                    <div className="d-table-cell w-100 align-middle pl-2 pr-2">
                                                        <div className="text-truncate text-truncate-md">
                                                            +714651347790
                                                        <small className="d-block font-italic fs-xs opacity-50">
                                                                Missed Call
                                                        </small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="filter-message js-filter-message"></div>
                                    </div>
                                </div>
                                <div>
                                    <a className="fs-xl d-flex align-items-center p-3">
                                        <i className="fal fa-cogs"></i>
                                    </a>
                                </div>
                            </div>

                            <div className="msgr d-flex h-100 flex-column bg-white">
                                <div className="custom-scroll flex-1 h-100">
                                    <div id="chat_container" className="w-100 p-4">
                                        <div className="chat-segment">
                                            <div className="time-stamp text-center mb-2 fw-400">
                                                Jun 19
                                        </div>
                                        </div>
                                        <div className="chat-segment chat-segment-sent">
                                            <div className="chat-message">
                                                <p>
                                                    Hey Tracey, did you get my files?
                                            </p>
                                            </div>
                                            <div className="text-right fw-300 text-muted mt-1 fs-xs">
                                                3:00 pm
                                        </div>
                                        </div>
                                        <div className="chat-segment chat-segment-get">
                                            <div className="chat-message">
                                                <p>
                                                    Hi
                                            </p>
                                                <p>
                                                    Sorry going through a busy time in office. Yes I analyzed the solution.
                                            </p>
                                                <p>
                                                    It will require some resource, which I could not manage.
                                            </p>
                                            </div>
                                            <div className="fw-300 text-muted mt-1 fs-xs">
                                                3:24 pm
                                        </div>
                                        </div>
                                        <div className="chat-segment chat-segment-sent chat-start">
                                            <div className="chat-message">
                                                <p>
                                                    Okay
                                            </p>
                                            </div>
                                        </div>
                                        <div className="chat-segment chat-segment-sent chat-end">
                                            <div className="chat-message">
                                                <p>
                                                    Sending you some dough today, you can allocate the resources to this project.
                                            </p>
                                            </div>
                                            <div className="text-right fw-300 text-muted mt-1 fs-xs">
                                                3:26 pm
                                        </div>
                                        </div>
                                        <div className="chat-segment chat-segment-get chat-start">
                                            <div className="chat-message">
                                                <p>
                                                    Perfect. Thanks a lot!
                                            </p>
                                            </div>
                                        </div>
                                        <div className="chat-segment chat-segment-get">
                                            <div className="chat-message">
                                                <p>
                                                    I will have them ready by tonight.
                                            </p>
                                            </div>
                                        </div>
                                        <div className="chat-segment chat-segment-get chat-end">
                                            <div className="chat-message">
                                                <p>
                                                    Cheers
                                            </p>
                                            </div>
                                        </div>
                                        <div className="chat-segment">
                                            <div className="time-stamp text-center mb-2 fw-400">
                                                Jun 20
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column">
                                    <div className="border-faded border-right-0 border-bottom-0 border-left-0 flex-1 mr-3 ml-3 position-relative shadow-top">
                                        <div className="pt-3 pb-1 pr-0 pl-0 rounded-0" tabIndex={-1}>
                                            <div id="msgr_input" contentEditable={true} data-placeholder="Type your message here..." className="height-10 form-content-editable"></div>
                                        </div>
                                    </div>
                                    <div className="height-8 px-3 d-flex flex-row align-items-center flex-wrap flex-shrink-0">
                                        <a className="btn btn-icon fs-xl width-1 mr-1" data-toggle="tooltip" data-original-title="More options" data-placement="top">
                                            <i className="fal fa-ellipsis-v-alt color-fusion-300"></i>
                                        </a>
                                        <a className="btn btn-icon fs-xl mr-1" data-toggle="tooltip" data-original-title="Attach files" data-placement="top">
                                            <i className="fal fa-paperclip color-fusion-300"></i>
                                        </a>
                                        <a className="btn btn-icon fs-xl mr-1" data-toggle="tooltip" data-original-title="Insert photo" data-placement="top">
                                            <i className="fal fa-camera color-fusion-300"></i>
                                        </a>
                                        <div className="ml-auto">
                                            <a className="btn btn-info">Send</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* END Messenger */}
        </>
    );
}

export { Messenger };