
export type ValidateType = 'login' | 'password'

export type onValidate = (value: string) => {
    isValid: boolean,
    errorText: string
}

export interface ValidateField{
    value: string,
    handlers: onValidate[]
    errors?: string[],
}


export interface ValidatedFieldResponse extends Omit<ValidateField, 'handlers'>{
    isTouched:boolean,
    isValid: boolean,
}

export type SchemaFieldsMapping<T extends string> = {
    [K in T] : ValidateField
}

export type SchemaFieldsValidated<T extends string> = {
    [K in T]: Partial<ValidatedFieldResponse>
}

export type Schema<T extends string> = {
    schema: SchemaFieldsMapping<T>,
    validateOnSubmit: boolean,
}

