"use client";

import { Button } from "@/components/ui/buttons";
import { Form } from "@/components/ui/form/form";
import { InputText } from "@/components/ui/form/inputs";
import { login } from "@/lib/actions/auth";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function LoginForm({ message }: { message?: string | string[] }) {
  const [state, action, pending] = useActionState(login, {
    values: { email: "", password: "" },
    errors: {},
  });

  //const { addMessage } = useMessageStore();

  useEffect(() => {
    if (message) {
      toast.success("You have successfully registered. You can now log in");
    }
  }, [message]);

  return (
    <Form className="m-auto" action={action}>
      <InputText type="email" id="email" error={state.errors.email} />

      <InputText type="password" id="password" error={state.errors.password} />

      <Button type="submit">Log in</Button>
    </Form>
  );
}
