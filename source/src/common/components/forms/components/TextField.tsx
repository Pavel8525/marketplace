import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { ITextFieldProps } from '../contracts/ITextFieldProps';
import { ValidationTouched } from '.';

import { InfoIcon, Popover, ShowBox } from 'app/common/components';

const TextField = (
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

    const renderInput = renderInputType === 'text' ? renderTextInput : renderTextAreaInput;
    return (
        <div className={classNames(classNameContainer, "mb-3 position-relative", description && 'mr-4')}>
            <label className="form-label" htmlFor={name}>
                {label}{required && (<>{" "}<span className="text-danger">*</span></>)}
            </label>

            <Field
                name={name}
                type={isPassword ? 'password' : 'text'}
                component={renderInput}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                disabled={disabled}
                description={description}

                onFocus={onFocus}
            />
        </div>
    );
}

const renderTextInput = ({
    input,
    type,
    description,
    placeholder,
    meta,
    className,
    disabled
}: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ITextFieldProps) => (
        <>
            <input
                {...input}
                type={type}
                id={input.name}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
            />

            <ShowBox condition={description}>
                <Popover
                    wrapperStyle={{ top: '37px', right: '-24px' }}
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

const renderTextAreaInput = ({ input, placeholder, meta, description, className, disabled }: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ITextFieldProps) => (
    <>
        <textarea
            {...input}
            id={input.name}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
        />
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

export { TextField };
