import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { ICheckboxFieldProps } from '../contracts/ICheckboxFieldProps';
import { ValidationTouched } from '.';

const CheckboxField = (
    {
        name,
        label,
        classNameInput = "custom-control-input",
        classNameContainer,
        required = false,
        validate,
        disabled,

        onFocus
    }: ICheckboxFieldProps) => {

    return (
        <div className={classNames("custom-control custom-checkbox", classNameContainer)}>
            <Field
                name={name}
                type="checkbox"
                component={renderCheckboxInput}
                className={classNameInput}
                validate={validate}
                disabled={disabled}

                onFocus={onFocus}
            />
            <label className="custom-control-label" htmlFor={name}>
                {label}{required && (<>{" "}<span className="text-danger">*</span></>)}
            </label>
        </div>
    );
}

const renderCheckboxInput = ({ input, type, placeholder, meta, className, disabled }: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps) => (
    <>
        <input
            {...input}
            type={type}
            id={input.name}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
        />
        <ValidationTouched {...meta} />
    </>
);

export { CheckboxField };