import { IDropDownItem } from './IDropDownItem';

export interface IChangeEventParams<TValue> {
    value: IDropDownItem<TValue>;
    operator: string;
    syntheticEvent: any;
}
