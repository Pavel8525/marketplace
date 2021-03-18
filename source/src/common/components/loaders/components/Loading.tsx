import i18n from 'i18next';
import * as React from 'react';

interface IProps {
    text?: string;
}

export const Loading = ({ text }: IProps) => (
    <div className="k-loading-mask">
        <span className="k-loading-text">{text || i18n.t("app:loading.default")}</span>
        <div className="k-loading-image" />
        <div className="k-loading-color" />
    </div>
);
