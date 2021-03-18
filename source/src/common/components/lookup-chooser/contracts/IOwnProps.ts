import { OperationChangeReference } from "./OperationChangeReference";

interface IOwnProps {
    id: string;
    entityId: string;
    entityName: string;
    selectKind: 'single' | 'multiple';
    operation: OperationChangeReference;
    requestKind?: string;
    commandAddButtonTitle?: string;
    commandRemoveButtonTitle?: string;
    onClose: () => void;
    onSave?: (selectedItems: {}[]) => void;
    onSuccess?: () => void;
};

export {
    IOwnProps
}