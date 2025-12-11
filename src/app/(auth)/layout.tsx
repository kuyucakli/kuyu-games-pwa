import { ProfileDropDown } from "@/components/features/auth/profile-dropdown";
import { HeaderMain } from "@/components/layout";
import { Button } from "@/components/ui/buttons";
import { IconGameList, IconMoreHorizontal } from "@/components/ui/icons";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderMain>
        <Link href="/select-game">
          <Button icon={<IconGameList />}>Select game</Button>
        </Link>
        <ProfileDropDown />
      </HeaderMain>
      <main>{children}</main>
    </>
  );
}
