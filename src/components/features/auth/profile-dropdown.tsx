import { LinkButton } from "@/components/ui/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HTMLAttributes } from "react";
import { createClient } from "@/lib/utils/supabase/server";
import { LogoutForm } from "./logout-form";

export async function ProfileDropDown({
  className,
}: HTMLAttributes<HTMLDivElement>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    //return null;
  }

  return (
    <div className={`${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <p>{data?.user ? data.user.email : "Anonymous User"}</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data?.user ? (
            <DropdownMenuItem>
              <LogoutForm />
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem>
                <LinkButton href="/login">Log in</LinkButton>
              </DropdownMenuItem>
              <DropdownMenuLabel>
                <LinkButton href="/signup">Sign up</LinkButton>
              </DropdownMenuLabel>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
