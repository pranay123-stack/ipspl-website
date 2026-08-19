import type { ImageAsset } from "@/lib/types";

/**
 * IMAGE MANIFEST
 * ==============
 * Every image on the site is referenced by key from this file. Components
 * receive keys (e.g. "productValves"), never URLs.
 *
 * All assets are SELF-HOSTED under /public/images. Nothing is hotlinked, so
 * there is no third-party image host to connect to and no risk of a
 * placeholder disappearing from under the site.
 *
 * `isPlaceholder: true` marks licence-free stock standing in for photography
 * IPS-PL has not yet commissioned. `npm run check:images` fails when any
 * placeholder remains, and runs as part of `npm run build` — stock cannot
 * ship to production silently.
 *
 * HANDOVER: replace the file at `src`, update `alt` and `credit`, and set
 * `isPlaceholder: false`. No component changes are needed.
 */

export interface ManifestImage extends ImageAsset {
  /** Attribution for the placeholder source. Clear this with the real photo. */
  credit?: string;
  /** True while this is stock standing in for IPS-PL's own photography. */
  isPlaceholder: boolean;
  /**
   * Visible caption, where the layout renders one (article figures). Distinct
   * from `alt`: alt describes the image for someone who cannot see it, the
   * caption adds what the image alone does not tell a reader who can.
   */
  caption?: string;
  /**
   * What the replacement photograph has to show. Written per slot rather than
   * per subject, because the same subject shot for a 21:9 hero and a 4:3 card
   * are different photographs. Generates docs/photography-brief.md.
   */
  brief?: string;
}

