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

const emailInputSchema = z.email("Please enter a valid email.");

const loginSchema = z.object({
  email: emailInputSchema,
  password: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: emailInputSchema,
});

const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // attach error to the correct field
  });

type loginDataType = z.infer<typeof loginSchema>;
type EmailInput = z.infer<typeof emailInputSchema>;
type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
type UpdatePassword = z.infer<typeof updatePasswordSchema>;

export {
  loginSchema,
  updatePasswordSchema,
  emailInputSchema,
  forgotPasswordSchema,
};
export type { loginDataType, EmailInput, ForgotPassword, UpdatePassword };
