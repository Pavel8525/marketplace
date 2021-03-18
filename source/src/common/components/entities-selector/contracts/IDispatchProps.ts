import { Clear, GetNextPage } from "app/common/core/data";

export interface IDispatchProps {
    fetchItems: GetNextPage<{}>;
    clear: Clear;
}
