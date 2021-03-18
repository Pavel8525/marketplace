interface FieldError {
    Field: string;
    Error: string;
}

interface ModelStateErrors {
    IsModelStateErrors: boolean;
    Message: string;
    FieldErrors: FieldError[];
}

export { FieldError, ModelStateErrors };