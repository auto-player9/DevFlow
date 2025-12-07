'use client';

import React from "react";
import {AuthForm} from "@/components/forms/AuthForm";

import { SignInSchema, SignInSchemaType } from "@/lib/validations";

function SignIn(): React.JSX.Element {
    return (
        <>
            <AuthForm<SignInSchemaType, typeof SignInSchema>
                formType="SIGN_IN"
                schema={SignInSchema}
                defaultValues={{email: "", password: ""}}
                onSubmit={(data) => {
                    return Promise.resolve({success: true, data})
                }}
            />
        </>
    )
}

export default SignIn;
