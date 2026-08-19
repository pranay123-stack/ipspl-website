import type { Insight } from "@/lib/types";

/**
 * INSIGHTS — MOCK EDITORIAL CONTENT
 * =================================
 * Written as plausible technical editorial for demonstration. Authors are
 * placeholders. Replace with IPS-PL's own articles before launch; the two
 * articles present on the current site (fluoropolymer properties, metal
 * properties) are good candidates to migrate first.
 */

/**
 * TODO(content): name the author of each article.
 *
 * Set `authorPerson: { name, jobTitle, credentials }` on an entry and it
 * appears in the byline and in Article.author as a Person. Obtain the
 * individual's consent first — this publishes their name and role.
 */
export const insights: Insight[] = [
  {
    slug: "selecting-a-fluoropolymer-liner",
    seo: {
      title: "Selecting a Fluoropolymer Liner | Beyond the Chart",
      description:
        "Why a compatibility chart is the start of liner selection, not the end: the full chemical inventory, cleaning agents and upsets all govern the grade.",
    },
    category: "Materials",
    title: "Selecting a fluoropolymer liner: beyond the compatibility chart",
    excerpt:
      "Chemical compatibility tables answer one question. Permeation, thermal cycling and vacuum resistance answer the ones that actually cause failures.",
    date: "2026-06-18",
    tags: ["PTFE", "PFA", "Material selection", "Permeation"],
    imageKey: "insightMaterials",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-lined-pipes", "ptfe-products"],
    blocks: [
      { type: "paragraph", text: "A compatibility chart will tell you whether a polymer is attacked by a given medium at a given concentration and temperature. What it will not tell you is how that polymer behaves over years of thermal cycling, under vacuum, or when the medium contains a trace contaminant nobody listed on the process data sheet." },
      { type: "heading", text: "Permeation" },
      { type: "paragraph", text: "Permeation is the first factor a chart tends to hide. Small molecules migrate through any polymer given time and a concentration gradient. In a lined system this matters because whatever permeates the liner arrives at the steel housing, where it may condense and begin corroding the pressure envelope from the outside of the liner inwards. Wall thickness, liner grade and housing venting are all specified with this in mind." },
      { type: "heading", text: "Thermal cycling" },
      { type: "paragraph", text: "Thermal cycling is the second. Batch plant heats and cools repeatedly, and a liner expands at a very different rate to the steel around it. A system that is dimensionally stable at steady state may not be after two thousand cycles. This is where expansion provision stops being an optional extra." },
      { type: "heading", text: "Vacuum service" },
      { type: "paragraph", text: "Vacuum service is the third, and the one most often discovered late. A liner in tension against its housing behaves quite differently to one being pulled away from it. Distillation, drying and transfer systems that see vacuum need liner thickness and, in some cases, mechanical anchoring specified explicitly for that condition." },
      { type: "heading", text: "Where the chart fits" },
      { type: "paragraph", text: "None of this argues against compatibility charts. It argues for treating them as the beginning of material selection rather than the end of it — which is why we ask for the full chemical inventory, the duty cycle and the upset conditions before recommending a grade." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
  {
    slug: "why-lined-systems-fail-at-the-joint",
    seo: {
      title: "Why Lined Piping Systems Fail at the Joint | IPS-PL",
      description:
        "Lined systems rarely fail in the run. They fail where the liner meets the flange face, which is why the flared joint detail decides the life of the line.",
    },
    category: "Engineering",
    title: "Why lined systems fail at the joint — and what to specify instead",
    excerpt:
      "The pipe body is rarely the problem. Flange faces, branch connections and transitions to unlined plant are where corrosion finds its way in.",
    date: "2026-05-27",
    tags: ["ASTM F1545", "Flange faces", "Failure modes"],
    imageKey: "insightPiping",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-lined-fittings", "ptfe-lined-pipes"],
    blocks: [
      { type: "paragraph", text: "When a lined piping system fails, the failure is usually not in the middle of a straight run. It is at a flange face, a branch connection, or the point where the lined system meets unlined plant." },
      { type: "heading", text: "Why the joint is the weak point" },
      { type: "paragraph", text: "The reason is straightforward. A liner protects the surface it covers. Wherever the liner stops — at a flange face, at a poorly formed flare, at a transition spool — there is an edge, and an edge is where the process finds metal. A system specified as 'lined pipe' without equal attention to how it terminates has simply relocated the corrosion problem to its joints." },
      { type: "heading", text: "Flaring the liner over the flange face" },
      { type: "paragraph", text: "This is why ASTM F1545 specifies flaring the liner over the flange face, so that the liner itself forms the sealing surface. Done properly, the joint carries the same protection as the pipe body and there is no exposed metal in the wetted path at all." },
      { type: "heading", text: "Branch connections and dead legs" },
      { type: "paragraph", text: "Branch connections deserve the same scrutiny. An instrument tee or sample take-off introduces a small-bore dead leg where product can stagnate and concentrate. Lining the branch but not engineering its geometry solves half the problem." },
      { type: "heading", text: "Specify the system, not the components" },
      { type: "paragraph", text: "The practical specification point: buy the system, not the components. When pipe, fittings and valves are lined to one specification and engineered as a matched set, there is no weak link to find. When they are sourced separately against a bill of materials, there usually is." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
  {
    slug: "expansion-joints-in-lined-piping",
    seo: {
      title: "Where Expansion Joints Belong in Lined Piping | IPS-PL",
      description:
        "Thermal growth has to go somewhere. Where expansion joints belong in a lined system, and what reaches equipment nozzles when that movement is not absorbed.",
    },
    category: "Applications",
    title: "Where expansion joints belong in a lined piping system",
    excerpt:
      "Thermal growth has to go somewhere. If the design does not decide where, the equipment nozzles will.",
    date: "2026-04-30",
    tags: ["Bellows", "Thermal movement", "Nozzle loads"],
    imageKey: "insightValves",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-bellows", "ptfe-lined-pipes"],
    blocks: [
      { type: "paragraph", text: "Every piping system grows and shrinks with temperature. In a rigid, well-anchored lined system, that movement has only a few places to go: into the pipe supports, into the flanged joints, or into the nozzles of whatever the line connects to." },
      { type: "heading", text: "The load that reaches equipment nozzles" },
      { type: "paragraph", text: "The last of these is the expensive one. A reactor or column nozzle is not designed to absorb the axial load of a long pipe run cycling through fifty or a hundred degrees. Loads that would be trivial for the pipe can crack a glass lining or distort a nozzle." },
      { type: "heading", text: "Sizing against the real thermal profile" },
      { type: "paragraph", text: "Expansion joints give that movement a designed destination. Sized against the real thermal profile of the run rather than a nominal figure, a bellows absorbs axial, lateral and angular movement while keeping the wetted path fully fluoropolymer." },
      { type: "heading", text: "Placement, anchors and guides" },
      { type: "paragraph", text: "Placement matters as much as sizing. A joint positioned without regard to anchor and guide locations can end up carrying pressure thrust it was never intended to see — which is why limit rods and control hardware are specified as part of the assembly rather than left to the installer." },
      { type: "heading", text: "The design question" },
      { type: "paragraph", text: "The design question is not whether to allow for thermal movement. It is whether the movement is designed into the system, or discovered by the equipment at the end of it." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
  {
    slug: "material-traceability-in-process-plant",
    seo: {
      title: "Material Traceability in Process Plant | IPS-PL Notes",
      description:
        "What process plant auditors actually ask for: heat numbers, test and guarantee certificates, and the documentation chain behind a specified material.",
    },
    category: "Industry",
    title: "Material traceability: what process plant auditors actually ask for",
    excerpt:
      "Specifying a material is one thing. Evidencing what was installed, years later, is another.",
    date: "2026-03-22",
    tags: ["Traceability", "Documentation", "Audit"],
    imageKey: "insightIndustry",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-products", "ptfe-lined-valves"],
    blocks: [
      { type: "paragraph", text: "In regulated process industries, the question is rarely 'what did you specify'. It is 'what did you install, and can you prove it'." },
      { type: "heading", text: "What an auditor asks for" },
      { type: "paragraph", text: "That distinction matters most in pharmaceutical and food-contact plant, where an auditor may ask for the material certificate of a component fitted several years earlier. If the traceability chain was not established at the point of manufacture, it generally cannot be reconstructed afterwards." },
      { type: "heading", text: "What practical traceability means" },
      { type: "paragraph", text: "Practical traceability means the housing heat number and the polymer batch record are captured against the order at manufacture, retained, and issued with the delivery — not filed somewhere and hoped for later." },
      { type: "heading", text: "Test records travel with the goods" },
      { type: "paragraph", text: "It also means test records travel with the goods. A spark test result, a hydrostatic test record and a dimensional report are evidence that the item leaving the works matched the item specified. Issued as a package with the supply, they become part of the plant's own documentation rather than a request the supplier has to answer years later." },
      { type: "heading", text: "Make documentation a line item" },
      { type: "paragraph", text: "For the specifier the practical step is simple: make documentation an explicit line item in the enquiry. What is not asked for at enquiry stage is rarely available at audit stage." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
  {
    slug: "vacuum-service-lined-pipe",
    seo: {
      title: "Designing Lined Pipe for Vacuum Service | IPS-PL Notes",
      description:
        "Vacuum governs liner thickness and support, so it has to be declared at enquiry stage. What changes in a lined pipe specification when the duty is vacuum.",
    },
    category: "Engineering",
    title: "Designing lined pipe for vacuum service",
    excerpt:
      "A liner under vacuum is being pulled away from its housing. That is a different design problem to internal pressure.",
    date: "2026-02-14",
    tags: ["Vacuum", "Liner collapse", "Wall thickness"],
    imageKey: "insightMaterials",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-lined-pipes", "ptfe-lined-fittings"],
    blocks: [
      { type: "paragraph", text: "Internal pressure pushes a liner against its housing, which is the condition most lined pipe is intuitively designed for. Vacuum does the opposite: it pulls the liner inwards, away from the steel supporting it." },
      { type: "heading", text: "What happens when vacuum is not specified" },
      { type: "paragraph", text: "If the liner is not specified for that condition, the result is collapse — sometimes immediately, more often after repeated cycles have worked the liner loose from the bore." },
      { type: "heading", text: "Established design responses" },
      { type: "paragraph", text: "Design responses are well established. Increased wall thickness raises collapse resistance directly. Vacuum-anchored constructions mechanically key the liner to the housing. In some geometries, reinforcement is added at the points of highest differential." },
      { type: "heading", text: "Declare vacuum at enquiry stage" },
      { type: "paragraph", text: "What matters practically is that vacuum is declared at enquiry stage. Distillation, drying, vapour recovery and even routine line-emptying operations can pull a system into vacuum, and it is common for the last of these to go unmentioned on a process data sheet." },
      { type: "callout", tone: "note", text: "The rule of thumb we apply: if the line can be emptied by pump, assume it will see vacuum, and specify accordingly." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
  {
    slug: "ips-pl-engineering-capability",
    seo: {
      title: "Engineering Capability at IPS-PL | Vadodara, India",
      description:
        "How enquiries become specified, manufactured and documented systems at the Vadodara works: process data review, liner selection, fabrication and inspection.",
    },
    category: "Company News",
    title: "Engineering capability at IPS-PL",
    excerpt:
      "How enquiries move from process data to a manufactured, tested and documented system.",
    date: "2026-01-20",
    tags: ["Company", "Engineering process"],
    imageKey: "insightCompany",
    author: "IPS-PL Engineering",
    relatedProductSlugs: ["ptfe-lined-pipes", "ptfe-lined-valves"],
    blocks: [
      { type: "paragraph", text: "An enquiry begins with process data rather than a part number: media, concentration, temperature, pressure and duty cycle. Where a system is being replaced, the failure history of the existing installation is often the most useful single input." },
      { type: "heading", text: "Specification" },
      { type: "paragraph", text: "Engineering then fixes liner grade, wall thickness, geometry and movement provision against that duty, and interfaces are designed to the customer's existing plant and vessel drawings." },
      { type: "heading", text: "Manufacture and inspection" },
      { type: "paragraph", text: "Manufacturing, inspection and testing are carried out in-house, with test and guarantee certificates issued as part of the supply." },
      { type: "heading", text: "Technical enquiries" },
      { type: "paragraph", text: "For technical enquiries, contact the engineering team through the request-a-quote form." },
    ],
    // TODO(content): expand to a published length and add subheadings,
    // lists or a spec table. See docs/content-gaps.md.
    isStub: true,
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

export const insightCategories = [
  "Engineering",
  "Materials",
  "Industry",
  "Applications",
  "Company News",
] as const;
