import React, { Component } from 'react';
import './MarketplaceItem.css';

interface IProps {
    onDelete(): void;
    marketplaceKind: string;
    marketplaceAccount: string;
}

class MarketplaceItem extends Component<IProps, any> {
    render() {
        const { marketplaceKind, marketplaceAccount, onDelete } = this.props
        return (
            <div className="marketplace-item">
                <p className="m-0 marketplace-item-info justify-content-start">{marketplaceKind}</p>
                <p className="m-0 marketplace-item-info">{marketplaceAccount || '-'}</p>
                <span className="marketplace-item-info justify-content-end"><i className="fal fa-trash" onClick={onDelete} /></span>
            </div>
        );
    }
}

export default MarketplaceItem;