export const images = {
  hero: {
    src: "/images/placeholder/hero.jpg",
    alt: "Process plant piping and distillation columns illuminated at dusk",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Widest available view of a live process plant or of the Vadodara works at dusk. Must survive a 21:9 crop with the left third clear of detail — the headline sits there. Landscape, horizon level.",
  },
  aboutPortrait: {
    src: "/images/placeholder/aboutPortrait.jpg",
    alt: "Monochrome view of process vessels and interconnecting pipework",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Vertical or square-croppable view of IPS-PL's own plant. Reads behind text at low opacity, so tonal and low-contrast beats busy.",
  },
  ctaBackdrop: {
    src: "/images/placeholder/ctaBackdrop.jpg",
    alt: "Industrial pipework and valves in low light",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Dark, low-detail industrial texture — pipework, valve bank, plant at night. Sits under white text at ~20% opacity; anything with bright highlights will fight the type.",
  },
  productPiping: {
    src: "/images/placeholder/productPiping.jpg",
    alt: "Lined process piping runs inside a chemical production facility",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Finished lined spools racked or laid out in the works, tags visible. This is the 'what you receive' shot.",
  },
  productValves: {
    src: "/images/placeholder/productValves.jpg",
    alt: "Industrial valve with handwheel actuator and position indicator",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "IPS-PL's own lined valve range grouped on a bench, largest to smallest. Currently a generic actuated valve that is not yours.",
  },
  productComponents: {
    src: "/images/placeholder/productComponents.jpg",
    alt: "Machined flange rings arranged after finishing",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Flange faces close in, flared PTFE and bolt holes visible. The joint detail the whole pitch rests on.",
  },
  productPtfe: {
    src: "/images/placeholder/productPtfe.jpg",
    alt: "CNC machining centre cutting a component under coolant",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Machined PTFE components arranged on a bench — rod, sheet offcuts, finished parts.",
  },
  linedPipe: {
    src: "/images/placeholder/linedPipe.jpg",
    alt: "Lined pipe spools and supports against a clear sky",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Single lined spool, three-quarter view, both flange faces in frame. Product-page hero: keep the background clean.",
  },
  linedFittings: {
    src: "/images/placeholder/linedFittings.jpg",
    alt: "Pipe elbow and branch fitting assembly",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Elbow and tee together, flared faces toward camera.",
  },
  linedValves: {
    src: "/images/placeholder/linedValves.jpg",
    alt: "Row of industrial valves with red handwheels",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "One lined valve, three-quarter view, body and actuator both readable.",
  },
  bellows: {
    src: "/images/placeholder/bellows.jpg",
    alt: "Interconnected pipe runs with expansion provision",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "An actual PTFE bellows unit with control hardware fitted, convolutions clearly visible.",
  },
  dipPipes: {
    src: "/images/placeholder/dipPipes.jpg",
    alt: "Close view of process pipework and valve connections",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Dip pipe or sparger as supplied, full length if the space allows, holes visible on a sparger.",
  },
  ptfeMoulded: {
    src: "/images/placeholder/ptfeMoulded.jpg",
    alt: "Precision cutting tool machining a component to close tolerance",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "CNC machining a PTFE component, swarf visible. Backs the in-house machining claim.",
  },
  hoses: {
    src: "/images/placeholder/hoses.jpg",
    alt: "Flexible connections and pipework inside a process facility",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Flexible hose assembly coiled with end fittings in frame.",
  },
  industryChemical: {
    src: "/images/placeholder/industryChemical.jpg",
    alt: "Chemical processing plant illuminated at night",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Chemical plant exterior or reactor hall. Landscape, 16:9 safe.",
  },
  industryPharma: {
    src: "/images/placeholder/industryPharma.jpg",
    alt: "Technicians working in a controlled pharmaceutical environment",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Clean, well-lit pharmaceutical process area — stainless and fluoropolymer, no people unless consent is held.",
  },
  industryOilGas: {
    src: "/images/placeholder/industryOilGas.jpg",
    alt: "Oil refinery fractionation towers and process pipework",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Refinery or terminal pipework at scale.",
  },
  industryPetrochemical: {
    src: "/images/placeholder/industryPetrochemical.jpg",
    alt: "Petrochemical complex lit at night",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Petrochemical complex, wide.",
  },
  industryPower: {
    src: "/images/placeholder/industryPower.jpg",
    alt: "Thermal power station with cooling towers",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Power station plant — FGD, ducting or the boiler house.",
  },
  industrySpecialty: {
    src: "/images/placeholder/industrySpecialty.jpg",
    alt: "Chemist handling a reagent flask in a process laboratory",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Small-batch or specialty chemical plant interior.",
  },
  industryFood: {
    src: "/images/placeholder/industryFood.jpg",
    alt: "Process storage silos at a production facility",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Food or beverage process line, hygienic finish visible.",
  },
  industryWater: {
    src: "/images/placeholder/industryWater.jpg",
    alt: "Large-diameter process pipe headers",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Effluent or water treatment plant, tanks and dosing lines.",
  },
  engineeringDesign: {
    src: "/images/placeholder/engineeringDesign.jpg",
    alt: "Machined flanged components resting on engineering drawings",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Engineer at a CAD screen with a real IPS-PL isometric on it. Screen content must be legible and yours.",
  },
  manufacturingFloor: {
    src: "/images/placeholder/manufacturingFloor.jpg",
    alt: "Welding and fabrication work underway on a factory floor",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "The Vadodara works, wide, in operation. The single most important 'made here' shot.",
  },
  manufacturingLining: {
    src: "/images/placeholder/manufacturingLining.jpg",
    alt: "Fabrication work in progress with welding sparks",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Operator flaring a liner over a flange face. The process that defines the product — nothing generic substitutes.",
  },
  manufacturingMachining: {
    src: "/images/placeholder/manufacturingMachining.jpg",
    alt: "Metal component being finished on a grinding machine",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Lathe or mill cutting PTFE, tooling engaged.",
  },
  manufacturingCutting: {
    src: "/images/placeholder/manufacturingCutting.jpg",
    alt: "Profile cutting of plate material with sparks",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Pipe cut to spool length, sparks or swarf, guard in place.",
  },
  manufacturingDetail: {
    src: "/images/placeholder/manufacturingDetail.jpg",
    alt: "Operator finishing a metal component with an angle grinder",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Tight abstract of the liner surface or a flared face. Texture shot, shallow depth of field.",
  },
  engineeringTeam: {
    src: "/images/placeholder/engineeringTeam.jpg",
    alt: "Engineers reviewing equipment data on the shop floor",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "IPS-PL engineers at a drawing or a screen, working. Replaces a shot that reads as a college workshop.",
  },
  engineeringWorkshop: {
    src: "/images/placeholder/engineeringWorkshop.jpg",
    alt: "Operator running industrial machinery on the shop floor",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "The workshop floor mid-job, tools and part in frame.",
  },
  qualityInspection: {
    src: "/images/placeholder/qualityInspection.jpg",
    alt: "Quality technician operating test instrumentation",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Spark test or caliper on a real part, inspector's hands in frame.",
  },
  qualityLab: {
    src: "/images/placeholder/qualityLab.jpg",
    alt: "Laboratory glassware and equipment prepared for testing",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Test bench with instrumentation — whatever IPS-PL actually uses.",
  },
  qualityTesting: {
    src: "/images/placeholder/qualityTesting.jpg",
    alt: "Machined part being measured with a digital caliper",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Hydrostatic test rig with a spool under test, gauge readable.",
  },
  caseChemical: {
    src: "/images/placeholder/caseChemical.jpg",
    alt: "Process plant interior with heavy pipework and structure",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Installed lined pipework in a chemical plant. Customer consent required before publication.",
  },
  casePharma: {
    src: "/images/placeholder/casePharma.jpg",
    alt: "Operators working in a controlled production suite",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Installed pipework in a pharmaceutical facility. Customer consent required.",
  },
  caseRefinery: {
    src: "/images/placeholder/caseRefinery.jpg",
    alt: "Refinery process units under an overcast sky",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Refinery installation, wide. Doubles as the case-studies index hero, so it must hold a 21:9 crop.",
  },
  casePower: {
    src: "/images/placeholder/casePower.jpg",
    alt: "Power station stacks and generating hall beside water",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Power plant installation — FGD or ash handling.",
  },
  insightMaterials: {
    src: "/images/placeholder/insightMaterials.jpg",
    alt: "Metal components laid out on technical drawings",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Fluoropolymer stock in several grades, side by side. Illustrates a materials-selection article.",
  },
  insightPiping: {
    src: "/images/placeholder/insightPiping.jpg",
    alt: "Process plant structure and pipework",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Lined piping detail suited to a technical article opener.",
  },
  insightValves: {
    src: "/images/placeholder/insightValves.jpg",
    alt: "Valve and pipework detail inside a plant",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Valve internals or a sectioned unit, if one exists.",
  },
  insightIndustry: {
    src: "/images/placeholder/insightIndustry.jpg",
    alt: "Material being cut during fabrication",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "Plant-wide context shot for sector commentary.",
  },
  insightCompany: {
    src: "/images/placeholder/insightCompany.jpg",
    alt: "Engineering team working alongside process equipment",
    credit: "Unsplash — licence-free placeholder",
    isPlaceholder: true,
    brief:
      "IPS-PL people or premises — used on company-news articles.",
  },
} as const satisfies Record<string, ManifestImage>;

export type ImageKey = keyof typeof images;

/**
 * Placeholder used while a lazy image decodes. An 8x8 tile of the card
 * surface — without it, lazy images left solid black rectangles on fast
 * scroll. ~100 bytes, inlined, no network request.
 */
export const IMAGE_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFUlEQVR42mPkE5FlwAaYGHCAwSkBADezAE+dyVqbAAAAAElFTkSuQmCC";

/**
 * Resolves an image key to its asset. Falls back to the hero image so a
 * missing key can never crash a page during content migration.
 */
export function getImage(key: string): ManifestImage {
  return (images as Record<string, ManifestImage>)[key] ?? images.hero;
}

/** Every image still standing in for real photography. */
export function placeholderImages(): { key: string; alt: string }[] {
  return Object.entries(images)
    .filter(([, v]) => v.isPlaceholder)
    .map(([key, v]) => ({ key, alt: v.alt }));
}
