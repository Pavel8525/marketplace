import get from 'lodash/get';
import pipe from 'lodash/fp/pipe';
import fpGet from 'lodash/fp/get';
import find from 'lodash/fp/find';
import defaultTo from 'lodash/fp/defaultTo';
import {AppThunk} from 'app/common/reducers';
import {ADD_MARKETPLACE_ITEM} from './utils';
import * as actions from './actions';

export const cleanMarketplaceAccount = (): AppThunk => dispatch => {
    dispatch(actions.cleanMarketplaceAccount())
}

export const assignMarketplaceKind = (): AppThunk => (dispatch, getState) => {
    const state = getState()
    const marketplaceKind = get(state, ['form', ADD_MARKETPLACE_ITEM, 'values', 'MarketplaceAccount', 'MarketplaceKind'])
    const marketplace = pipe(
        fpGet(['odataService', 'MarketPlacePage', 'items']),
        defaultTo([]),
        find(['MarketPlaceKind', marketplaceKind])
    )(state)

    dispatch(actions.setMarketplace(marketplace))
}
