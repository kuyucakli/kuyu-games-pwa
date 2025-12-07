import Link from "next/link";
import { IconMoreHorizontal } from "../ui/icons";
import { ProfileDropDown } from "../features/auth/profile-dropdown";

export function HeaderMain() {
  return (
    <header className="fixed top-8 z-40 right-8 flex gap-8 ">
      <Link href="/select-game">
        <IconMoreHorizontal />
      </Link>
      <ProfileDropDown />
    </header>
  );
}
