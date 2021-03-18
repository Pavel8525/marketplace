import { LookupEntityType } from "../../autoforms";

export interface IFieldProps {
    name: string;
    label: string | React.ReactElement;
    placeholder?: string;
    classNameContainer?: string;
    classNameInput?: string;
    required?: boolean;
    validate?: any[];
    disabled?: boolean;
    entityType?: LookupEntityType;
    description?: string;
    valueName?: string;

    onFocus?: (e: any) => void;
}

