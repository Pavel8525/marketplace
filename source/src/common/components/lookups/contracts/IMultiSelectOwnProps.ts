import { MultiSelectProps } from "@progress/kendo-react-dropdowns";

export interface IMultiSelectOwnProps extends MultiSelectProps {
    keyField: string;
    textField: string;
    placeholder: string;
    count?: number;
    initFilter?: any;
    uniqueIdentifier?: string;
    typeIdString?: boolean;
    fetchOnLoad?: boolean;
    onChange?: (data: any) => void;
}
