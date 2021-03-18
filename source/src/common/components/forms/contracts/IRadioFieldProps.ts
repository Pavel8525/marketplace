import { IFieldProps } from ".";

interface IRadioFieldProps extends IFieldProps {
    value: string;
}

interface IRadioGroupFieldProps extends IFieldProps {
    items: { label: string, value: string }[];
}

export { IRadioFieldProps, IRadioGroupFieldProps };