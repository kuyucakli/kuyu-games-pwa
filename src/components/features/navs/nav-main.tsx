import { ProfileDropDown } from "../auth/profile-dropdown";
import { ButtonSelectGame } from "./button-select-game";
import { ButtonToggleAudio } from "./button-toggle-audio";

export function NavMain() {
  return (
    <nav className="flex landscape:flex-col-reverse gap-4 ">
      <ButtonToggleAudio />
      <ButtonSelectGame />
      <ProfileDropDown />
    </nav>
  );
}
