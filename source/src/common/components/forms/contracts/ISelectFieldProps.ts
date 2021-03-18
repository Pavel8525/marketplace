import { ListItemProps } from "@progress/kendo-react-dropdowns";
import { IFieldProps, ISelectOption } from ".";

export interface ISelectFieldProps extends IFieldProps {
    options: ISelectOption[];
    selected?: ISelectOption;
    textField?: string;
    keyField?: string;
    
    itemRender?: (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => React.ReactNode;
}