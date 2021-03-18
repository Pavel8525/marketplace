import React, { FC } from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DatePickerChangeEvent } from '@progress/kendo-react-dateinputs/dist/npm/datepicker/DatePicker';
import { LocalizationProvider, IntlProvider } from '@progress/kendo-react-intl'
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { RootStore } from 'app/common/reducers';
import { IDatePickerFieldProps } from '../contracts';
import { InfoIcon, Popover, ShowBox, ValidationTouched } from 'app/common/components';
import 'app/css/date-picker-field/styles.css'

export const DatePickerField: FC<IDatePickerFieldProps> = (props) => {
    const language = useSelector((state: RootStore) => state.environmentSettings.currentLanguage)
    const settings = useSelector((state: RootStore) => state.environmentSettings.localizationSettings)

    const {
        defaultValue = new Date(),
        classNameContainer,
        description,
        dateFormat = settings.calendarDateFormat,
        label,
        ...rest
    } = props;

    return (
        <LocalizationProvider language={language}>
            <IntlProvider locale={language}>
                <div className={classNames(classNameContainer, 'mb-3 position-relative date-picker-container', description && 'mr-4')}>
                    <label className={classNames('form-label', 'date-picker-label')} htmlFor={rest.name}>
                        {label}{rest.required && (<>{" "}<span className="text-danger">*</span></>)}
                    </label>
                    <Field
                        component={renderDatePicker}
                        description={description}
                        defaultValue={defaultValue}
                        dateFormat={dateFormat}
                        {...rest}
                    />
                </div>
            </IntlProvider>
        </LocalizationProvider>
    )
}

const renderDatePicker = (props: React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps & IDatePickerFieldProps) => {
    const { description, meta, input, defaultValue, defaultShow, disabled, dateFormat } = props;

    const onChange = (event: DatePickerChangeEvent) => input.onChange(event.target.value);

    return (
        <>
            <DatePicker
                format={dateFormat}
                onChange={onChange}
                defaultValue={defaultValue}
                defaultShow={defaultShow}
                disabled={disabled}
                className="d-block"
            />
            <ShowBox condition={description}>
                <Popover
                    content={description}
                    wrapperStyle={{ bottom: '6px', right: '0' }}
                    wrapperClassName="position-absolute"
                    useWrapper
                >
                    <InfoIcon/>
                </Popover>
            </ShowBox>
            <ValidationTouched {...meta} />
        </>
    )
}
