import React, {ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {useEffectOnce, useSetState, useUpdateEffect} from "react-use";
import * as S from 'fp-ts/string'
import {uniq} from "fp-ts/NonEmptyArray";
import {boolean} from "fp-ts";
import {Schema, SchemaFieldsMapping, SchemaFieldsValidated, ValidatedFieldResponse, ValidateType} from "./types";




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
               (value)=> {
                   return {
                       isValid: value.length > 4,
                       errorText: 'Пароль должен состоять минимум из 4х символов'
                   }
               }
           ],
           value: '',
       },
   }
}

export function useValidate<T extends string>(data: Schema<T>){

    const [schema, setSchema] = useSetState<SchemaFieldsValidated<T>>();


    const checkFields = (name: T, value: string) => {
        const field = data.schema[name]
        const errors = field.handlers.filter(handler => {
            const h = handler(value);
            return !h.isValid
        }).map(i => i(value).errorText)
            const fieldData: Partial<ValidatedFieldResponse> = { value: value, isTouched: true };
            setSchema({[name]: !data.validateOnSubmit ?
                    fieldData: { errors: errors, isValid: !errors.length, value: value, isTouched: true } } as SchemaFieldsValidated<T>)
    }

    const handleField = (e: ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name as unknown as T;
        const value = e.target.value

        checkFields(fieldName, value);

    }


    const onSubmit = (callback: (values: SchemaFieldsValidated<T>) => void)=> {
            for(let key in data.schema){
                console.log(data.schema)
                checkFields(key, schema[key].value ?? '');

            }
            callback(schema)
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



// export function ValidateProvider(){
//     return(
//
//     )
// }

function App() {
    const {fields, onChange, onSubmit} = useValidate(val)
    console.log(fields);
  return (
    <div className="App">
       <Input<ValidateType> value={fields?.login?.value}
                            errors={fields?.login?.errors}
                            isValid={fields?.login?.isValid}
                            onChange={onChange} name={'login'}/>
        <button onClick={()=> onSubmit(values => console.log(fields))}>validate</button>
    </div>
  );
}

export default App;



