import { IFieldProps } from ".";

export interface ITextFieldProps extends IFieldProps {
    renderInputType?: 'text' | 'textarea';
    mask?: string;
    isPassword?: boolean;
}