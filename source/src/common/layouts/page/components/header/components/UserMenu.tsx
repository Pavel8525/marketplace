import * as React from 'react';
import classNames from 'classnames';
import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { getCurrentUser } from 'app/common/helpers/current-user-helper';
import {
    setCurrentLanguage,
    ENGLISH_LANGUAGE,
    RUSSIAN_LANGUAGE,
} from 'app/common/core/translation/i18n';

import { IEnvironmentSettings } from 'app/common/contracts';
import { environmentSettingsService } from 'app/common/reducers/environment';
import { authService } from 'app/common/core/auth';

interface IStateProps {
    environmentSettings: IEnvironmentSettings;
}

interface IDispatchProps {
    updateEnvironmentSettings: (environmentSettings: IEnvironmentSettings) => void;
}

type IProps = IStateProps & IDispatchProps & WithTranslation;

class UserMenu extends React.PureComponent<IProps> {
    private currentUser = getCurrentUser();

    public render() {
        const {
            userFullName,
            dispayName,
            logoPath,
            email
        } = this.currentUser;

        const { currentLanguage } = this.props.environmentSettings;

        const isCurrentLanguageEnglish = currentLanguage === ENGLISH_LANGUAGE;
        const isCurrentLanguageRussian = currentLanguage === RUSSIAN_LANGUAGE;

        return (
            <>
                <div>
                    <a href="#" data-toggle="dropdown" title={dispayName} className="header-icon d-flex align-items-center justify-content-center ml-2">
                        <img src={logoPath} className="profile-image rounded-circle" alt={dispayName} />
                    </a>
                    <div className="dropdown-menu dropdown-menu-animated dropdown-lg">
                        <div className="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
                            <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                                <span className="mr-2">
                                    <img src={logoPath} className="rounded-circle profile-image" alt={dispayName} />
                                </span>
                                <div className="info-card-text">
                                    <div className="fs-lg text-truncate text-truncate-lg">{userFullName}</div>
                                    <span className="text-truncate text-truncate-md opacity-80">{email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-divider m-0" />
                        <a href="#" className="dropdown-item" data-action="app-reset">
                            <span>{i18n.t("user-menu:reset-layout")}</span>
                        </a>
                        <a href="#" className="dropdown-item" data-toggle="modal" data-target=".js-modal-settings">
                            <span>{i18n.t("user-menu:settings")}</span>
                        </a>
                        <div className="dropdown-divider m-0" />
                        <a href="#" className="dropdown-item" data-action="app-fullscreen">
                            <span>{i18n.t("user-menu:fullscreen")}</span>
                            <i className="float-right text-muted fw-n">F11</i>
                        </a>
                        <a href="#" className="dropdown-item" data-action="app-print">
                            <span>{i18n.t("user-menu:print")}</span>
                            <i className="float-right text-muted fw-n">Ctrl + P</i>
                        </a>
                        <div className="dropdown-multilevel dropdown-multilevel-left">
                            <div className="dropdown-item">
                                <span>{i18n.t("user-menu:language")}</span>
                            </div>
                            <div className="dropdown-menu">
                                <a onClick={this.setCurrentLanguageEnglish} className={classNames("dropdown-item", { active: isCurrentLanguageEnglish })}>
                                    {i18n.t(`languages.${ENGLISH_LANGUAGE}`)}
                                </a>
                                <a onClick={this.setCurrentLanguageRussian} className={classNames("dropdown-item", { active: isCurrentLanguageRussian })}>
                                    {i18n.t(`languages.${RUSSIAN_LANGUAGE}`)}
                                </a>
                            </div>
                        </div>
                        <div className="dropdown-divider m-0" />
                        <a className="dropdown-item fw-500 pt-3 pb-3" onClick={authService.logOut}>
                            <span>{i18n.t("user-menu:logout")}</span>
                        </a>
                    </div>
                </div>
            </>
        );
    }

    private setCurrentLanguageEnglish = () => {
        this.props.updateEnvironmentSettings({
            ...this.props.environmentSettings,
            currentLanguage: ENGLISH_LANGUAGE
        });

        setCurrentLanguage(ENGLISH_LANGUAGE);
    }

    private setCurrentLanguageRussian = () => {
        this.props.updateEnvironmentSettings({
            ...this.props.environmentSettings,
            currentLanguage: RUSSIAN_LANGUAGE
        });

        setCurrentLanguage(RUSSIAN_LANGUAGE);
    }
}

const UserMenuWithTranslation = withTranslation()(UserMenu);

const UserMenuConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
        updateEnvironmentSettings: environmentSettingsService.updateAction
    }
)(UserMenuWithTranslation);

export { UserMenuConnected as UserMenu };