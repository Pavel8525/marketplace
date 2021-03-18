import { IFieldProps } from "./IFieldProps";

export interface IOverrideFieldProps extends IFieldProps {
    clearContainerClass?: boolean;
    fieldContainerClassName?: string;
}