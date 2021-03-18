import * as React from 'react'
import { createBrowserHistory } from 'history';
import { Route, Router, Switch, Redirect } from 'react-router-dom';

import { PageLayout, LoginLayout } from './common/layouts';
import { getCurrentUser } from './common/helpers/current-user-helper';
import { ICurrentUser } from './common/helpers/contracts';
import { PrivateRoute } from './common/core';

const history = createBrowserHistory();

class App extends React.Component {
    private currentUser: ICurrentUser = getCurrentUser();

    render() {
        const { isAuthenticated } = this.currentUser;

        return (
            <Router history={history}>
                <Switch>
                    <Route exact={true} path="/" render={() => <Redirect to="/personal" />} />
                    <Route exact={true} path="/login" component={LoginLayout} />
                    <PrivateRoute path="/personal" component={PageLayout} redirectTo="/login" isAuthenticated={isAuthenticated} />

                    <Route render={() => <h1>Page not found</h1>} />
                </Switch>
            </Router>
        );
    }
}

export { App };