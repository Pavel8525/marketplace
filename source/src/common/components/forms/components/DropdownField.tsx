import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import 'app/common/components/forms/styles/material-fields.css';

import { ISelectFieldProps, InfoIcon, Popover, ShowBox } from "app/common/components";
import { ValidationTouched } from '.';
import { ComboBox, ComboBoxChangeEvent } from '@progress/kendo-react-dropdowns';

const DropdownField = ({
    name,
    label,
    placeholder,
    classNameInput,
    classNameContainer = "col-6",
    required = false,
    validate,
    disabled,
    textField,
    keyField,
    options,
    description,
    onFocus
}: ISelectFieldProps) => {
    return (
        <div className={classNames(classNameContainer, "mb-3 position-relative")}>
            <Field
                name={name}
                type="text"
                component={renderDropDown}
                label={label}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                disabled={disabled}
                textField={textField}
                keyField={keyField}
                required={required}
                options={options}
                onFocus={onFocus}
                description={description}
            />
        </div>
    );
}

const renderDropDown = ({
    input,
    label,
    placeholder,
    meta,
    className,
    disabled,
    required,
    textField,
    keyField,
    description,
    options
}
    : React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ISelectFieldProps) => {

    const onChange = (event: ComboBoxChangeEvent) => {
        let value = event.target.value;
        if (value && typeof value[keyField] === "undefined") {
            value = null;
        }

        if (value) {
            value = value[keyField];
        }

        input.onChange(value);
    }

    const selectedValue = input.value != null
        ? options.find(o => (o as any)[keyField] === input.value)
        : null;

    return (
        <>
            <ComboBox
                style={{ width: '100%' }}
                placeholder={placeholder}
                label={label as string}
                className={classNames(className, 'material-form-control')}
                disabled={disabled}
                required={required}
                value={selectedValue}
                data={options || []}
                textField={textField}
                dataItemKey={keyField}
                allowCustom={false}
                
                onChange={onChange}

            />
            <ShowBox condition={description}>
                <Popover
                    wrapperStyle={{ top: '24px', right: '-24px' }}
                    wrapperClassName="position-absolute"
                    content={description}
                    useWrapper
                >
                    <InfoIcon />
                </Popover>
            </ShowBox>
            <ValidationTouched {...meta} />
        </>
    );
}

export { DropdownField };
