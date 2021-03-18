import * as React from 'react';
import i18n from 'i18next';

import { Bantikom } from 'app/common/core/api/proxy';
import { Panel, FetchWithLoader } from 'app/common/components';

import { SitingForm } from '../containers/SitingForm';
import { CommonOptionsForm } from '../containers/CommonOptionsForm';
import { IFetchState, Fetch, Clear } from 'app/common/core/data';
import { ISingleODataResponse } from 'app/common/core/api/contracts/odata-response';

interface IStateProps {
    itemState: IFetchState<ISingleODataResponse<Bantikom.Product>>;
}

interface IDispatchProps {
    fetchProductItem: Fetch<{}>;
    clear: Clear;
}

interface IOwnProps {
    itemId: string;
}

interface IState {
    CreationStatus: Bantikom.ProductCreationStatus;
    item?: Bantikom.Product;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

class CreationWizard extends React.Component<IProps, IState> {
    private request: {} = {
        expand: {
            Category: {
                select: ['Name', 'Id', 'Code', 'MarketPlaceKind'],
            },
            Brand: {
                select: ['Name', 'Id']
            }
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        return {
            ...state,
            item: props.itemState.data && props.itemState.data.item,
            CreationStatus: ((state.CreationStatus === null || state.CreationStatus === 'Done') && props.itemState.data && props.itemState.data.item.CreationStatus) || state.CreationStatus
        }
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
            CreationStatus: null
        }
    }

    public render() {
        const { itemState } = this.props;
        const { item } = this.state;

        return (
            <FetchWithLoader fetchState={itemState}>
                {item && this.renderContent()}
            </FetchWithLoader>
        )
    }

    private renderContent = () => {
        const { item, CreationStatus } = this.state;
        switch (CreationStatus) {
            case "CommonOptions": {
                return (
                    <Panel
                        uniqueIdentifier="creation-wizard-panel-step-1"
                        showHeader={true}
                        canCollapse={false}
                        canMaximize={false}
                        title={i18n.t(`product:creation-wizard.steps.step-1`)}
                    >
                        <CommonOptionsForm
                            item={item}
                            request={this.request}
                            goToStep={this.goToStep}
                        />
                    </Panel>
                );
            }
            case "Siting": {
                return (
                    <Panel
                        uniqueIdentifier="creation-wizard-panel-step-2"
                        showHeader={true}
                        canCollapse={false}
                        canMaximize={false}
                        title={i18n.t(`product:creation-wizard.steps.step-2`)}
                    >
                        <SitingForm
                            item={item}
                            goToStep={this.goToStep}
                        />
                    </Panel>
                );
            }
            default: return (
                <h1>{CreationStatus} not implemented</h1>
            );
        }
    }

    public componentDidMount() {
        this.fetchItem();
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private fetchItem() {
        this.props.fetchProductItem({ key: this.props.itemId, ...this.request });
    }

    private goToStep = (creationStatus: Bantikom.ProductCreationStatus) => {
        this.setState(() => ({
            CreationStatus: creationStatus
        }));
    }
}

export {
    IStateProps,
    IDispatchProps,
    CreationWizard
};