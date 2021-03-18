import { OperationChangeReference } from ".";

export interface ISelectorResult {
    items: {}[];
    relatedEntityName?: string;
    navigationProperty?: string;
    operation?: OperationChangeReference;
    tag?: any;
}