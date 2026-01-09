import GameTahterevallis from "@/components/features/games/tahterevallis";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tahterevallis",
  description: "Kuyu Games Tahterevallis Game",
};
export default function TahterevalliHomePage() {
  return <GameTahterevallis />;
}
