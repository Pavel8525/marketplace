import { Bantikom } from "app/common/core/api/proxy";
import { Clear, GetNextPage, InvokeSpecificUrl } from "app/common/core/data";

export interface IDispatchProps {
    fetchItems: GetNextPage<{}>;
    clear: Clear;
    changeRefs?: InvokeSpecificUrl<{ request: Bantikom.ChangeEntityReferenceListRequest }, {}>;
}
