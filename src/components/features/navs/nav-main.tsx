import { IntroAudio } from "../app-audio/intro-audio";
import { ProfileDropDown } from "../auth/profile-dropdown";
import { ButtonSelectGame } from "./button-select-game";

export function NavMain() {
  return (
    <nav className="flex landscape:flex-col-reverse gap-4 ">
      <IntroAudio />
      <ButtonSelectGame />
      <ProfileDropDown />
    </nav>
  );
}
