import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { Switch, SwitchChangeEvent } from '@progress/kendo-react-inputs';

import 'app/common/components/forms/styles/material-fields.css';

import { ValidationTouched } from '.';
import { IOverrideFieldProps } from '..';

const SwitchField = (
    {
        name,
        label,
        classNameInput = "form-control",
        classNameContainer = "col-6",
        required = false,
        validate,
        disabled,
        clearContainerClass,
        fieldContainerClassName,

        onFocus
    }: IOverrideFieldProps) => {

    const containerClassName = clearContainerClass ? "" : classNames(classNameContainer, "mb-3");

    return (
        <div className={containerClassName}>
            {label && (
                <label className="k-label" htmlFor={name}>
                    {label}{required && (<>{" "}<span className="text-danger">*</span></>)}
                </label>
            )}

            <Field
                component={renderSwitch}
                className={classNameInput}
                fieldContainerClassName={fieldContainerClassName}
                validate={validate}
                disabled={disabled}
                required={required}
                name={name}

                onFocus={onFocus}
            />
        </div>
    );
}

const renderSwitch = ({
    input,
    meta,
    className,
    disabled,
    fieldContainerClassName
}: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & IOverrideFieldProps) => {
    
    const onChange = (event: SwitchChangeEvent) => input.onChange(event.target.value);
    
    return (
        <>
            <div style={{ width: 50, float: "right" }} className={fieldContainerClassName}>
                <Switch
                    {...input}
                    checked={Boolean(input.value)}
                    className={classNames(fieldContainerClassName, 'material-form-control')}
                    disabled={disabled}
                    onChange={onChange}
                />

            </div>
            <ValidationTouched {...meta} />
        </>
    );
}

export { SwitchField };