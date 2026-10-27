import { wedding } from "@/config/wedding";
import { Monogram } from "./Monogram";
import { Flourish } from "./Ornaments";
import { Reveal } from "./Reveal";

export function Closing() {
  return (
    <footer className="closing">
      <Reveal className="closing__inner">
        <Monogram className="monogram--closing" />
        <Flourish className="closing__flourish" />
        <p className="closing__line">{wedding.copy.closingLine}</p>
        <p className="closing__sign">{wedding.initials}</p>
      </Reveal>
    </footer>
  );
}
