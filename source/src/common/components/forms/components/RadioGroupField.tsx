import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { IRadioGroupFieldProps } from '../contracts';
import { ValidationTouched } from '.';
import { mapIfAny, any } from 'app/common/helpers/array-helper';

interface RadioGroupWrappedFieldProps extends WrappedFieldProps {
    last: boolean;
    label: string;
}

const RadioGroupField = (
    {
        name,
        label,
        classNameInput = "custom-control-input",
        classNameContainer,
        validate,
        disabled,
        items,
        required,

        onFocus
    }: IRadioGroupFieldProps) => {

    if (!any(items)) {
        return null;
    }
    const showLabel = label != "";

    return (
        <>
            {showLabel && (
                <label className="form-label" htmlFor={name}>
                    {label}{required && (<>{" "}<span className="text-danger">*</span></>)}
                </label>
            )}
            
            {mapIfAny(items, (item, key) =>
                <div key={key} className={classNames("custom-control custom-radio", classNameContainer)}>
                    <Field
                        name={name}
                        type="radio"
                        id={item.value + "_radio_input"}
                        component={renderRadioGroupInput}
                        className={classNameInput}
                        value={item.value}
                        validate={validate}
                        disabled={disabled}
                        onFocus={onFocus}
                        last={items[items.length - 1] == item}
                        label={item.label}
                    />
                </div>
            )}
        </>
    );
}

const renderRadioGroupInput = ({ input, type, placeholder, className, disabled, id, last, meta, label }
    : React.InputHTMLAttributes<HTMLInputElement> & RadioGroupWrappedFieldProps) => (
        <>
            <input
                {...input}
                type={type}
                id={id}
                value={input.value}
                className={className}
                placeholder={placeholder}
                disabled={disabled}
            />
            <label className="custom-control-label" htmlFor={input.value + "_radio_input"}>
                {label}
            </label>

            {last && <ValidationTouched {...meta} />}
        </>
    );

export { RadioGroupField };