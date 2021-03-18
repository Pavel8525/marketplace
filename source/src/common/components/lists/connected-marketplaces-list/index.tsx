import React, { Component } from 'react';
import * as toastr from 'toastr';
import find from 'lodash/find';
import pipe from 'lodash/fp/pipe';
import get from 'lodash/fp/get';
import defaultTo from 'lodash/fp/defaultTo';
import classNames from 'classnames';
import i18n from 'app/common/core/translation/i18n';
import MarketplaceItem from './components/MarketplaceItem';
import DrawerHeader from './components/DrawerHeader';
import DrawerMain from './components/DrawerMain';
import { Button, Drawer, BooleanProvider } from 'app/common/components';
import { NewMarketplace } from './entities';
import { Bantikom } from 'app/common/core/api/proxy';
import './index.css';


interface Marketplace extends Partial<Bantikom.MarketPlace> {
    ConnectedMarketplaceId?: Bantikom.ConnectedMarketplace['Id'];
    ConnectedMarketplace?: Bantikom.ConnectedMarketplace['Name'];
}

interface IState {
    marketplacesList: Marketplace[];
    isDrawerOpen: boolean;
}

interface IProps {
    marketplacesList: Marketplace[];
}

class ConnectedMarketplacesList extends Component<IProps, IState> {
    state = {
        isDrawerOpen: false,
        marketplacesList: pipe(
            get(['props', 'location', 'state']),
            defaultTo([])
        )(this) as Marketplace[],
    }

    onDeleteItem = (id: string) => () => {
        this.setState(state => ({
            marketplacesList: state.marketplacesList.filter(it => it.Id !== id)
        }))
    }

    renderItem = (item: Marketplace) => (
        <MarketplaceItem
            marketplaceKind={item.MarketPlaceKind}
            marketplaceAccount={item.ConnectedMarketplace}
            onDelete={this.onDeleteItem(item.Id)}
            key={`${item.Id}-${item.ConnectedMarketplaceId}`}
        />
    )

    onOpenDrawer = () => {
        this.setState({ isDrawerOpen: true })
    }

    onCloseDrawer = () => {
        this.setState({ isDrawerOpen: false })
    }

    onAddMarketplace = (newMarketplace: NewMarketplace) => {
        const { marketplacesList } = this.state;

        const transformedMarketplace = {
            Id: newMarketplace.Marketplace.Id,
            ConnectedMarketplaceId: get(['MarketplaceAccount', 'Id'])(newMarketplace),
            ConnectedMarketplace: get(['MarketplaceAccount', 'Name'])(newMarketplace),
            MarketPlaceKind: newMarketplace.Marketplace.Name
        } as Marketplace

        const alreadyExists = find(marketplacesList, {
            ConnectedMarketplaceId: transformedMarketplace.ConnectedMarketplaceId,
            Id: transformedMarketplace.Id
        })

        if (!alreadyExists) {
            this.setState({ marketplacesList: [...marketplacesList, transformedMarketplace] }, this.onCloseDrawer)
        } else {
            toastr.error(i18n.t('components:connected-marketplaces-list.marketplace-already-exists'))
        }
    }

    render() {
        const { isDrawerOpen, marketplacesList } = this.state;
        return (
            <div className="marketplace-list-container">
                <BooleanProvider condition={marketplacesList.length}>
                    <BooleanProvider.Truthy>
                        <div className={classNames('marketplace-list', !marketplacesList.length && 'empty')}>
                            {marketplacesList.map(this.renderItem)}
                        </div>
                    </BooleanProvider.Truthy>
                    <BooleanProvider.Falsy>
                        <p>{i18n.t('components:connected-marketplaces-list.empty-list')}</p>
                    </BooleanProvider.Falsy>
                </BooleanProvider>

                <Button
                    name={i18n.t('components:connected-marketplaces-list.add')}
                    buttonOnClick={this.onOpenDrawer}
                    dontSubmitButton={true}
                />
                <Drawer
                    headerComponent={<DrawerHeader />}
                    mainComponent={<DrawerMain onAddMarketplace={this.onAddMarketplace} />}
                    onClose={this.onCloseDrawer}
                    isOpen={isDrawerOpen}
                />
            </div>
        )
    }
}

export {
    Marketplace,
    ConnectedMarketplacesList
}
