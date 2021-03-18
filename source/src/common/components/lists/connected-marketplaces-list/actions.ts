import {CHANGE_REDUX_FORM } from './types';
import {ADD_MARKETPLACE_ITEM, fieldNames} from './utils';

export const cleanMarketplaceAccount = () => ({
    type: CHANGE_REDUX_FORM,
    meta: {
        form: ADD_MARKETPLACE_ITEM,
        field: fieldNames.marketplaceAccount
    },
});

export const setMarketplace = (marketplace: any) => ({
    type: CHANGE_REDUX_FORM,
    meta: {
        form: ADD_MARKETPLACE_ITEM,
        field: fieldNames.marketplace
    },
    payload: marketplace,
})
