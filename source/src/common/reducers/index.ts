import { combineReducers, Action } from 'redux';
import { reducer as form } from 'redux-form'
import { ThunkAction } from 'redux-thunk'

import { environmentSettings } from './environment';
import { getODataServiceReducers } from 'app/common/core/api/proxy-ext';

export const createModuleReducers = (asyncReducers?: any) => {
    return {
        odataService: getODataServiceReducers(asyncReducers),
        environmentSettings,
        form
    }
};


const moduleReducers = combineReducers(createModuleReducers());
export type RootStore = ReturnType<typeof moduleReducers>
export type AppThunk = ThunkAction<void, RootStore, unknown, Action<string>>
