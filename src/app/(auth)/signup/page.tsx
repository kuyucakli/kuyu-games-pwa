import { SignupForm } from "@/components/features/auth/signup-form";
import { TextLink } from "@/components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Chat with others, share...</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter>
        <TextLink href="/login">Already a member</TextLink>
      </CardFooter>
    </Card>
  );
}
