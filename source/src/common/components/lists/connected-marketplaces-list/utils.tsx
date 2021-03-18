import React from 'react';
import i18n from 'i18next';
import {FieldType, FormColumnLayout, IField, IFormRow, LookupEntityType, RequiredField} from 'app/common/components';
import {ListItemProps} from '@progress/kendo-react-dropdowns';

export const ADD_MARKETPLACE_ITEM = 'ADD_MARKETPLACE_ITEM';

const renderMarketplaceAccountItem = (item: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => {
    const itemChildren = <span>{i18n.t(`enums:MarketPlaceKind.${itemProps.dataItem.MarketplaceKind}`)} / {itemProps.dataItem.Name}</span>;
    return React.cloneElement(item, item.props, itemChildren);
};

export const fieldNames = {
    marketplace: 'Marketplace',
    marketplaceAccount: 'MarketplaceAccount'
}

export const getFormRows = (SelectedMarketplaceKind?: string): IFormRow[] => [
        {
            fields: [
                {
                    name: fieldNames.marketplace,
                    label: i18n.t('components:connected-marketplaces-list.drawer.form.choose-marketplace'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.marketplace,
                    textField: 'Name',
                    keyField: 'Id',
                    required: true,
                    fetchOnLoad: true,
                    validate: [RequiredField],
                    initFilter: { NewProductRegistrationAvailable: true },
                    selectFields: ['Name', 'MarketPlaceKind'],
                } as IField,
                {
                    name: fieldNames.marketplaceAccount,
                    label: i18n.t('components:connected-marketplaces-list.drawer.form.choose-marketplace-account'),
                    type: FieldType.reference,
                    entityType: LookupEntityType.connectedMarketplace,
                    textField: 'Name',
                    keyField: 'Id',
                    required: false,
                    initFilter: { MarketplaceKind: SelectedMarketplaceKind, Active: true },
                    selectFields: ['MarketplaceKind'],
                    itemRender: renderMarketplaceAccountItem
                } as IField,
            ],
            columntLayout: FormColumnLayout.solo
        },
    ];
