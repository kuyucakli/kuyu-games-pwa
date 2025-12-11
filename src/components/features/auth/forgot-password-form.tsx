"use client";
import { Button } from "@/components/ui/buttons";
import { Form, FormFooter } from "@/components/ui/form/form";
import { InputText } from "@/components/ui/form/inputs";
import { requestPasswordReset } from "@/lib/actions/auth";
import { useActionState } from "react";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, {
    values: { email: "" },
    errors: {},
  });
  return (
    <Form action={action}>
      <InputText type="email" id="email" error={state.errors?.email} />
      <FormFooter>
        <Button type="submit">Send</Button>
      </FormFooter>
    </Form>
  );
}
