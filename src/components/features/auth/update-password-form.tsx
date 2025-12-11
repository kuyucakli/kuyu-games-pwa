"use client";
import { Button } from "@/components/ui/buttons";
import { Form, FormFooter } from "@/components/ui/form/form";
import { InputText } from "@/components/ui/form/inputs";
import { updatePassword } from "@/lib/actions/auth";
import { useActionState } from "react";

export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePassword, {
    values: { password: "", confirmPassword: "" },
    errors: {},
  });
  return (
    <Form action={action}>
      {JSON.stringify(state.errors)}

      <InputText
        defaultValue={state.values.password}
        type="password"
        id="password"
        error={state.errors?.password}
      />

      <InputText
        defaultValue={state.values.confirmPassword}
        type="password"
        id="confirmPassword"
        error={state.errors?.confirmPassword}
      />
      <FormFooter>
        <Button type="submit">Send</Button>
      </FormFooter>
    </Form>
  );
}
