import { IntroAudio } from "../app-audio/intro-audio";
import { ProfileDropDown } from "../auth/profile-dropdown";
import { ButtonSelectGame } from "./button-select-game";

export function NavMain() {
  return (
    <>
      <IntroAudio />
      <ButtonSelectGame />
      <ProfileDropDown />
    </>
  );
}
