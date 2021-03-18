import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { Input } from '@progress/kendo-react-inputs';

import 'app/common/components/forms/styles/material-fields.css';

import { ITextFieldProps } from '../contracts/ITextFieldProps';
import { ValidationTouched } from '.';

import { InfoIcon, Popover, ShowBox } from "app/common/components";

const MaterialTextField = (
    {
        name,
        label,
        placeholder,
        classNameInput = "form-control",
        classNameContainer = "col-6",
        required = false,
        validate,
        renderInputType = 'text',
        disabled,
        description,
        isPassword,
        
        onFocus
    }: ITextFieldProps) => {

    const renderInput = renderInputType === 'text' ? renderMaterialTextInput : renderTextAreaInput;
    return (
        <div className={classNames(classNameContainer, "mb-3", description && 'mr-4')}>
            <Field
                name={name}
                type={isPassword ? 'password' : 'text'}
                component={renderInput}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                disabled={disabled}
                description={description}
                label={label}
                required={required}

                onFocus={onFocus}
            />
        </div>
    );
}

const renderTextAreaInput = ({ input, placeholder, meta, className, disabled }: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps) => (
    <>
        <h1>TEXTAREA NOT IMPLEMENTED</h1>
        <ValidationTouched {...meta} />
    </>
);

const renderMaterialTextInput = ({
    input,
    type,
    placeholder,
    meta,
    className,
    disabled,
    label,
    required,
    description
}: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ITextFieldProps) => {

    const onChange = (value: React.ChangeEvent<HTMLInputElement>) => input.onChange(value.target.value);

    return (
        <>
            <Input
                {...input}
                type={type}
                style={{ width: '100%' }}
                required={required}
                label={label as string}
                placeholder={placeholder}
                className={classNames(className, 'material-form-control')}
                disabled={disabled}
                
                onChange={onChange}
            />
            <ShowBox condition={description}>
                <Popover
                    content={description}
                    wrapperStyle={{ top: '24px', right: '-24px' }}
                    wrapperClassName="position-absolute"
                    useWrapper
                >
                    <InfoIcon />
                </Popover>
            </ShowBox>
            <ValidationTouched {...meta} />
        </>
    );
}

export { MaterialTextField };
