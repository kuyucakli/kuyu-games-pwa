"use client";

import { Button } from "@/components/ui/buttons";
import { Form } from "@/components/ui/form/form";
import { InputText } from "@/components/ui/form/inputs";
import { signup } from "@/lib/actions/auth";
import { useActionState } from "react";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, {
    values: { email: "", password: "" },
    errors: {},
  });
  return (
    <Form className="m-auto" action={action}>
      <InputText type="email" id="email" error={state.errors.email} />

      <InputText type="password" id="password" error={state.errors.password} />

      <Button type="submit">Sign up</Button>
    </Form>
  );
}
