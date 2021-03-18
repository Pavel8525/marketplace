import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { ISelectFieldProps } from '../contracts/ISelectFieldProps';
import { ValidationTouched } from '.';
import { mapIfAny } from 'app/common/helpers/array-helper';

import { InfoIcon, Popover, ShowBox } from 'app/common/components';

const SelectField = (
    {
        name,
        label,
        placeholder,
        classNameInput = "custom-select",
        classNameContainer = "col-6",
        required = false,
        validate,
        options,
        disabled,
        description,

        onFocus
    }: ISelectFieldProps) => {

    return (
        <div className={classNames(classNameContainer, "mb-3 position-relative", description && 'mr-4')}>
            <label className="form-label" htmlFor={name}>
                {label}{required && (<>{" "}<span className="text-danger">*</span></>)}
            </label>

            <Field
                name={name}
                type="text"
                component={renderSelect}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                options={options}
                disabled={disabled}
                onFocus={onFocus}
                description={description}
            />
        </div>
    );
}

const renderSelect = ({ input, description, placeholder, meta, className, options, disabled }: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ISelectFieldProps) => {
    return (
        <>
            <select
                {...input}
                id={input.name}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
            >

                {mapIfAny(options, (option, key) => (<option key={key} value={option.value}>{option.name}</option>))}

            </select>
            <ShowBox condition={description}>
                <Popover
                    wrapperStyle={{ top: '30px', right: '-24px' }}
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

export { SelectField };
