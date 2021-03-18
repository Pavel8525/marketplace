import *  as React from 'react';
import { debounce } from 'underscore';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import {
    MultiSelect,
    MultiSelectChangeEvent,
    MultiSelectFilterChangeEvent
} from '@progress/kendo-react-dropdowns';

import {
    IDispatchProps,
    IStateProps,
    IMultiSelectOwnProps,
    LOOKUP_FILTER_DEBOUNCE_INTERVAL,
    LOOKUP_MAX_COUNT_ITEMS
} from '../contracts';
import { getLookupRequest } from '../helpers/lookup-helpers';

interface IState {
    request: any;
    stateFilter?: CompositeFilterDescriptor;
}

type IProps = IMultiSelectOwnProps & IStateProps & IDispatchProps;

class MultiSelectLookup extends React.Component<IProps, IState> {
    private filterDebounce: () => void;
    constructor(props: IProps) {
        super(props);

        this.state = {
            request: getLookupRequest(null, this.props.initFilter)
        };

        this.filterDebounce = debounce(() => this.fetchItems(), LOOKUP_FILTER_DEBOUNCE_INTERVAL);
    }

    public render() {
        const { itemsState, textField, keyField, placeholder, label, value } = this.props;
        const { items, fetching } = itemsState;

        return (
            <>
                <MultiSelect
                    {...this.props}
                    label={label}
                    placeholder={placeholder}
                    data={items || []}
                    value={value || []}
                    loading={fetching}
                    textField={textField}
                    dataItemKey={keyField}
                    allowCustom={false}
                    filterable={true}
                    onOpen={this.onOpen}
                    onChange={this.onChange}
                    onFilterChange={this.onFilter}
                />
            </>
        );
    }

    public componentDidMount() {
        if (this.props.fetchOnLoad) {
            this.fetchItems();
        }
    }

    public componentWillUnmount() {
        this.props.clear();
    }

    private onOpen = () => {
        this.fetchItems();
    }

    private onChange = (event: MultiSelectChangeEvent) => {
        let value = event.target.value;

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    private onFilter = (event: MultiSelectFilterChangeEvent) => {
        let filter: any = null;
        if (event.filter.value !== "") {
            filter = {};
            filter[event.filter.field as string] = { contains: event.filter.value };
        }

        const request = getLookupRequest(filter, this.props.initFilter) as any;

        this.setState(() => ({
            request
        }));

        this.filterDebounce();
    }

    private fetchItems() {
        this.props.fetchItems(this.state.request, 0, this.props.count || LOOKUP_MAX_COUNT_ITEMS);
    }
}

export { MultiSelectLookup };
