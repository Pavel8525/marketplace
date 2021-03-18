import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import classNames from 'classnames';

import { NumericTextBox, NumericTextBoxChangeEvent } from '@progress/kendo-react-inputs';

import 'app/common/components/forms/styles/material-fields.css';

import { INumericFieldProps } from '../contracts';
import { ValidationTouched } from '.';

import { InfoIcon, Popover, ShowBox } from 'app/common/components';

const NumericField = (props: INumericFieldProps) => {
    const {
        classNameInput = "form-control",
        classNameContainer = "col-6"
    } = props;

    return (
        <div className={classNames(classNameContainer, "mb-3 position-relative")}>
            <Field
                {...props}
                component={renderNumericTextInput}
                className={classNameInput}
            />
        </div>
    );
}

const parseNumber = function (value: any) {
    if (typeof value === "undefined" || typeof value === null) {
        return 0;
    }
    if (typeof value === "number") {
        return value as number;
    }

    if (typeof value === "string") {
        return parseFloat(value) || 0;
    }
    if (Array.isArray(value) && value.length > 0) {
        return parseFloat(value[0]) || 0;
    }

    return value;
}

const renderNumericTextInput = (props: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & INumericFieldProps) => {
    const {
        input,
        placeholder,
        meta,
        className,
        disabled,
        label,
        required,
        defaultValue,
        formatNumber,
        min,
        max,
        step,
        description
    } = props;

    const onChange = (value: NumericTextBoxChangeEvent) => {
        input.onChange(value.value);
    }

    const $defaultValue = parseNumber(defaultValue);
    const $value = parseNumber(input.value);

    return (
        <>
            <NumericTextBox
                name={input.name}
                value={$value}
                defaultValue={$defaultValue}
                required={required}
                label={label as string}
                placeholder={placeholder}
                className={classNames(className, 'material-form-control')}
                disabled={disabled}
                onChange={onChange}

                format={formatNumber}
                min={min}
                max={max}
                step={step}
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

export { NumericField };
