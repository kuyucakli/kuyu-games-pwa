import { ProfileDropDown } from "@/components/features/auth/profile-dropdown";
import { HeaderMain } from "@/components/layout";
import { IconGameList } from "@/components/ui/icons";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderMain>
        <Link href="/select-game">
          <IconGameList />
        </Link>
        <ProfileDropDown />
      </HeaderMain>
      <main>{children}</main>
    </>
  );
}
