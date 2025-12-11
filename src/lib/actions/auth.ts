"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/utils/supabase/server";
import {
  EmailInput,
  ForgotPassword,
  forgotPasswordSchema,
  loginDataType,
  loginSchema,
  UpdatePassword,
  updatePasswordSchema,
} from "../schemas/auth";
import { customFlattenError } from "../utils/form/custom-flatten-error";

type formActionResult<
  T extends loginDataType | ForgotPassword | UpdatePassword
> = {
  values: T;
  errors: Record<string, string[]>;
};

export async function login(
  state: formActionResult<loginDataType>,
  formData: FormData
): Promise<formActionResult<loginDataType>> {
  const supabase = await createClient();

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { values, errors: customFlattenError(validatedFields.error) };
  }

  const { error } = await supabase.auth.signInWithPassword(values);

  //return { values, errors: {} };

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  state: formActionResult<loginDataType>,
  formData: FormData
): Promise<formActionResult<loginDataType>> {
  const supabase = await createClient();

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { values, errors: customFlattenError(validatedFields.error) };
  }

  const { error } = await supabase.auth.signUp(values);

  //return { values, errors: {} };

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login?success=true");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  state: formActionResult<ForgotPassword>,
  formData: FormData
): Promise<formActionResult<ForgotPassword>> {
  const values = {
    email: formData.get("email") as string,
  };

  const validatedFields = forgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { values, errors: customFlattenError(validatedFields.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    values.email,
    {
      redirectTo: "http://localhost:3000/update-password",
    }
  );

  if (error) {
    return { values, errors: { formError: [JSON.stringify(error)] } };
  } else {
    return { values, errors: { formError: [JSON.stringify(error)] } };
  }
}

export async function updatePassword(
  state: formActionResult<UpdatePassword>,
  formData: FormData
): Promise<formActionResult<UpdatePassword>> {
  const values = {
    code: formData.get("code") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedFields = updatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { values, errors: customFlattenError(validatedFields.error) };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (error) throw error;
    // Update this route to redirect to an authenticated route. The user already has an active session.
    redirect("/");
  } catch (error: unknown) {
    redirect("/error");
  } finally {
  }
}
