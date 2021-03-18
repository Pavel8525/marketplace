import * as React from 'react';
import { WrappedFieldMetaProps } from "redux-form";

export const ValidationTouched = ({ touched, error, warning }: WrappedFieldMetaProps) => {
    if (
        touched &&
        (
            error ||
            warning
        )
    ) {
        return (
            <>
                {
                    (error && <div className="invalid-feedback" style={{ display: 'block' }}>{error}</div>) ||
                    (warning && <div className="valid-feedback" style={{ display: 'block' }}>{warning}</div>)
                }
            </>
        );
    } else {
        return null;
    }
};