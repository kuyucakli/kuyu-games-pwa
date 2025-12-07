import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Be at least 8 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Contain at least one special character.",
  })
  .trim();

const emailSchema = z
  .string()
  .check(
    z.trim(),
    z.email({ message: "Please enter a valid email." }),
    z.toLowerCase()
  );

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type loginDataType = z.infer<typeof LoginSchema>;
