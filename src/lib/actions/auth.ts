"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

import { createClient } from "@/lib/utils/supabase/server";
import { loginDataType, LoginSchema } from "../schemas/auth";
import { customFlattenError } from "../utils/form/custom-flatten-error";

type formActionResult = {
  values: loginDataType;
  errors: Record<string, string[]>;
};

export async function login(
  state: formActionResult,
  formData: FormData
): Promise<formActionResult> {
  const supabase = await createClient();

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validatedFields = LoginSchema.safeParse(values);

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
  state: formActionResult,
  formData: FormData
): Promise<formActionResult> {
  const supabase = await createClient();

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = LoginSchema.safeParse(values);

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
