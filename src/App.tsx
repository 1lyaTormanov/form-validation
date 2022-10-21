import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import { useSetState} from "react-use";

import {Schema, SchemaFieldsValidated, ValidatedFieldResponse, ValidateType, ValueToFields} from "./types";




const val: Schema<ValidateType> = {
   validateOnSubmit: false,
   schema: {
       login: {
           value: '',
           handlers: [
               (value)=> {
                   return {
                       isValid: !!value.length,
                       errorText: 'Введите значение'
                   }
               },
               (value)=> {
                   return {
                       isValid: value.includes('@'),
                       errorText: 'Введите корректный email'
                   }
               },
               (value)=> {
                   return {
                       isValid: value.length > 5,
                       errorText: 'Email слишком короткий'
                   }
               }
           ]
       },
       password: {
           handlers: [
               (value)=> {
                   return {
                       isValid: !!value.length,
                       errorText: 'Введите значение'
                   }
               },
               (value, schema)=> {
                   return {
                       isValid: value === schema.login,
                       errorText: 'Логин и пароль должны совпадать(тест)'
                   }
               }
           ],
           value: '',
       },
   }
}
export function useValidate<T extends string>(data: Schema<T>){
    const [schema, setSchema] = useSetState<SchemaFieldsValidated<T>>(initialFields());
    const [isSubmitted, setIsSubmitted] = useState(false);

    function initialFields () {
        let res: SchemaFieldsValidated<T> | undefined = undefined;

        for(let i in data.schema){
            if(res){
                res = {...res, ...{[i] : {value: '', isTouched: false}}} as SchemaFieldsValidated<T>;
            }
            else{
                res = {[i] : {value: '', isTouched: false}} as SchemaFieldsValidated<T>
            }
        }
        return res
    }


    const checkFields = (name: T, value: string, renderCond: boolean) => {
        const field = data.schema[name];
        let values = {};
        for(let key in schema){
            values = {...values,[key]: schema[key].value}
        }
        const errors = field.handlers.filter(handler => {
            const h = handler(value, values as ValueToFields<T>);
            return !h.isValid
        }).map(i => i(value, values as ValueToFields<T>).errorText);

            const fieldData: Partial<ValidatedFieldResponse<T>> = { value: value, isTouched: true };
            setSchema(
                {[name]: !renderCond ?
                    fieldData:
                    { errors: errors, isValid: !errors.length, value: value, isTouched: true } } as SchemaFieldsValidated<T>);
    }

    const handleField = (e: ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name as unknown as T;
        const value = e.target.value;

        checkFields(fieldName, value,
            (!data.validateOnSubmit && isSubmitted)
            || (!data.validateOnSubmit && !isSubmitted));
    }


    const onSubmit = (callback: (values?: SchemaFieldsValidated<T>) => void)=> {
            setIsSubmitted(true);
            for(let key in data.schema){
                if(schema[key]){
                    checkFields(key, schema[key].value ?? '', true);
                }
            }
            callback(schema);

    }


    return {
        fields: schema,
        onChange: handleField,
        onSubmit: onSubmit
    }

}


export interface InputProps<T extends string>{
    value?: string,
    onChange: (e:ChangeEvent<HTMLInputElement>) => void,
    name: T,
    isValid?: boolean,
    errors?: string[],
    className?: string
}

export function Input<T extends string>(props: InputProps<T>){
    return (
        <div>
            <input style={{border: props.isValid === false ? '1px solid red' : '1px solid black'}}
                   className={props.className}
                   onChange={props.onChange}
                   value={props.value ?? ''} name={props.name ?? ''}/>
            {props.errors?.map(err => <div key={err}>{err}</div>)}
        </div>
    )
}


function App() {
    const {fields, onChange, onSubmit} = useValidate(val)
  return (
    <div className="App">
       <Input value={fields.login.value}
                            errors={fields.login.errors}
                            isValid={fields.login.isValid}
                            onChange={onChange} name={'login'}/>
        <Input value={fields.password.value}
                             errors={fields.password.errors}
                             isValid={fields.password.isValid}
                             onChange={onChange} name={'password'}/>
        <button onClick={()=> onSubmit(() => console.log(fields))}>validate</button>
    </div>
  );
}

export default App;



