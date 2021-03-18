import { AnyAction } from 'redux';

export const makeReducer = (actionHandler: any) => <State>(state: State, action: AnyAction) => {
    const handler = actionHandler[action.type];
    return handler ? handler(state, action) : state
}

export interface Types {
    fetching: string;
    success: string;
    failure: string;
}

export const makeTypes = (type: string): Types => ({
    fetching: `${type}/FETCHING`,
    success: `${type}/SUCCESS`,
    failure: `${type}/FAILURE`,
});
