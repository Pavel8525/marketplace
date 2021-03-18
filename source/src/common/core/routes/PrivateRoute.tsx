import * as React from 'react';
import {
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
    redirectTo: string;
    isAuthenticated: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, isAuthenticated, redirectTo, ...rest } = props;

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                isAuthenticated
                    ?
                    (
                        <Component {...routeProps} />
                    )
                    :
                    (
                        <Redirect
                            to={{
                                pathname: redirectTo,
                                state: { from: routeProps.location }
                            }}
                        />
                    )
            }
        />
    );
};

export { PrivateRoute };