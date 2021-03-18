import * as React from 'react';
import i18n from 'app/common/core/translation/i18n';
import { withTranslation, WithTranslation } from 'react-i18next';

import { getPackageInfo } from 'app/common/helpers/package-helper';
import { Button } from 'app/common/components';

import { authService, IUserAuthData, IFailedLoginData } from 'app/common/core/auth';
import { routeDefaultPath } from 'app/common/constants';

interface IState {
    login: string;
    password: string;
    staySigned: boolean;
    submitting: boolean;
    errorMessage?: string;
    formDisabled?: boolean;
}

interface IOwnProps {
}
type IProps = IOwnProps & WithTranslation;

class LoginPage extends React.Component<IProps, IState> {
    private packageInfo = getPackageInfo();

    constructor(props: IProps) {
        super(props);
        require('../../../../../css/page-login-alt.css');

        this.state = {
            submitting: false,
            login: '',
            password: '',
            staySigned: true
        }
    }

    public render() {
        const {
            login,
            password,
            staySigned,
            submitting,
            errorMessage,
            formDisabled = false
        } = this.state;

        const submitButtonDisabled = (!login || !password) || submitting;

        return (
            <>
                <div className="blankpage-form-field">
                    <div className="page-logo m-0 w-100 align-items-center justify-content-center rounded border-bottom-left-radius-0 border-bottom-right-radius-0 px-4">
                        <a className="page-logo-link press-scale-down d-flex align-items-center">
                            <img src={this.packageInfo.logo} aria-roledescription="logo" />
                            <span className="page-logo-text mr-1">{i18n.t("auth:login-page.title")}</span>
                        </a>
                    </div>
                    <div className="card p-4 border-top-left-radius-0 border-top-right-radius-0">
                        <form action="intel_analytics_dashboard.html" aria-disabled={true}>
                            <fieldset disabled={formDisabled}>
                                {errorMessage && (
                                    <div className="form-group">
                                        <span className="help-block" style={{ fontWeight: 600, color: 'red', fontSize: '14px' }}>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label" htmlFor="username">{i18n.t("auth:login-page.username")}</label>
                                    <input
                                        type="email"
                                        id="username"
                                        value={login}
                                        onChange={this.onChangeLogin}
                                        className="form-control"
                                        placeholder={i18n.t("auth:login-page.username-placeholder")}
                                    />
                                    {/* <span className="help-block">Your password</span> */}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">{i18n.t("auth:login-page.password")}</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={this.onChangePassword}
                                        className="form-control"
                                        placeholder={i18n.t("auth:login-page.password-placeholder")}
                                    />
                                    {/* <span className="help-block">Your password</span> */}
                                </div>

                                {/*
                                <div className="form-group text-left">
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={staySigned}
                                            onChange={this.onChangeStaySigned}
                                            className="custom-control-input"
                                            id="rememberme"
                                        />
                                        <label className="custom-control-label" htmlFor="rememberme">{i18n.t("auth:login-page.remember-me")}</label>
                                    </div>
                                </div> 
                                */}

                                <Button
                                    name={i18n.t("auth:login-page.login")}
                                    className="btn-primary float-right"
                                    buttonOnClick={this.submit}
                                    submitting={submitting}
                                    disabled={submitButtonDisabled}
                                />
                            </fieldset>
                        </form>
                    </div>
                    {/* 
                        <div className="blankpage-footer text-center">
                            <a href="#"><strong>{i18n.t("auth:login-page.forgot-password")}</strong></a> | <a href="#"><strong>{i18n.t("auth:login-page.sign-up")}</strong></a>
                        </div>
                    */}
                </div>

                {/* 
                    <div className="login-footer p-2">
                        <div className="row">
                            <div className="col col-sm-12 text-center">
                                <i><strong>System Message:</strong> You were logged out from 198.164.246.1 on Saturday, March, 2017 at 10.56AM</i>
                            </div>
                        </div>
                    </div>
                */}

            </>
        );
    }

    onChangeLogin = (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;

        this.setState(() => ({
            login: newValue
        }));
    }

    onChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        this.setState(() => ({
            password: newValue
        }));
    }

    onChangeStaySigned = (e: React.FormEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.checked;
        this.setState(() => ({
            staySigned: newValue
        }));
    }

    private submit = () => {
        const {
            login,
            password,
            staySigned
        } = this.state;

        this.setState(() => ({
            submitting: true
        }));

        authService.login({ login, password, staySigned })
            .then((value: IUserAuthData) => {
                this.setState(() => ({
                    errorMessage: null,
                    formDisabled: true
                }));

                window.location.href = routeDefaultPath;
            })
            .catch((reason: IFailedLoginData) => {
                this.setState(() => ({
                    errorMessage: reason.errorDescription
                }));
            })
            .finally(() => {
                this.setState(() => ({
                    submitting: false
                }));
            });
    }
}

const LoginPageWithTranslation = withTranslation()(LoginPage);
export { LoginPageWithTranslation as LoginPage };