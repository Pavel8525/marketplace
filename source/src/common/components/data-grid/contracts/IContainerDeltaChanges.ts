export interface IDeltaChangeItem {
    entityName?: string;
    entityId: string;
    fieldName: string;
    originValue: any;
    changedValue: any;
}

export interface IContainerDeltaChanges {
    IsDirty: boolean;
    Changes: IDeltaChangeItem[];
    OriginItems: any[];
}