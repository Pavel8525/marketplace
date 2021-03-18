import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IEnvironmentSettings } from 'app/common/contracts';
import { IStoreState } from 'app/common/core';

interface IDispatchProps {
}

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

interface IState {
    agentType: string;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class CommingSoonPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            agentType: (this.props.match.params as any).agentType
        };
    }

    public render() {
        return (
            <>
                <h1>Comming soon!</h1>
                <h2>{this.state.agentType}</h2>
            </>
        );
    }

}


const CommingSoonPageWithTranslation = withTranslation()(CommingSoonPage);

const CommingSoonPageConnected = withRouter(connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(CommingSoonPageWithTranslation));

export { CommingSoonPageConnected as CommingSoonPage };