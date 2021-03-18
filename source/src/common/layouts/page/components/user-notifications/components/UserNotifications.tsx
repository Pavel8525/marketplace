import * as React from 'react';

function UserNotifications() {
    return (
        <>
            <div>
                <a href="#" className="header-icon" data-toggle="dropdown" title="You got 11 notifications">
                    <i className="fal fa-bell"></i>
                    <span className="badge badge-icon">11</span>
                </a>
                <div className="dropdown-menu dropdown-menu-animated dropdown-xl">
                    <div className="dropdown-header bg-trans-gradient d-flex justify-content-center align-items-center rounded-top mb-2">
                        <h4 className="m-0 text-center color-white">
                            11 New<small className="mb-0 opacity-80">User Notifications</small>
                        </h4>
                    </div>
                    <ul className="nav nav-tabs nav-tabs-clean" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link px-4 fs-md js-waves-on fw-500" data-toggle="tab" href="#tab-messages" data-i18n="drpdwn.messages">Messages</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-4 fs-md js-waves-on fw-500" data-toggle="tab" href="#tab-feeds" data-i18n="drpdwn.feeds">Feeds</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-4 fs-md js-waves-on fw-500" data-toggle="tab" href="#tab-events" data-i18n="drpdwn.events">Events</a>
                        </li>
                    </ul>
                    <div className="tab-content tab-notification">
                        <div className="tab-pane active p-3 text-center">
                            <h5 className="mt-4 pt-4 fw-500">
                                <span className="d-block fa-3x pb-4 text-muted">
                                    <i className="ni ni-arrow-up text-gradient opacity-70"></i>
                                </span> Select a tab above to activate
                                                <small className="mt-3 fs-b fw-400 text-muted">
                                    This blank page message helps protect your privacy, or you can show the first message here automatically through
                                                    <a href="#">settings page</a>
                                </small>
                            </h5>
                        </div>
                        <div className="tab-pane" id="tab-messages" role="tabpanel">
                            <div className="custom-scroll h-100">
                                <ul className="notification">
                                    <li className="unread">
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-c.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Melissa Ayre <span className="badge badge-primary fw-n position-absolute pos-top pos-right mt-1">INBOX</span></span>
                                                <span className="msg-a fs-sm">Re: New security codes</span>
                                                <span className="msg-b fs-xs">Hello again and thanks for being part...</span>
                                                <span className="fs-nano text-muted mt-1">56 seconds ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li className="unread">
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-a.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Adison Lee</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">2 minutes ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status status-success mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-b.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Oliver Kopyuv</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">3 days ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status status-warning mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "('/img/demo/avatars/avatar-e.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Dr. John Cook PhD</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">2 weeks ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status status-success mr-2">
                                                {/* <img src="/img/demo/avatars/avatar-m.png" data-src="/img/demo/avatars/avatar-h.png" className="profile-image rounded-circle" alt="Sarah McBrook" /> */}
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-h.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Sarah McBrook</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">3 weeks ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status status-success mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-m.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Anothony Bezyeth</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">one month ago</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="d-flex align-items-center">
                                            <span className="status status-danger mr-2">
                                                <span className="profile-image rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-j.png')" }}></span>
                                            </span>
                                            <span className="d-flex flex-column flex-1 ml-1">
                                                <span className="name">Lisa Hatchensen</span>
                                                <span className="msg-a fs-sm">Msed quia non numquam eius</span>
                                                <span className="fs-nano text-muted mt-1">one year ago</span>
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="tab-pane" id="tab-feeds" role="tabpanel">
                            <div className="custom-scroll h-100">
                                <ul className="notification">
                                    <li className="unread">
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            <span className="d-flex flex-column flex-1">
                                                <span className="name d-flex align-items-center">Administrator <span className="badge badge-success fw-n ml-1">UPDATE</span></span>
                                                <span className="msg-a fs-sm">
                                                    System updated to version <strong>4.0.2</strong> <a href="intel_build_notes.html">(patch notes)</a>
                                                </span>
                                                <span className="fs-nano text-muted mt-1">5 mins ago</span>
                                            </span>
                                            <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            <div className="d-flex flex-column flex-1">
                                                <span className="name">
                                                    Adison Lee <span className="fw-300 d-inline">replied to your video <a href="#" className="fw-400"> Cancer Drug</a> </span>
                                                </span>
                                                <span className="msg-a fs-sm mt-2">Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day...</span>
                                                <span className="fs-nano text-muted mt-1">10 minutes ago</span>
                                            </div>
                                            <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            {/*<img src="/img/demo/avatars/avatar-m.png" data-src="/img/demo/avatars/avatar-k.png" className="profile-image rounded-circle" alt="k" />*/}
                                            <div className="d-flex flex-column flex-1">
                                                <span className="name">
                                                    Troy Norman'<span className="fw-300">s new connections</span>
                                                </span>
                                                <div className="fs-sm d-flex align-items-center mt-2">
                                                    <span className="profile-image-md mr-1 rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-a.png')", backgroundSize: "cover" }}></span>
                                                    <span className="profile-image-md mr-1 rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-b.png')", backgroundSize: "cover" }}></span>
                                                    <span className="profile-image-md mr-1 rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-c.png')", backgroundSize: "cover" }}></span>
                                                    <span className="profile-image-md mr-1 rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-e.png')", backgroundSize: "cover" }}></span>
                                                    <div data-hasmore="+3" className="rounded-circle profile-image-md mr-1">
                                                        <span className="profile-image-md mr-1 rounded-circle d-inline-block" style={{ backgroundImage: "url('/img/demo/avatars/avatar-h.png')", backgroundSize: "cover" }}></span>
                                                    </div>
                                                </div>
                                                <span className="fs-nano text-muted mt-1">55 minutes ago</span>
                                            </div>
                                            <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            {/*<img src="/img/demo/avatars/avatar-m.png" data-src="/img/demo/avatars/avatar-e.png" className="profile-image-sm rounded-circle align-self-start mt-1" alt="k" />*/}
                                            <div className="d-flex flex-column flex-1">
                                                <span className="name">Dr John Cook <span className="fw-300">sent a <span className="text-danger">new signal</span></span></span>
                                                <span className="msg-a fs-sm mt-2">Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.</span>
                                                <span className="fs-nano text-muted mt-1">10 minutes ago</span>
                                            </div>
                                            <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            <div className="d-flex flex-column flex-1">
                                                <span className="name">Lab Images <span className="fw-300">were updated!</span></span>
                                                <div className="fs-sm d-flex align-items-center mt-1">
                                                    <a href="#" className="mr-1 mt-1" title="Cell A-0012">
                                                        <span className="d-block img-share" style={{ backgroundImage: "url('/img/thumbs/pic-7.png')", backgroundSize: "cover" }}></span>
                                                    </a>
                                                    <a href="#" className="mr-1 mt-1" title="Patient A-473 saliva">
                                                        <span className="d-block img-share" style={{ backgroundImage: "url('/img/thumbs/pic-8.png')", backgroundSize: "cover" }}></span>
                                                    </a>
                                                    <a href="#" className="mr-1 mt-1" title="Patient A-473 blood cells">
                                                        <span className="d-block img-share" style={{ backgroundImage: "url('/img/thumbs/pic-11.png')", backgroundSize: "cover" }}></span>
                                                    </a>
                                                    <a href="#" className="mr-1 mt-1" title="Patient A-473 Membrane O.C">
                                                        <span className="d-block img-share" style={{ backgroundImage: "url('/img/thumbs/pic-12.png')", backgroundSize: "cover" }}></span>
                                                    </a>
                                                </div>
                                                <span className="fs-nano text-muted mt-1">55 minutes ago</span>
                                            </div>
                                            <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="d-flex align-items-center show-child-on-hover">
                                            {/*<img src="/img/demo/avatars/avatar-m.png" data-src="/img/demo/avatars/avatar-h.png" className="profile-image rounded-circle align-self-start mt-1" alt="k" />*/}
                                            <div className="d-flex flex-column flex-1">
                                                <div className="name mb-2">
                                                    Lisa Lamar<span className="fw-300"> updated project</span>
                                                </div>
                                                <div className="row fs-b fw-300">
                                                    <div className="col text-left">
                                                        Progress
                                                                    </div>
                                                    <div className="col text-right fw-500">
                                                        45%
                                                                    </div>
                                                </div>
                                                <div className="progress progress-sm d-flex mt-1">
                                                    <span className="progress-bar bg-primary-500 progress-bar-striped" role="progressbar" style={{ width: "45%" }} aria-valuenow={45} aria-valuemin={0} aria-valuemax={100}></span>
                                                </div>
                                                <span className="fs-nano text-muted mt-1">2 hrs ago</span>
                                                <div className="show-on-hover-parent position-absolute pos-right pos-bottom p-3">
                                                    <a href="#" className="text-muted" title="delete"><i className="fal fa-trash-alt"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="tab-pane" id="tab-events" role="tabpanel">
                            <div className="d-flex flex-column h-100">
                                <div className="h-auto">
                                    <table className="table table-bordered table-calendar m-0 w-100 h-100 border-0">
                                        <tbody>
                                            <tr>
                                                <th colSpan={7} className="pt-3 pb-2 pl-3 pr-3 text-center">
                                                    <div className="js-get-date h5 mb-2">[your date here]</div>
                                                </th>
                                            </tr>
                                            <tr className="text-center">
                                                <th>Sun</th>
                                                <th>Mon</th>
                                                <th>Tue</th>
                                                <th>Wed</th>
                                                <th>Thu</th>
                                                <th>Fri</th>
                                                <th>Sat</th>
                                            </tr>
                                            <tr>
                                                <td className="text-muted bg-faded">30</td>
                                                <td>1</td>
                                                <td>2</td>
                                                <td>3</td>
                                                <td>4</td>
                                                <td>5</td>
                                                <td><i className="fal fa-birthday-cake mt-1 ml-1 position-absolute pos-left pos-top text-primary"></i> 6</td>
                                            </tr>
                                            <tr>
                                                <td>7</td>
                                                <td>8</td>
                                                <td>9</td>
                                                <td className="bg-primary-300 pattern-0">10</td>
                                                <td>11</td>
                                                <td>12</td>
                                                <td>13</td>
                                            </tr>
                                            <tr>
                                                <td>14</td>
                                                <td>15</td>
                                                <td>16</td>
                                                <td>17</td>
                                                <td>18</td>
                                                <td>19</td>
                                                <td>20</td>
                                            </tr>
                                            <tr>
                                                <td>21</td>
                                                <td>22</td>
                                                <td>23</td>
                                                <td>24</td>
                                                <td>25</td>
                                                <td>26</td>
                                                <td>27</td>
                                            </tr>
                                            <tr>
                                                <td>28</td>
                                                <td>29</td>
                                                <td>30</td>
                                                <td>31</td>
                                                <td className="text-muted bg-faded">1</td>
                                                <td className="text-muted bg-faded">2</td>
                                                <td className="text-muted bg-faded">3</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex-1 custom-scroll">
                                    <div className="p-2">
                                        <div className="d-flex align-items-center text-left mb-3">
                                            <div className="width-5 fw-300 text-primary l-h-n mr-1 align-self-start fs-xxl">
                                                15
                                                            </div>
                                            <div className="flex-1">
                                                <div className="d-flex flex-column">
                                                    <span className="l-h-n fs-md fw-500 opacity-70">
                                                        October 2020
                                                                    </span>
                                                    <span className="l-h-n fs-nano fw-400 text-secondary">
                                                        Friday
                                                                    </span>
                                                </div>
                                                <div className="mt-3">
                                                    <p>
                                                        <strong>2:30PM</strong> - Doctor's appointment
                                                                    </p>
                                                    <p>
                                                        <strong>3:30PM</strong> - Report overview
                                                                    </p>
                                                    <p>
                                                        <strong>4:30PM</strong> - Meeting with Donnah V.
                                                                    </p>
                                                    <p>
                                                        <strong>5:30PM</strong> - Late Lunch
                                                                    </p>
                                                    <p>
                                                        <strong>6:30PM</strong> - Report Compression
                                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-2 px-3 bg-faded d-block rounded-bottom text-right border-faded border-bottom-0 border-right-0 border-left-0">
                        <a href="#" className="fs-xs fw-500 ml-auto">view all notifications</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export { UserNotifications };