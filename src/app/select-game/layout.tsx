import { ProfileDropDown } from "@/components/features/auth/profile-dropdown";
import { HeaderMain } from "@/components/layout";

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
