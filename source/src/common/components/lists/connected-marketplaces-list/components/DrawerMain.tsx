import React, { Component } from 'react';
import i18n from 'i18next';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { autoformFactory, FormState } from 'app/common/components';
import { getFormRows, ADD_MARKETPLACE_ITEM } from '../utils'
import { NewMarketplace } from '../entities'
import connect from './drawerConnect';

interface IState extends Partial<NewMarketplace> {
}

interface IProps {
    onAddMarketplace(marketplace: NewMarketplace): void;

    cleanMarketplaceAccount(): void;

    assignMarketplaceKind(): void;
}

class DrawerMain extends Component<IProps, IState> {
    state = {}

    form = autoformFactory({ formName: ADD_MARKETPLACE_ITEM }).getForm()

    onAddMarketplace = (form: NewMarketplace) => {
        this.props.onAddMarketplace(form);
    }

    cleanMarketplaceAccountIfNecessary = (prevState: Readonly<IState>) => {
        const marketplace = get(this.state, ['Marketplace']);
        const prevMarketplace = get(prevState, ['Marketplace']);
        const marketplaceWasUpdated = !isEqual(marketplace, prevMarketplace);
        if (marketplaceWasUpdated && !isEmpty(prevMarketplace)) {
            this.props.cleanMarketplaceAccount()
        }
    }

    assignMarketplaceKindIfNecessary = () => {
        const marketplace = get(this.state, ['Marketplace']);
        const account = get(this.state, ['MarketplaceAccount']);
        if (account && isEmpty(marketplace)) {
            this.props.assignMarketplaceKind();
        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>) {
        this.cleanMarketplaceAccountIfNecessary(prevState);
        this.assignMarketplaceKindIfNecessary();
    }

    onChangeValue = (value: IState) => {
        this.setState(value)
    }

    render() {
        const selectedMarketPlaceKind = get(this.state, ['Marketplace', 'MarketPlaceKind'])

        return (
            <div className="marketplace-list-container-form">
                <this.form
                    formState={FormState.nothing}
                    rows={getFormRows(selectedMarketPlaceKind)}
                    onSubmit={this.onAddMarketplace}
                    onChange={this.onChangeValue}
                    submitTitle={i18n.t('components:connected-marketplaces-list.drawer.form.submit-title')}
                />
            </div>
        );
    }
}

export default connect(DrawerMain);
