
export type ValidateType = 'login' | 'password'

export type onValidate<T extends string> = (value: string, schema: ValueToFields<T>) => {
    isValid: boolean,
    errorText: string
}

export interface ValidateField<T extends string>{
    value: string,
    handlers: onValidate<T>[],
    errors?: string[],
}


export interface ValidatedFieldResponse<T extends string> extends Omit<ValidateField<T>, 'handlers'>{
    isTouched:boolean,
    isValid: boolean,
}

export type SchemaFieldsMapping<T extends string> = {
    [K in T] : ValidateField<T>
}

export type ValueToFields<T extends string> = {
    [K in T]: string
}

export type SchemaFieldsValidated<T extends string> = {
    [K in T]: Partial<ValidatedFieldResponse<T>>
}

export type Schema<T extends string> = {
    schema: SchemaFieldsMapping<T>,
    validateOnSubmit: boolean,
}

