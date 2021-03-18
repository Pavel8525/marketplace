import * as React from "react";
import classNames from "classnames";
import { Field, WrappedFieldProps } from "redux-form";

import { MaskedTextBox, MaskedTextBoxChangeEvent } from "@progress/kendo-react-inputs";
import { ITextFieldProps, ValidationTouched, InfoIcon, Popover, ShowBox } from "app/common/components";

/*
    0—Requires a digit (0-9).
    9—Requires a digit (0-9) or a space.
    #—Requires a digit (0-9), space, plus (+), or minus (-) sign.
    L—Requires a letter (a-Z).
    ?—Requires a letter (a-Z) or a space.
    A—Requires an alphanumeric (0-9, a-Z).
    a—Requires an alphanumeric (0-9, a-Z) or a space.
    &—Requires a character (excluding space).
    C—Requires a character or a space.
 */

 const MaskedTextField = (
    {
        name,
        label,
        placeholder,
        classNameInput = "form-control",
        classNameContainer = "col-6",
        required = false,
        validate,
        disabled,
        mask,
        description,

        onFocus
    }: ITextFieldProps) => {

    return (
        <div className={classNames(classNameContainer, "mb-3")}>
            <Field
                name={name}
                type="text"
                component={renderMaskedTextField}
                placeholder={placeholder}
                className={classNameInput}
                validate={validate}
                disabled={disabled}
                label={label}
                required={required}
                placeholer={placeholder}
                mask={mask}
                description={description}

                onFocus={onFocus}
            />
        </div>
    );
}

const renderMaskedTextField = ({
    input,
    placeholder,
    meta,
    mask,
    className,
    disabled,
    label,
    required,
    description
}: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & ITextFieldProps) => {

    const onChange = (event: MaskedTextBoxChangeEvent) => input.onChange(event.target.value);

    return (
        <>
            <MaskedTextBox
                width='100%'
                required={required}
                value={input.value}
                placeholder={placeholder}
                label={label as string}
                className={classNames(className, "material-form-control")}
                disabled={disabled}
                mask={mask}

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

export { MaskedTextField };
