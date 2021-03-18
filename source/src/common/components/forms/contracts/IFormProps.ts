import { InjectedFormProps } from "redux-form";

export interface IFormProps<TData, TProps> extends InjectedFormProps<TData, TProps>{
    submit(): void;
}