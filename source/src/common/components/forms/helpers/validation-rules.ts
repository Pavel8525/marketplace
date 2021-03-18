import i18n from 'app/common/core/translation/i18n';

export const getMessageText = (message: any): string => typeof message === 'function' ? message() : message;

export const RequiredField = (value: any) => RequiredFieldWithMessage(value, i18n.t("forms:validation.required"));
export const RequiredFieldWithMessage = (value: any, message: string) => (value || typeof value === 'number' ? undefined : message);

export const MaxLengthFieldWithMessage = (max: number, message: (() => string) | string) => {
    return (value: any) => {
        return value && value.length > max
            ? typeof message === 'function' ? message() : message
            : undefined;
    }
};
export const MaxLengthField = (max: number) => MaxLengthFieldWithMessage(max, () => i18n.t("forms:validation.max-length", { max }));
export const MaxLengthVeryLongField = MaxLengthField(40000);
export const MaxLengthLongField = MaxLengthField(4000);
export const MaxLengthShortField = MaxLengthField(100);
export const MaxLengthUrl = MaxLengthField(100);
export const MaxLengthEmail = MaxLengthField(100);
export const MaxLengthPhoneNumber = MaxLengthField(100);
export const MaxLengthIdentity = MaxLengthField(128);

export const MinLengthFieldWithMessage = (min: number, message: (() => string) | string) => {
    return (value: any) => {
        return value && value.length < min
            ? getMessageText(message)
            : undefined;
    }
};
export const MinLengthField = (min: number) => MinLengthFieldWithMessage(min, () => i18n.t("forms:validation.min-length", { min }));
export const MinLengthField1 = MinLengthField(1);
export const MinLengthField3 = MinLengthField(3);

export const NumberFieldWithMessage = (value: any, message: (() => string) | string) => value && isNaN(Number(value))
    ? getMessageText(message)
    : undefined;
export const NumberField = (value: any) => NumberFieldWithMessage(value, i18n.t("forms:validation.number"));

export const EmailFieldWithMessage = (value: any, message: (() => string) | string) => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? getMessageText(message)
    : undefined;
export const EmailField = (value: any) => EmailFieldWithMessage(value, i18n.t("forms:validation.email"));

export const LatinAlphaNumericFieldWithMessage = (value: any, message: (() => string) | string) => value && /[^a-zA-Z0-9 ]/i.test(value)
    ? getMessageText(message)
    : undefined;
export const LatinAlphaNumericField = (value: any) => LatinAlphaNumericFieldWithMessage(value, i18n.t("forms:validation.latin-alpha-numeric"));
