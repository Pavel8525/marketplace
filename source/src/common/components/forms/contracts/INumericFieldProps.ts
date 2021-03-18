import { IFieldProps } from ".";

export interface INumericFieldProps extends IFieldProps {
    min?: number;
    max?: number;
    formatNumber?: string;
    step?: number;
    defaultValue?: string | string[] | number;
}