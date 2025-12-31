import { LinkButton } from "@/components/ui/buttons";
import { HTMLAttributes } from "react";
import { createClient } from "@/lib/supabase/server";
import { LogoutForm } from "./logout-form";
import { IconRobot } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
} from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";

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
      <button popoverTarget="account-popover">
        <Avatar>
          <IconRobot />
        </Avatar>
      </button>
      <Popover
        id="account-popover"
        className="fixed left-auto top-10 right-0 scheme-dark text-center"
      >
        <PopoverHeader className="flex justify-center">
          <Avatar className="w-18!">
            <IconRobot />
          </Avatar>
        </PopoverHeader>
        <PopoverContent>
          <span className="mix-blend-difference text-white text-sm">
            {data?.user ? data.user.email : "player anonymous"}
          </span>

          <LinkButton href="/login">Log in</LinkButton>

          <LinkButton href="/signup">Sign up</LinkButton>
          {data?.user ? <LogoutForm /> : <></>}
        </PopoverContent>
      </Popover>
    </div>
  );
}
