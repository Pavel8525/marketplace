import { IPaginationState } from "app/common/core/data";

export interface IStateProps<T> {
    request: any;
    columns: React.ReactNode[];
    relatedEntityName: string;
    navigationProperty: string;
    items: IPaginationState<T, {}>;
}
