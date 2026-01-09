"use client";

import { ButtonDefault } from "@/components/ui/buttons";
import { Form } from "@/components/ui/form/form";
import { signout } from "@/lib/actions/auth";
import { useActionState } from "react";

export function LogoutForm() {
  //const { state, action, pending } = useActionState(signout, {});

  return (
    <Form action={signout}>
      <ButtonDefault type="submit">Logout</ButtonDefault>
    </Form>
  );
}
