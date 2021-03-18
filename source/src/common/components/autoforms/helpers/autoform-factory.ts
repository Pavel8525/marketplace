import * as toastr from 'toastr';
import { reduxForm } from "redux-form";
import i18n from 'app/common/core/translation/i18n';

import { Autoform, IAutoformOwnProps } from "../components/Autoform";
import { getSingleODataResponse, getMultipleODataResponse } from "app/common/core/api/contracts/odata-response";
import { getErrorMessage, handleInvokeException } from 'app/common/helpers/error-handler-helper';


interface ICreateFormProps {
    formName: string;
    showNotification?: boolean;
    resultType?: 'nothing' | 'single' | 'multiple';
    onSubmitSuccess?: (entity: {}) => void;
    onSubmitFail?: (errors: any) => void;
    validate?: (entity: {}) => void;
}

export const autoformFactory = (props: ICreateFormProps) => {
    const {
        showNotification = true,
        resultType = 'single'
    } = props;

    const getForm = () => {
        const form = reduxForm<{}, IAutoformOwnProps>({
            form: props.formName,
            enableReinitialize: true,
            onSubmitSuccess: (result, dispatch, formProps) => {
                if (typeof result === 'undefined') {
                    return;
                }

                if (showNotification) {
                    toastr.success(null, i18n.t('notifications:rest.successfully'));
                }

                if (props.onSubmitSuccess) {
                    let response: any = result;

                    switch (resultType) {
                        case 'single': {
                            response = getSingleODataResponse(result);
                            break;
                        }
                        case 'multiple': {
                            response = getMultipleODataResponse(result);
                            break;
                        }
                    }

                    props.onSubmitSuccess(response);
                }
            },
            onSubmitFail: (errors, dispatch, submitError, formProps) => {
                handleInvokeException(errors, showNotification);

                if (props.onSubmitFail) {
                    props.onSubmitFail(errors);
                }
            }
        })(Autoform);

        return form;
    }

    return {
        getForm
    };
}