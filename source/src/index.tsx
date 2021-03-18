import './css/popover/popover.css'
import './css/vendors.bundle.css';
import './css/app.bundle.css';
import './css/custom-styles.css';
import './css/notifications/toastr/toastr.css';

//import '@progress/kendo-theme-default/dist/all.css';
//import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@progress/kendo-theme-material/dist/all.css';

import './common/core/translation/i18n';
import './common/core/transport/axios';
import './common/core/notification/toastr';

import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from 'app/common/core/store/configure';

import { App } from './App';

const Loading = () => <div>loading...</div>;

ReactDOM.render(
    (
        <Provider store={store}>
            <React.Suspense fallback={<Loading />}>
                <App />
            </React.Suspense>
        </Provider >
    ),
    document.getElementById('root')
);
