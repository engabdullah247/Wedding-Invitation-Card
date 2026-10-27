import { wedding } from "@/config/wedding";
import { Flourish } from "./Ornaments";
import { Reveal } from "./Reveal";

type Family = { title: string; father: string; mother: string };

function FamilyCard({ family }: { family: Family }) {
  return (
    <article className="family__card">
      <h3 className="family__title">{family.title}</h3>
      <Flourish className="family__flourish" />
      <dl className="family__list">
        <div>
          <dt>Father</dt>
          <dd>{family.father}</dd>
        </div>
        <div>
          <dt>Mother</dt>
          <dd>{family.mother}</dd>
        </div>
      </dl>
    </article>
  );
}

export function FamilyDetails() {
  return (
    <section className="family" aria-labelledby="family-title">
      <Reveal className="family__inner">
        <p className="eyebrow">With the blessings of</p>
        <h2 id="family-title" className="section-title">
          Our families
        </h2>
        <div className="family__grid">
          <FamilyCard family={wedding.groomFamily} />
          <FamilyCard family={wedding.brideFamily} />
        </div>
      </Reveal>
    </section>
  );
}
