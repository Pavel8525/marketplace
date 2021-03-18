import { IUpdatedOptions } from "./IUpdatedOptions";

export interface IInfiniteBaseProps<TItem, TFilter> {
    className?: string;
    tagName?: string;

    fetching: boolean;
    filter: TFilter;
    pageNo: number;
    pageSize: number;
    items: TItem[];
    count: number;

    itemViewProps?: {};
    ItemView: any;
    onUpdated?(options: IUpdatedOptions): void;
    getNextPage(filter: TFilter, pageNo: number, pageSize: number): void;
    getScrollContainer?(): JQuery<Element | Text | Window>;
}
