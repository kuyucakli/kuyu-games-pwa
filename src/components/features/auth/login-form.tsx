"use client";

import { ButtonDefault } from "@/components/ui/buttons";
import { Form } from "@/components/ui/form/form";
import { InputText } from "@/components/ui/form/inputs";
import { login } from "@/lib/actions/auth";
import { useActionState } from "react";

export function LoginForm({ message }: { message?: string | string[] }) {
  const [state, action] = useActionState(login, {
    values: { email: "", password: "" },
    errors: {},
  });

  return (
    <Form action={action}>
      <InputText type="email" id="email" error={state.errors.email} />

      <InputText type="password" id="password" error={state.errors.password} />

      <ButtonDefault type="submit">Log in</ButtonDefault>
    </Form>
  );
}
