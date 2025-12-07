import { LoginForm } from "@/components/features/auth/login-form";
import { useMessageStore } from "@/store/message-store";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const success = (await searchParams).success;

  return (
    <>
      <h1 className="text-2xl">Login</h1>
      <LoginForm message={success} />
      <Link href="">Forgot password</Link>
    </>
  );
}
