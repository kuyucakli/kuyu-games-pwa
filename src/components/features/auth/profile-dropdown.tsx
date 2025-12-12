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
import { createClient } from "@/lib/supabase/server";
import { LogoutForm } from "./logout-form";
import { IconRobot } from "@/components/ui/icons";

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
        <DropdownMenuTrigger className="flex gap-2 items-center text-xs">
          <IconRobot />
          <span>{data?.user ? data.user.email : "Anonymous user"}</span>
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
