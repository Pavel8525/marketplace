import * as React from 'react';
import i18n from 'i18next';
import { ConfigProps } from 'redux-form';
import classNames from 'classnames';

import { IField, Button, RawHtml, AlertPanel } from 'app/common/components';
import { any } from 'app/common/helpers/array-helper';
import { getErrorMessage } from 'app/common/helpers/error-handler-helper';

import { IFormRow, FormColumnLayout, FormState } from '../contracts';
import { IFormProps } from '../../forms';
import { RenderField } from './RenderField';

interface IAutoformOwnProps {
    rows: IFormRow[];
    formState: FormState;
    submitTitle?: string;
    disableCheckDirty?: boolean;
    renderRows?: boolean;

    showBackButton?: boolean;
    showSubmitButton?: boolean;
    showCancelButton?: boolean;
    backButtonTitle?: string;
    cancelButtonTitle?: string;

    rightButtons?: React.ReactNode[];

    onClickBackButton?: () => void;
    onClickCancelButton?: () => void;
}

interface IMyFormProps extends IFormProps<{}, IAutoformOwnProps> { }

type IProps = IMyFormProps & IAutoformOwnProps & ConfigProps;

class Autoform extends React.Component<IProps> {
    static defaultProps = {
        showSubmitButton: true,
    }

    public render() {
        const {
            form,
            rows,
            renderRows = true,
            handleSubmit,
            submitting,
            submit,
            submitTitle,
            dirty,
            formState,
            error,
            valid,
            disableCheckDirty,
            children,
            showBackButton,
            backButtonTitle,
            cancelButtonTitle,
            showSubmitButton,
            showCancelButton,
            rightButtons,

            onClickBackButton,
            onClickCancelButton
        } = this.props;

        if (renderRows && !any(rows)) {
            return null;
        }

        const submitButtonTitle = submitTitle ||
            (formState == FormState.editing
                ? i18n.t("components:autoform.submit.editing")
                : i18n.t("components:autoform.submit.creating")
            );

        let submitButtonDisabled = !dirty || submitting;

        if (disableCheckDirty && valid) {
            submitButtonDisabled = false;
        }
        const errorMessage = error ? getErrorMessage(this.props.error) : null;

        this.getContainersClassName();

        return (
            <>
                <form onSubmit={handleSubmit} className="needs-validation">
                    {errorMessage && (
                        <AlertPanel
                            message={errorMessage}
                            type={'danger'}
                        />
                    )}

                    {renderRows && (
                        <div className="panel-content">
                            {rows.map((row: IFormRow, rowKey: number) => (
                                <div key={rowKey} className={classNames("form-row form-group", row.className)} >
                                    {row.fields.map((field: IField, fieldKey: number) => (
                                        <RenderField
                                            key={fieldKey}
                                            field={field}
                                            classNameContainer={field.classNameContainer}
                                        />
                                    ))}
                                </div>
                            ))}

                            {children && (
                                React.Children.map(children, (column: JSX.Element, idx) => column && React.cloneElement(column, { ref: idx }))
                            )}

                        </div>
                    )}

                    {!renderRows && children && (
                        <div className="panel-content">
                            {React.Children.map(children, (column: JSX.Element, idx) => column && React.cloneElement(column, { ref: idx }))}
                        </div>
                    )}

                    {(showBackButton || showSubmitButton || any(rightButtons)) && (
                        <div className="panel-content border-faded border-left-0 border-right-0 border-bottom-0 flex-row align-items-center">

                            {showBackButton && (
                                <Button
                                    name={backButtonTitle}
                                    className="btn-primary ml-auto margin-5"
                                    buttonOnClick={onClickBackButton}
                                    disabled={submitButtonDisabled}
                                    dontSubmitButton={true}
                                />
                            )}

                            {showSubmitButton && (
                                <Button
                                    name={submitButtonTitle}
                                    className="btn-primary ml-auto margin-5"
                                    buttonOnClick={submit}
                                    submitting={submitting}
                                    disabled={submitButtonDisabled}
                                    form={form}
                                />
                            )}

                            {showCancelButton && (
                                <Button
                                    name={cancelButtonTitle}
                                    className="btn-light ml-auto margin-5"
                                    buttonOnClick={onClickCancelButton}
                                    disabled={submitButtonDisabled}
                                    dontSubmitButton={true}
                                />
                            )}

                            {any(rightButtons) && (React.Children.map(rightButtons, (column: JSX.Element, idx) => column && React.cloneElement(column, { ref: idx })))}
                        </div>
                    )}

                </form>
            </>
        );
    }

    private getContainersClassName = () => {
        if (any(this.props.rows)) {
            this.props.rows.forEach(row => {
                if (any(row.fields)) {
                    row.fields.forEach(field => {
                        field.classNameContainer = this.getClassNameContainer(row, field);
                    })
                }
            })
        }
    }

    private getClassNameContainer = (row: IFormRow, field: IField) => {
        if (field.classNameContainer) {
            return field.classNameContainer;
        }
        const { columntLayout = FormColumnLayout.solo } = row;

        switch (columntLayout) {
            case FormColumnLayout.trio: return "col-md-4";
            case FormColumnLayout.duet: return 'col-md-6';
            default: return 'col-md-12';
        }
    }
}

export { Autoform, IAutoformOwnProps };
