import { LoginForm } from "@/components/features/auth/login-form";
import { TextLink } from "@/components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const success = (await searchParams).success;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Welcome,</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm message={success} />
      </CardContent>
      <CardFooter>
        <ul>
          <li>
            <TextLink href="/forgot-password">Forgot password</TextLink>
          </li>
          <li>
            <TextLink href="/signup">Not a member yet?</TextLink>
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
}
