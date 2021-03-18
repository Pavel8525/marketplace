import { ComboBoxProps, ListItemProps } from "@progress/kendo-react-dropdowns";

export interface IOwnProps extends ComboBoxProps {
    keyField: string;
    textField: string;
    placeholder: string;
    count?: number;
    initFilter?: any;
    selectFields?: string[];
    uniqueIdentifier?: string;
    typeIdString?: boolean;
    fetchOnLoad?: boolean;

    onChange?: (data: any) => void;
    itemRender?: (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => React.ReactNode;
}
