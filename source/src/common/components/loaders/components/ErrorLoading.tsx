import i18n from 'i18next';
import * as React from 'react';
import { AlertPanel } from '../..';

interface IProps {
    error?: string;
}

export const ErrorLoading = ({ error }: IProps) => (
    <AlertPanel
        message={error || i18n.t("app:loading.error")}
        type='danger'
    />
);
