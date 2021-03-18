import * as React from 'react';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { any } from 'app/common/helpers/array-helper';

import { IDropDownItem, IChangeEventParams } from '../contracts';

const getDropDownItemValue = function <TDropDownItemValue>(
    fieldName: string,
    filters: Array<FilterDescriptor | CompositeFilterDescriptor>,
    dropDownItems: Array<IDropDownItem<TDropDownItemValue>>,
    defaultValue?: IDropDownItem<TDropDownItemValue>) {

    if (any(filters)) {
        const filter = filters.find(filter => (filter as FilterDescriptor).field === fieldName) as FilterDescriptor;
        if (filter) {
            const item = dropDownItems.find(dropDownItem => dropDownItem.value === filter.value);
            return item || defaultValue;
        }
    }

    return defaultValue;
}

interface IProps<TValue> {
    data: IDropDownItem<TValue>[];
    selected?: IDropDownItem<TValue>;
    defaultValue?: IDropDownItem<TValue>;
    onChange: (e: IChangeEventParams<TValue>) => void;
}

class DropdownFilterCell<TValue> extends React.PureComponent<IProps<TValue>> {

    public render() {
        const { data, selected, defaultValue } = this.props;
        return (
            <div className="k-filtercell">
                <DropDownList
                    data={data}
                    textField="text"
                    dataItemKey="value"
                    onChange={this.onChange}
                    value={selected || defaultValue}
                    defaultItem={defaultValue}
                />
                <button
                    className="k-button k-button-icon k-clear-button-visible"
                    title="Clear"
                    disabled={!selected || selected === defaultValue}
                    onClick={this.onClearButtonClick}
                >
                    <span className="k-icon k-i-filter-clear" />
                </button>
            </div>
        );
    }

    private onChange = (event: DropDownListChangeEvent) => {
        const selected = event.target.value as IDropDownItem<TValue>;
        const hasValue = selected !== this.props.defaultValue;
        this.props.onChange({
            value: hasValue ? selected : null,
            operator: hasValue ? 'eq' : '',
            syntheticEvent: event.syntheticEvent
        });
    }

    private onClearButtonClick = () => {
        this.props.onChange({
            value: null,
            operator: '',
            syntheticEvent: event
        });
    }
}

export { DropdownFilterCell, getDropDownItemValue };
