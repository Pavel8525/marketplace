import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { IRadioFieldProps } from '../contracts';
import { ValidationTouched } from '.';

const RadioField = (
    {
        name,
        label,
        classNameInput = "custom-control-input",
        classNameContainer,
        validate,
        disabled,
        value,

        onFocus
    }: IRadioFieldProps) => {
    return (
        <div className={classNames("custom-control custom-radio", classNameContainer)}>
            <Field
                name={name}
                type="radio"
                id={value + "_radio_input"}
                component={renderRadioGroupInput}
                className={classNameInput}
                value={value}
                validate={validate}
                disabled={disabled}

                onFocus={onFocus}
            />
            <label className="custom-control-label" htmlFor={value + "_radio_input"}>
                {label}
            </label>
        </div>
    );
}

const renderRadioGroupInput = ({ input, type, placeholder, meta, className, disabled, id }: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps) => (
    <>
        <input
            {...input}
            type={type}
            value={input.value}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
            id={id}
        />
        <ValidationTouched {...meta} />
    </>
);

export { RadioField };