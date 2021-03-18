//https://stackoverflow.com/questions/42980858/react-router-v4-setting-activeclass-on-parent

import * as React from 'react';
import {
    Route, Link
} from 'react-router-dom';

class NavigationItem extends React.Component<any, {}> {
    render() {
        const { to, exact, strict, activeClassName, className, activeStyle, style, isActive: getIsActive, ...rest } = this.props;
        return (
            <Route
                path={typeof to === 'object' ? to.pathname : to}
                exact={exact}
                strict={strict}
                children={({ location, match }) => {
                    const isActive = !!(getIsActive ? getIsActive(match, location) : match)

                    return (
                        <li
                            className={isActive ? [activeClassName, className].join(' ') : className}
                            style={isActive ? { ...style, ...activeStyle } : style}>
                            <Link
                                to={to}
                                {...rest}
                            />
                        </li>
                    )
                }}
            />
        );
    }
}

export { NavigationItem };