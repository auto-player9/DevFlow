'use client';

import React from "react";
import { AuthForm } from "@/components/forms/AuthForm";

import { SignInSchema, SignInSchemaType } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.action";

function SignIn(): React.JSX.Element {
    return (
        <>
            <AuthForm<SignInSchemaType, typeof SignInSchema>
                formType="SIGN_IN"
                schema={SignInSchema}
                defaultValues={{ email: "", password: "" }}
                onSubmit={signInWithCredentials}
                        />
        </>
    )
}

export default SignIn;
