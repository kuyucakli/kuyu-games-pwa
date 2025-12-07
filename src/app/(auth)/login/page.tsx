import { LoginForm } from "@/components/features/auth/login-form";
import { useMessageStore } from "@/store/message-store";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const success = (await searchParams).success;

  return <LoginForm message={success} />;
}
