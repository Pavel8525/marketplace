import React, {FC, useEffect} from 'react'
import debounce from 'lodash/debounce';
import { ComboBox, ComboBoxChangeEvent, ComboBoxFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import { IOwnProps } from 'app/common/components/lookups/contracts';
import { useFetching } from 'app/common/hooks/use-fetching';
import { DataProcessLookupConfig } from 'app/common/components';
import './styles.css'

const FILTER_DEBOUNCE_INTERVAL = 300;

export interface IProps extends IOwnProps {
    prefix?: string;
    dataProcessConfig: DataProcessLookupConfig;
}

const DataProcessLookup: FC<IProps> = (props) => {
    const [state, fetch] = useFetching(props.uniqueIdentifier, props.dataProcessConfig)

    useEffect(() => {
        fetch([])
    }, [])

    const debounceFetch = debounce((value: string) => fetch([{ [props.textField]: { contains: value } }]), FILTER_DEBOUNCE_INTERVAL)

    const onChange = async (event: ComboBoxChangeEvent) => {
        if (event.value) {
            props.onChange(event.value);
        }
    }

    const onFilter = async (event: ComboBoxFilterChangeEvent) => {
        debounceFetch(event.filter.value)
    }

    return (
        <div className="mb-3 position-relative field-wrapper">
            <ComboBox
                value={props.value}
                allowCustom
                dataItemKey={props.keyField}
                textField={props.textField}
                data={state.items}
                loading={state.fetching}
                onChange={onChange}
                onFilterChange={onFilter}
                filterable
            />
        </div>
    )
}

export { DataProcessLookup };
