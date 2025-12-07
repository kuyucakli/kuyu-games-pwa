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

const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type loginDataType = z.infer<typeof LoginSchema>;
type emailInput = z.infer<typeof emailSchema>;
type passwordInput = z.infer<typeof passwordSchema>;

export { LoginSchema };
export type { loginDataType, emailInput, passwordInput };
