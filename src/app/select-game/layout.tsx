import { ProfileDropDown } from "@/components/features/auth/profile-dropdown";
import { HeaderMain } from "@/components/layout";
import { IconMoreHorizontal } from "@/components/ui/icons";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderMain>
        <ProfileDropDown />
      </HeaderMain>
      <main>{children}</main>
    </>
  );
}
