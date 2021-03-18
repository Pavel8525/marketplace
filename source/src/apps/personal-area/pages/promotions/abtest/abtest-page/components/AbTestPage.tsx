import * as React from 'react';
import i18n from 'i18next';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

import { PageHeader } from 'app/common/layouts/page/components';
import { IEnvironmentSettings } from 'app/common/contracts';
import { IFetchState, Fetch, Clear } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';
import { Panel, FetchWithLoader } from 'app/common/components';
import { AbTest } from 'app/common/core/api/proxy-ext';
import { DesignedForm } from '../containers/DesignedForm';

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
    itemState: IFetchState<ISingleODataResponse<AbTest>>;
}

interface IDispatchProps {
    fetchItem: Fetch<{}>;
    clear: Clear;
}

interface IState {
    itemId: string;
    item?: AbTest;
}

type IProps = IStateProps & IDispatchProps & WithTranslation & RouteComponentProps;

class AbTestPage extends React.Component<IProps, IState> {
    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        let item: AbTest = state.item;
        if (!item && props.itemState.data && props.itemState.data.item) {
            item = props.itemState.data.item;
        }

        return {
            ...state,
            item
        }
    }

    constructor(props: IProps) {
        super(props);

        const itemId = (this.props.match.params as any).abtestId;

        this.state = {
            itemId: itemId
        };
    }

    public render() {
        const { itemState } = this.props;
        const { item } = this.state;

        const renderContent = () => {
            if (!item) {
                return (
                    <FetchWithLoader fetchState={itemState} />
                );
            }

            switch (item.State) {
                case 'Designed': {
                    return (
                        <FetchWithLoader fetchState={itemState}>
                            <DesignedForm item={item} />
                        </FetchWithLoader>
                    );
                }
                default: {
                    return (
                        <FetchWithLoader fetchState={itemState}>
                            <h1>Other state</h1>
                        </FetchWithLoader>
                    );
                }
            }
        };

        return (
            <>
                {renderContent()}
            </>
        )
    }

    public componentDidMount() {
        this.fetchItem();
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private fetchItem() {
        const { itemId } = this.state;

        const expand = { Variations: { select: ['Id', 'Name', 'Order', 'Subject'], orderBy: 'Order' } };

        this.props.fetchItem({
            key: itemId,
            expand
        });
    }
}

export { IDispatchProps, IStateProps, AbTestPage };