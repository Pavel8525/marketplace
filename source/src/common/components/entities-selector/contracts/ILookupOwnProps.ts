import { ISelectorResult } from ".";
import { OperationChangeReference } from "./OperationChangeReference";

interface ILookupOwnProps {
    id: string;
    selectKind: 'single' | 'multiple';
    filters?: any[];
    operation?: OperationChangeReference;
    commandAddButtonTitle?: string;
    commandRemoveButtonTitle?: string;

    onSave: (result: ISelectorResult) => Promise<{}>;
    onSumbitSuccess?: (response: {}) => void;
    onClose?: () => void;
}

export {
    ILookupOwnProps
}
