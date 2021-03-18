import { IDropDownItem } from '../contracts';
import { DropdownFilterCell } from './DropdownFilterCell';

const DefaultDropDownItem: IDropDownItem<number> = { text: "Nothing", value: 0 };

class NumberDropdownFilterCell extends DropdownFilterCell<number> { }

export { NumberDropdownFilterCell, DefaultDropDownItem };