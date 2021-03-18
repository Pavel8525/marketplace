import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { IEnvironmentSettings } from 'app/common/contracts';

interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class UserOrderPage extends React.Component<IProps> {
    public render() {
        return (
            <>
                <h1>Not implemented</h1>
            </>
        );
    }
}

export {
    IStateProps,
    IDispatchProps,
    UserOrderPage
};
