import React, { Component } from 'react';
import i18n from 'app/common/core/translation/i18n';

interface IState {}
interface IProps {}

class DrawerHeader extends Component<IProps, IState> {
    render() {
        return (
            <p className="marketplace-list-drawer-header-title">
                {i18n.t('components:connected-marketplaces-list.drawer.headline')}
            </p>
        );
    }
}

export default DrawerHeader;
