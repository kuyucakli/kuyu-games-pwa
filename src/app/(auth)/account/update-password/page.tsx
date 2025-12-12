import { UpdatePasswordForm } from "@/components/features/auth/update-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function UpdatePasswordPage({}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update password-code</CardTitle>
        <CardDescription>Change your password...</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
