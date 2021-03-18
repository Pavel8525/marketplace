import { Action } from "redux";
import { Reset } from "../contracts";

interface IAction<TData> extends Action {
    payload: TData;
}

export type Update<TObject> = (object: TObject) => void;

export interface IObjectOperation<TObject> {
    objectReducer: (state: TObject, action: Action) => TObject;
    updateAction: Update<TObject>;
    resetAction: Reset;
    types: {
        RESET: string;
        UPDATE: string;
    };
}

export const objectReducerFactory = <TObject extends {}>(initialState: TObject, updateType: string): IObjectOperation<TObject> => {
    const resetType = `${updateType}_RESET`;
    const objectReducer = (state = initialState, action: Action = { type: null }) => {
        switch (action.type) {
            case updateType:
                return (action as IAction<TObject>).payload;
            case resetType:
                return initialState;
            default:
                return state;
        }
    };

    const updateAction = (object: TObject) => ({
        type: updateType,
        payload: object
    });

    const resetAction = () => ({
        type: resetType
    });

    return {
        objectReducer,
        updateAction,
        resetAction,
        types: {
            RESET: resetType,
            UPDATE: updateType
        }
    };
};
