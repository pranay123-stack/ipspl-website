import type { CaseStudy } from "@/lib/types";

/**
 * CASE STUDIES — ALL MOCK CONTENT
 * ===============================
 * No real customer has been named and no real project has been described.
 * Client identities are generic sector descriptors ("CLIENT NAME WITHHELD")
 * and every metric is marked unverified.
 *
 * HANDOVER: replace each entry with a real, approved reference project.
 * Obtain written customer permission before publishing any client name.
 */

export const caseStudies: CaseStudy[] = [
  {
    slug: "chemical-acid-transfer",
    sector: "Chemical Processing",
    client: "Client confidential",
    title: "Corrosion-resistant transfer for concentrated acid service",
    summary:
      "Replacing a repeatedly failing metallic acid line with a fully lined system engineered around the plant's real duty cycle.",
    duty: {
      media: "Concentrated sulphuric acid",
      temperature: "TODO(content): confirm",
      pressure: "TODO(content): confirm",
    },
    scopeSupplied: ["Lined pipe spools", "Elbows and tees", "Isolation valves", "Expansion joints"],
    // TODO(content): measurable outcome, confirmed with the customer
    outcome: undefined,
    imageKey: "caseChemical",
    challenge:
      "A concentrated acid transfer line was failing at welds and flange faces within a fraction of its design life. Each failure forced an unplanned shutdown of the downstream unit, and the inhibitor programme intended to manage the corrosion was adding cost without extending the interval.",
    approach:
      "Rather than replacing like with like, the full chemical inventory was reviewed — including the caustic wash used between campaigns, which had not been considered in the original material selection. Operating and upset temperatures were mapped against the line's real duty cycle to establish liner grade and wall thickness.",
    solution:
      "A complete PTFE lined system was supplied: pipe spools, elbows, tees and isolation valves lined to one specification, with the liner flared over every flange face. Expansion joints were introduced at two locations where thermal growth had previously been transferred into equipment nozzles.",
    result:
      "The line was returned to service within the planned shutdown window.",
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-fittings", "ptfe-lined-valves"],
    seo: {
      title: "Concentrated Acid Line Replacement | Case Study | IPS-PL",
      description:
        "A repeatedly failing metallic acid line replaced with a fully PTFE lined system: pipe, fittings, valves and expansion joints to one specification.",
    },
  },
  {
    slug: "pharma-api-transfer",
    sector: "Pharmaceutical",
    client: "Client confidential",
    title: "High-purity transfer for a multi-product API facility",
    summary:
      "An inert, documented transfer system for a plant running several products through shared equipment.",
    duty: {
      media: "TODO(content): confirm API/solvent",
      temperature: "TODO(content): confirm",
      pressure: "TODO(content): confirm",
    },
    scopeSupplied: ["PFA lined pipework", "Sampling valves", "Dip pipes", "Virgin PTFE gaskets"],
    // TODO(content): measurable outcome, confirmed with the customer
    outcome: undefined,
    imageKey: "casePharma",
    challenge:
      "A multi-product API facility needed transfer lines that would neither contaminate product with metal ions nor retain residue between campaigns. Audit requirements meant every material of construction had to be evidenced, not simply specified.",
    approach:
      "Wetted materials were restricted to virgin fluoropolymer grades. Layouts were reviewed for drainability and dead legs, and sampling points were repositioned so that samples represented the batch rather than stagnant volume in a branch.",
    solution:
      "PFA lined pipework and valves were supplied with virgin PTFE gaskets throughout, together with sampling valves and dip pipes engineered to the existing reactor nozzle geometry. Material traceability and test documentation were issued as part of the delivery package.",
    result:
      "The installation was documented to support audit.",
    productSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves", "dip-pipes", "ptfe-products"],
    seo: {
      title: "High-Purity API Transfer Case Study | Pharma | IPS-PL",
      description:
        "Inert, documented transfer lines for a multi-product API facility: virgin fluoropolymer wetted parts, drainable layouts and representative sampling points.",
    },
  },
  {
    slug: "refinery-effluent",
    sector: "Oil & Gas",
    client: "Client confidential",
    title: "Effluent neutralisation piping on a refinery site",
    summary:
      "Lined piping and expansion provision for an effluent system with aggressive, variable chemistry.",
    duty: {
      media: "Variable-pH effluent, chloride bearing",
      temperature: "TODO(content): confirm",
      pressure: "TODO(content): confirm",
    },
    scopeSupplied: ["Lined pipe and fittings", "Expansion joints", "Lined isolation valves"],
    // TODO(content): measurable outcome, confirmed with the customer
    outcome: undefined,
    imageKey: "caseRefinery",
    challenge:
      "An effluent neutralisation system handled a stream whose pH and chloride content varied with upstream operation. Metallic pipework was thinning unpredictably, and inspection could not reliably determine remaining life between turnarounds.",
    approach:
      "The variability itself was treated as the design condition. Liner selection was made against the full range of the stream rather than its average, and thermal movement along the run was calculated so expansion provision could be designed in rather than added later.",
    solution:
      "PTFE lined pipe and fittings were supplied for the neutralisation circuit, with expansion joints at calculated intervals and lined valves for isolation. Component standardisation across the circuit simplified the site's spares holding.",
    result:
      "The circuit was aligned to the site's turnaround interval.",
    productSlugs: ["ptfe-lined-pipes", "ptfe-bellows", "ptfe-lined-valves"],
    seo: {
      title: "Refinery Effluent Neutralisation Piping | IPS-PL Case Study",
      description:
        "Lined piping for effluent neutralisation on a refinery site, specified around the real duty cycle rather than replacing a failing metallic line like for like.",
    },
  },
  {
    slug: "power-fgd",
    sector: "Power Generation",
    client: "Client confidential",
    title: "FGD absorber dosing and slurry handling",
    summary:
      "Lined dosing lines and expansion joints for a flue gas desulphurisation circuit.",
    duty: {
      media: "FGD reagent slurry",
      temperature: "TODO(content): confirm",
      pressure: "TODO(content): confirm",
    },
    scopeSupplied: ["Lined dosing pipework", "PTFE expansion joints", "Limit hardware"],
    // TODO(content): measurable outcome, confirmed with the customer
    outcome: undefined,
    imageKey: "casePower",
    challenge:
      "Chloride concentration in an FGD absorber circuit had risen with a change in fuel, taking the dosing and recirculation lines outside the envelope their original materials were selected for. Large-bore runs were also transferring thermal load into equipment nozzles.",
    approach:
      "The revised chloride and temperature profile was used to reselect liner grade for the dosing lines, while the thermal profile of the large-bore runs was mapped to size expansion joints against actual rather than nominal movement.",
    solution:
      "Lined dosing pipework and valves were supplied for the reagent circuit, with PTFE expansion joints and limit hardware on the large-bore runs to absorb movement without loading the absorber nozzles.",
    result:
      "Components were specified to be replaceable within the station's outage window.",
    productSlugs: ["ptfe-lined-pipes", "ptfe-bellows", "ptfe-lined-valves"],
    seo: {
      title: "FGD Absorber Dosing & Slurry Handling | IPS-PL Case Study",
      description:
        "Lined dosing and slurry handling for flue gas desulphurisation, engineered around chloride-bearing duty where unlined and coated systems fail at the joint.",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
