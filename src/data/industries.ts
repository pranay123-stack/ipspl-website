import type { Industry } from "@/lib/types";

/**
 * INDUSTRY DATA
 * =============
 * Sectors are drawn from those IPS-PL names on its current site
 * (refineries, pharmaceuticals, power, aviation, detergents, chemicals),
 * expanded into the process-industry segments the product range serves.
 *
 * Every sector below has a full detail page. Adding another industry is a
 * matter of appending one object — no UI changes required.
 */

export const industries: Industry[] = [
  {
    slug: "chemical",
    index: "01",
    title: "Chemical Processing",
    shortDescription:
      "Corrosion-resistant containment for acids, solvents and halogenated media.",
    imageKey: "industryChemical",
    heroImageKey: "industryChemical",
    challenge: {
      title: "Chemistry that attacks the plant it runs through",
      body: "Mineral acids, chlorinated solvents and oxidising media degrade metallic pipework from the inside out. Corrosion is rarely uniform — it concentrates at welds, bends and flange faces, so failures arrive without warning and take a production line with them.",
    },
    solution: {
      title: "A continuous fluoropolymer barrier",
      body: "PTFE-lined piping, fittings and valves place an inert barrier between the process and the pressure envelope. Because the liner is flared over every flange face, the joint is protected to the same standard as the pipe body — removing the point where lined and coated systems usually fail first.",
    },
    applications: [
      "Acid transfer and dosing lines",
      "Solvent recovery and distillation circuits",
      "Chlor-alkali process piping",
      "Reactor charge and discharge lines",
      "Scrubber and effluent treatment duty",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-fittings", "ptfe-lined-valves", "dip-pipes"],
    considerations: [
      { title: "Media compatibility", description: "Liner grade is selected against the full chemical inventory, including trace contaminants and cleaning agents." },
      { title: "Permeation", description: "Small molecules can migrate through any polymer over time. Wall thickness and venting are specified accordingly." },
      { title: "Thermal cycling", description: "Batch operation moves lines through repeated expansion and contraction — expansion joints absorb what the pipe cannot." },
      { title: "Vacuum service", description: "Liner collapse resistance governs design where distillation or drying pulls a line under vacuum." },
    ],
    caseStudySlug: "chemical-acid-transfer",
    seo: {
      title: "Chemical Processing | Corrosion-Resistant Piping Systems",
      description:
        "PTFE lined piping, valves and components for acid, solvent and halogenated service in chemical processing plants.",
    },
  },
  {
    slug: "pharmaceutical",
    index: "02",
    title: "Pharmaceutical",
    shortDescription:
      "High-purity transfer where product contamination is not an option.",
    imageKey: "industryPharma",
    heroImageKey: "industryPharma",
    challenge: {
      title: "The plant must not contaminate the product",
      body: "In API and intermediates manufacture, metal ion pickup, particulates and residual product from a previous campaign are all defects. Materials of construction have to be inert, cleanable and consistent batch after batch.",
    },
    solution: {
      title: "Inert wetted paths and documented traceability",
      body: "PFA and virgin PTFE wetted surfaces give an inert, low-adsorption path with no metal contact. Every component is supplied with material traceability and test documentation, so the installation can be evidenced during audit rather than asserted.",
    },
    applications: [
      "API and intermediate transfer lines",
      "Reactor charge, discharge and sampling",
      "Solvent handling and recovery",
      "Clean-in-place circuits",
      "Multi-product campaign plant",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves", "ptfe-products", "dip-pipes"],
    considerations: [
      { title: "Extractables and leachables", description: "Virgin fluoropolymer grades are specified where any additive migration into product is unacceptable." },
      { title: "Cleanability", description: "Smooth bore transitions and drainable geometry reduce hold-up and cross-contamination between campaigns." },
      { title: "Documentation", description: "Material certificates and test records are supplied as part of the delivery, not retrofitted afterwards." },
      { title: "Sampling integrity", description: "Sampling valves are specified so the sample represents the batch rather than the dead leg." },
    ],
    caseStudySlug: "pharma-api-transfer",
    seo: {
      title: "Pharmaceutical | High-Purity Fluoropolymer Systems",
      description:
        "PFA and PTFE lined piping, valves and components for API, intermediates and high-purity pharmaceutical processing.",
    },
  },
  {
    slug: "oil-gas",
    index: "03",
    title: "Oil & Gas",
    shortDescription:
      "Sour service, produced water and process duty in upstream and midstream plant.",
    imageKey: "industryOilGas",
    heroImageKey: "industryOilGas",
    challenge: {
      title: "Wet, sour and abrasive at the same time",
      body: "Produced water carries chlorides, dissolved acid gases and solids. The combination pits and thins carbon steel quickly, while the remoteness of much of this plant makes unplanned intervention expensive out of all proportion to the component that failed.",
    },
    solution: {
      title: "Lined systems engineered for interval, not just for duty",
      body: "Lined pipe and valves remove the corrosion mechanism instead of managing it with inhibitor programmes and wall-thickness allowance, extending inspection intervals and reducing the number of interventions a remote facility has to plan for.",
    },
    applications: [
      "Produced water handling",
      "Chemical injection systems",
      "Sour service transfer lines",
      "Amine and glycol circuits",
      "Effluent and disposal duty",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves", "flexible-hoses", "ptfe-bellows"],
    considerations: [
      { title: "Rapid gas decompression", description: "Pressure let-down can damage polymers from the inside. Liner selection and venting are specified against the decompression regime." },
      { title: "Solids loading", description: "Where produced fluids carry sand, bore geometry and liner grade are chosen for erosion resistance." },
      { title: "Temperature excursion", description: "Design accounts for upset conditions, not only the normal operating envelope." },
      { title: "Installation access", description: "Spool design considers how the system will actually be installed and maintained on a congested site." },
    ],
    caseStudySlug: "refinery-effluent",
    seo: {
      title: "Oil & Gas | Lined Piping for Sour and Produced Water Service",
      description:
        "PTFE lined piping, valves and hoses for produced water, chemical injection and sour service in oil and gas facilities.",
    },
  },
  {
    slug: "petrochemical",
    index: "04",
    title: "Petrochemical",
    shortDescription:
      "Continuous plant where an unplanned shutdown is the dominant cost.",
    imageKey: "industryPetrochemical",
    heroImageKey: "industryPetrochemical",
    challenge: {
      title: "Availability is the specification",
      body: "Petrochemical trains run for years between turnarounds. A corrosion failure in an ancillary acid or caustic line can stop a unit whose downtime is measured in lost production per hour, which makes the cheapest component the most expensive risk.",
    },
    solution: {
      title: "Components matched to turnaround intervals",
      body: "Lined systems are engineered so that service life aligns with the plant's turnaround cycle. Standardised components and documented traceability also mean replacements can be specified and sourced quickly when they are needed.",
    },
    applications: [
      "Catalyst and additive handling",
      "Acid and caustic circulation",
      "Quench and wash water systems",
      "Effluent neutralisation",
      "Utility interfaces on corrosive duty",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-fittings", "ptfe-bellows", "ptfe-lined-valves"],
    considerations: [
      { title: "Turnaround alignment", description: "Component life is specified against the operator's inspection and turnaround interval." },
      { title: "Thermal growth", description: "Long runs in continuous plant need expansion provision designed in from the outset." },
      { title: "Standardisation", description: "A consistent component set across a site simplifies spares holding and replacement." },
      { title: "Interface control", description: "Connections to existing metallic systems are engineered to avoid a corrosion cell at the transition." },
    ],
    caseStudySlug: "refinery-effluent",
    seo: {
      title: "Petrochemical | Lined Systems for Continuous Plant",
      description:
        "PTFE lined piping systems, fittings and expansion joints for petrochemical plant where availability governs specification.",
    },
  },
  {
    slug: "power",
    index: "05",
    title: "Power Generation",
    shortDescription:
      "Flue gas treatment, water chemistry and effluent handling duty.",
    imageKey: "industryPower",
    heroImageKey: "industryPower",
    challenge: {
      title: "Emissions control creates its own corrosion problem",
      body: "Flue gas desulphurisation and water treatment concentrate chlorides and acids into streams far more aggressive than anything in the main steam cycle. The plant that cleans the emissions is often the plant that corrodes first.",
    },
    solution: {
      title: "Lined equipment on the aggressive side of the process",
      body: "Lined pipe, valves and expansion joints handle FGD slurries, acid dosing and effluent neutralisation. Expansion joints absorb the thermal movement of large-bore ducting runs without transferring load into equipment nozzles.",
    },
    applications: [
      "Flue gas desulphurisation circuits",
      "Demineralisation and water treatment",
      "Acid and caustic dosing systems",
      "Effluent neutralisation",
      "Cooling water chemical injection",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-bellows", "ptfe-lined-valves", "ptfe-lined-fittings"],
    considerations: [
      { title: "Slurry handling", description: "Abrasive solids in FGD service drive liner grade and bore geometry selection." },
      { title: "Large-bore movement", description: "Long ducting runs need expansion joints sized against real thermal profiles." },
      { title: "Load cycling", description: "Plant that follows demand cycles thermally far more than baseload plant does." },
      { title: "Outage windows", description: "Components are specified so replacement fits the available outage duration." },
    ],
    caseStudySlug: "power-fgd",
    seo: {
      title: "Power Generation | FGD and Water Treatment Piping",
      description:
        "PTFE lined piping, valves and expansion joints for flue gas desulphurisation, water treatment and effluent duty in power plant.",
    },
  },
  {
    slug: "specialty-chemicals",
    index: "06",
    title: "Specialty Chemicals",
    shortDescription:
      "Multi-product plant where the chemistry changes between campaigns.",
    imageKey: "industrySpecialty",
    heroImageKey: "industrySpecialty",
    challenge: {
      title: "A different process every campaign",
      body: "Specialty and fine chemical plant is deliberately flexible. The same line may see an acid this month and a solvent the next, so materials cannot be optimised for a single medium — they have to be broadly inert and easy to change over.",
    },
    solution: {
      title: "Broad chemical resistance and fast changeover",
      body: "PTFE's resistance across almost the whole chemical range suits multi-product operation. Flanged, modular construction lets a line be reconfigured between campaigns rather than rebuilt, and smooth bores reduce carry-over between products.",
    },
    applications: [
      "Multi-purpose reactor trains",
      "Batch transfer and dosing",
      "Pigment and dye intermediates",
      "Agrochemical intermediates",
      "Solvent handling and recovery",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves", "dip-pipes", "flexible-hoses"],
    considerations: [
      { title: "Chemical inventory", description: "Liner selection is reviewed against every medium the line will see, not only the primary product." },
      { title: "Changeover time", description: "Modular flanged construction reduces the time a line is out of service between campaigns." },
      { title: "Cross-contamination", description: "Smooth bores and drainable layouts limit residual carry-over between products." },
      { title: "Scale-up", description: "Pilot geometry is engineered so results transfer predictably to production scale." },
    ],
    caseStudySlug: "chemical-acid-transfer",
    seo: {
      title: "Specialty Chemicals | Multi-Product Lined Systems",
      description:
        "PTFE lined piping and valves for specialty and fine chemical plant running multiple products through shared equipment.",
    },
  },
  {
    slug: "food-process",
    index: "07",
    title: "Food & Process",
    shortDescription:
      "Cleanable, inert transfer for food-contact and process utility duty.",
    imageKey: "industryFood",
    heroImageKey: "industryFood",
    challenge: {
      title: "Cleanable, inert and taint-free",
      body: "Food and process plant must be cleaned aggressively and frequently. The CIP chemistry is often harsher than the product itself, and any surface that holds residue or imparts taint becomes a quality and compliance problem.",
    },
    solution: {
      title: "Non-stick surfaces built for repeated cleaning",
      body: "PTFE's non-stick, low-adsorption surface resists fouling and stands up to caustic and acid CIP cycles without degrading, so cleaning regimes do not shorten the life of the transfer system.",
    },
    applications: [
      "CIP chemical distribution",
      "Process utility transfer",
      "Ingredient and additive dosing",
      "Effluent and waste handling",
      "Detergent manufacturing",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-products", "flexible-hoses", "ptfe-lined-valves"],
    considerations: [
      { title: "Food-contact compliance", description: "Grade selection and supporting certification are matched to the customer's regulatory requirement." },
      { title: "CIP chemistry", description: "Cleaning agents and temperatures are treated as a design duty in their own right." },
      { title: "Drainability", description: "Layouts are engineered to drain fully so cleaning is effective and verifiable." },
      { title: "Surface finish", description: "Bore finish is specified to limit adhesion and simplify cleaning." },
    ],
    seo: {
      title: "Food & Process | Cleanable Fluoropolymer Transfer Systems",
      description:
        "PTFE lined piping and components for food, detergent and process utility duty requiring cleanable, inert transfer.",
    },
  },
  {
    slug: "water-industrial",
    index: "08",
    title: "Water & Industrial Processing",
    shortDescription:
      "Chemical dosing, effluent treatment and industrial water systems.",
    imageKey: "industryWater",
    heroImageKey: "industryWater",
    challenge: {
      title: "Dilute, continuous and relentless",
      body: "Water treatment chemistry is dilute but never stops. Continuous dosing of acids, caustics, hypochlorite and coagulants thins metallic pipework steadily, and the failures usually appear in the dosing lines rather than the main flow.",
    },
    solution: {
      title: "Lined dosing and effluent systems",
      body: "Lined piping and valves on the dosing and effluent side remove the corrosion mechanism at its source, keeping treatment plant available and reducing the maintenance burden of continuous chemical service.",
    },
    applications: [
      "Chemical dosing skids",
      "Hypochlorite and acid distribution",
      "Effluent neutralisation",
      "Demineralisation plant",
      "Industrial wastewater treatment",
    ],
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves", "ptfe-lined-fittings", "flexible-hoses"],
    considerations: [
      { title: "Continuous duty", description: "Systems are specified for uninterrupted service rather than intermittent batch operation." },
      { title: "Dilute but aggressive", description: "Low-concentration oxidisers can be more damaging than concentrated acids to the wrong material." },
      { title: "Gas evolution", description: "Hypochlorite and similar media evolve gas; venting and layout are designed accordingly." },
      { title: "Access for maintenance", description: "Dosing skids are laid out so components can be isolated and replaced without stopping treatment." },
    ],
    seo: {
      title: "Water & Industrial Processing | Chemical Dosing Systems",
      description:
        "PTFE lined piping and valves for chemical dosing, effluent neutralisation and industrial water treatment plant.",
    },
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
