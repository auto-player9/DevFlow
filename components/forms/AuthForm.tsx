"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {DefaultValues, Path, SubmitHandler, useForm, FieldValues, Resolver} from "react-hook-form"

import { ZodSchema, ZodObject } from "zod";

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import React from "react";
import ROUTES from "@/constants/routes";
import Link from "next/link";


interface AuthFormProps<T extends FieldValues, S extends ZodObject<any, any>> {

    schema: S & ZodSchema<T>,
    defaultValues: DefaultValues<T>,
    onSubmit: (data: T) => Promise<{ success: boolean }>,
    formType: "SIGN_IN" | "SIGN_UP",
}


export function AuthForm<T extends FieldValues, S extends ZodObject<any, any>>({schema, defaultValues, formType, onSubmit}: AuthFormProps<T, S>): React.JSX.Element {

    type FormSchema = T;

    const resolver = zodResolver(schema) as unknown as Resolver<FormSchema, any>;

    const form = useForm<FormSchema>({
        resolver: resolver,
        defaultValues: defaultValues as DefaultValues<FormSchema>
    })


    const buttonText: "Sign In" | "Sign Up" = formType === "SIGN_IN" ? "Sign In" : "Sign Up"
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<T>)} className="mt-10 space-y-6">
                {Object.keys(defaultValues).map((field) => {
                    const formLabelName: string = field === "email" ? "Email Address" : field[0].toUpperCase() + field.slice(1)
                    return (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<FormSchema>}
                            render={({field}) => (
                                <FormItem className="flex flex-col w-full gap-2.5">
                                    <FormLabel
                                        className="paragraph-medium text-dark400_light700">{formLabelName}</FormLabel>
                                    <FormControl>
                                        <Input required
                                               type={field.name === "password" ? "password" : "text"} {...field}
                                               className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border w-full"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )
                })}

                <Button disabled={form.formState.isSubmitting} type="submit"
                        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
                >{form.formState.isSubmitting ? buttonText === "Sign In" ? 'Signing Im...' : 'Signing Up...' : buttonText}</Button>
                {formType === "SIGN_IN" ?
                    <p>Dont' have an account? <Link className="paragraph-semibold primary-text-gradient"
                                                    href={ROUTES.SIGN_UP}>Sign Up</Link></p> : <p>
                        Already have an account? <Link className="paragraph-semibold primary-text-gradient"
                                                       href={ROUTES.SIGN_IN}>Sign In</Link>
                    </p>}

            </form>
        </Form>
    )
}