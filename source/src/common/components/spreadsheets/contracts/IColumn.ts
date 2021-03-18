export interface IColumnInfo {
    title: string;
    comment?: string;
    required?: boolean;
    enabled?: boolean;
}

export type IColumn = IColumnInfo | string;