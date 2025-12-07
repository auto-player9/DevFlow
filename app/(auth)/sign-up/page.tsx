'use client';

import React from "react";
import {AuthForm} from "@/components/forms/AuthForm";
import {SignUpSchema} from "@/lib/validations";

function SignUp(): React.JSX.Element {
    return (
        <>
            <AuthForm formType="SIGN_UP" schema={SignUpSchema} defaultValues={{email: "", password: "" ,name : "", username: ""}}
                      onSubmit={(data) => {
                          return Promise.resolve({success: true, data})
                      }}/>
        </>
    )
}

export default SignUp;
