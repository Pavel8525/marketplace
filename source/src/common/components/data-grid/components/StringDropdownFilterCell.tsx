import { IDropDownItem } from '../contracts';
import { DropdownFilterCell } from './DropdownFilterCell';

const DefaultDropDownItem: IDropDownItem<string> = { text: "Nothing", value: "Nothing" };

class StringDropdownFilterCell extends DropdownFilterCell<string>{ }

export { StringDropdownFilterCell, DefaultDropDownItem };