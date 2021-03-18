import * as React from 'react';
import { Redirect } from 'react-router';

import { ICurrentUser } from 'app/common/helpers/contracts';
import { getCurrentUser } from 'app/common/helpers/current-user-helper';
import { routeDefaultPath } from 'app/common/constants';
import { LoginPage } from 'app/apps/auth/pages';

class LoginLayout extends React.Component {
    private currentUser: ICurrentUser = getCurrentUser();

    public render() {
        if (this.currentUser.isAuthenticated) {
            return (<Redirect to={routeDefaultPath} />);
        }
        return (
            <>
                <LoginPage />
            </>
        );
    }
}

export { LoginLayout };