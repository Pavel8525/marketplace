import { FieldControl, FieldType, IField } from "app/common/components";
import { DropdownField } from "app/common/components/forms/components/DropdownField";
import { MaskedTextField } from "app/common/components/forms/components/MaskedTextField";
import * as React from "react";
import { LookupField, NumericField, SelectField, TextField, } from "../../forms";
import { MaterialTextField } from "../../forms/components/MaterialTextField";
import { SwitchField } from "../../forms/components/SwitchField";
import { DatePickerField } from 'app/common/components/forms/components'
import { FormSection, Field } from "redux-form";

interface IRenderFieldProps {
    field: IField;
    classNameContainer?: string;
}

const RenderField = (props: IRenderFieldProps) => {
    const { field, classNameContainer } = props;
    const { type } = field;

    switch (type) {
        case FieldType.string: {
            const { control = FieldControl.text } = field;
            switch (control) {
                case FieldControl.text:
                case FieldControl.textarea: {
                    return (
                        <TextField
                            {...field}
                            classNameContainer={classNameContainer}
                            renderInputType={control === FieldControl.textarea ? 'textarea' : 'text'}
                        />
                    )
                }
                case FieldControl.materialText: {
                    return (
                        <MaterialTextField
                            {...field}
                            classNameContainer={classNameContainer}
                        />
                    )
                }
                case FieldControl.maskedText: {
                    return (
                        <MaskedTextField
                            {...field}
                            classNameContainer={classNameContainer}
                        />
                    )
                }
            }
            break;
        }
        case FieldType.enum: {
            const { control = FieldControl.dropDown } = field;
            switch (control) {
                case FieldControl.dropDown: {
                    return (
                        <SelectField
                            {...field}
                            classNameContainer={classNameContainer}
                        />
                    )
                }
                case FieldControl.materialDropDown: {
                    return (
                        <DropdownField
                            {...field}
                            classNameContainer={classNameContainer}
                        />
                    )
                }
            }
        }
        case FieldType.reference: {
            return (
                <LookupField
                    {...field}
                    classNameContainer={classNameContainer}
                />
            )
        }
        case FieldType.boolean: {
            return (
                <SwitchField
                    {...field}
                    classNameContainer={classNameContainer}
                />
            )
        }
        case FieldType.number: {
            return (
                <NumericField
                    {...field}
                    classNameContainer={classNameContainer}
                />
            )
        }
        case FieldType.date: {
            const { control = FieldControl.datePicker } = field;
            switch (control) {
                case FieldControl.datePicker: {
                    return (
                        // @ts-ignore
                        <DatePickerField {...field} />
                    )
                }
            }
        }
        case FieldType.array: {
            return <NestedFields {...props} />
        }
    }

    return null;
}

const NestedFields = ({classNameContainer, field }: IRenderFieldProps) => {
  const { nestedFields, name, label, required, validate } = field;

  return (
    <div className={classNameContainer}>
      {label && (
        <label className="k-label mb-3" htmlFor={name}>
          {label}
          {required && (
            <>
              {" "}
              <span className="text-danger">*</span>
            </>
          )}
        </label>
      )}
      <FormSection name={name}>
        <Field name={name} nestedFields={nestedFields} validate={validate} component={RenderFieldArray}/>
      </FormSection>
    </div>
  );
};

const RenderFieldArray = ({ meta, nestedFields }: any) => {
  const { error } = meta;
  return (
    <>
      {nestedFields.map((field: IField, index: any) => (
        <RenderField
          key={index}
          classNameContainer={field.classNameContainer}
          field={{ ...field }}
        />
      ))}
      {error && (
        <div className="invalid-feedback" style={{ display: "block" }}>
          {error}
        </div>
      )}
    </>
  );
};

export { RenderField, IRenderFieldProps };
