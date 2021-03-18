import { DatePickerSettings } from '@progress/kendo-react-dateinputs';
import { IFieldProps } from './';

export interface IDatePickerFieldProps extends IFieldProps {
    defaultValue?: Date;
    defaultShow?: boolean;
    dateFormat?: DatePickerSettings['format']
}
