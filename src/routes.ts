import { createHashRouter } from "react-router";
import { Home } from "./components/Home";
import { WizardWorld } from "./components/WizardWorld";
import { MechWorld } from "./components/MechWorld";
import { JungleWorld } from "./components/JungleWorld";
import { CloudWorld } from "./components/CloudWorld";
import { FuturisticCityWorld } from "./components/FuturisticCityWorld";

export const router = createHashRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/wizard",
    Component: WizardWorld,
  },
  {
    path: "/automation",
    Component: MechWorld,
  },
  {
    path: "/analytics",
    Component: JungleWorld,
  },
  {
    path: "/cloud",
    Component: CloudWorld,
  },
  {
    path: "/city",
    Component: FuturisticCityWorld,
  },
]);