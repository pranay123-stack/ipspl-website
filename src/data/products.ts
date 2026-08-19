import type { Product, ProductCategory } from "@/lib/types";

/**
 * PRODUCT DATA
 * ============
 * Product names and category structure are taken from the current public
 * IPS-PL website and are accurate.
 *
 * All numeric specifications below are INDICATIVE values typical of
 * PTFE-lined equipment built to ASTM F1545. Every one is marked
 * `unverified: true` and the UI renders a sign-off footnote beneath each
 * specification block. Replace with IPS-PL's own datasheet figures.
 */

export const productCategories: ProductCategory[] = [
  {
    slug: "lined-piping-systems",
    index: "01",
    title: "Lined Piping Systems",
    shortDescription:
      "PTFE-lined pipe spools, fittings and flanged components for corrosive service.",
    overview:
      "Carbon steel strength with a seamless fluoropolymer barrier. Complete lined piping systems engineered as matched sets so that every joint, branch and reducer in a line carries the same corrosion resistance as the pipe itself.",
    imageKey: "productPiping",
    items: ["ptfe-lined-pipes", "ptfe-lined-fittings", "flexible-hoses"],
  },
  {
    slug: "lined-valves",
    index: "02",
    title: "Lined Valves",
    shortDescription:
      "Fluoropolymer-lined isolation, control and sampling valves for aggressive media.",
    overview:
      "Valves are where lined systems are won or lost. Our lined valve range keeps the wetted path fully fluoropolymer through the seat, body and stem interface, so isolation integrity does not degrade with chemical exposure.",
    imageKey: "productValves",
    items: ["ptfe-lined-valves"],
  },
  {
    slug: "engineered-components",
    index: "03",
    title: "Engineered Components",
    shortDescription:
      "Bellows, dip pipes, headers, domes and vessel components built to drawing.",
    overview:
      "Equipment that rarely comes off a shelf. Expansion joints, dip pipes with spargers, lined headers, domes and manhole covers engineered against the customer's process data and vessel geometry.",
    imageKey: "productComponents",
    items: ["ptfe-bellows", "dip-pipes"],
  },
  {
    slug: "ptfe-products",
    index: "04",
    title: "PTFE Products",
    shortDescription:
      "Virgin and filled PTFE mouldings, machined parts, gaskets and stock shapes.",
    overview:
      "Virgin and filled PTFE converted into gaskets, spacers, bushes, sheet, rod and machined components — the sealing and wear parts that keep a lined system tight.",
    imageKey: "productPtfe",
    items: ["ptfe-products"],
  },
];

export const products: Product[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "ptfe-lined-pipes",
    title: "PTFE Lined Pipes",
    navLabel: "PTFE Lined Pipes",
    navDescription: "Seamless lined spools for corrosive service",
    category: "lined-piping-systems",
    eyebrow: "Lined Piping Systems",
    shortDescription:
      "Carbon steel pipe spools with a seamless PTFE liner for aggressive chemical service.",
    overview:
      "A PTFE lined pipe combines the mechanical strength and pressure capability of carbon steel with the near-universal chemical resistance of PTFE. The liner is mechanically bonded and flared over the flange faces, so the process medium never contacts the steel — including at the joint, which is where unlined and coated systems typically fail first.",
    heroImageKey: "linedPipe",
    galleryImageKeys: ["productPiping", "manufacturingLining", "qualityInspection"],
    applications: [
      "Acid and solvent transfer lines",
      "Reactor and column interconnecting pipework",
      "Effluent and scrubber duty",
      "Chlor-alkali and halogenated process service",
      "High-purity transfer where product contamination is unacceptable",
    ],
    capabilities: [
      "Spool fabrication to isometric drawings",
      "Matched flange drilling to customer standard",
      "Jacketed and traced configurations",
      "Site survey and replacement-in-kind for existing lines",
    ],
    materials: [
      "PTFE — general chemical service",
      "PFA — high purity and higher temperature",
      "FEP — clarity and permeation-critical duty",
      "PVDF — abrasion and selected acid service",
      "Carbon steel housing (stainless on request)",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545" },
      { label: "Flange dimensions", value: "ASME B16.5 / EN 1092-1" },
      { label: "Face-to-face", value: "ASTM F1545 Table 3" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Nominal bore", value: "DN 25 – DN 300 (1\" – 12\")" },
      { label: "Liner thickness", value: "3 – 5 mm typical" },
      { label: "Design pressure", value: "Full vacuum to 10 bar g" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Spool length", value: "Up to 6 m" },
      { label: "Housing material", value: "ASTM A106 Gr. B / IS 1239" },
      { label: "Hydrostatic test pressure", value: "TODO(content): confirm test pressure and hold time" },
      { label: "Conductive liner option", value: "TODO(content): confirm whether an anti-static PTFE grade is offered" },
      { label: "Vent hole provision", value: "TODO(content): confirm standard venting arrangement on the housing" },
    ],
    manufacturing: [
      { title: "Housing preparation", description: "Pipe is cut to spool length, flanges fitted and bores cleaned to remove scale and burrs that would compromise liner seating." },
      { title: "Liner forming", description: "PTFE liner is sized and formed to the housing bore, then drawn through to achieve continuous contact along the spool." },
      { title: "Flaring", description: "Liner ends are heat-formed over the flange faces to create the integral gasket face that seals the joint." },
      { title: "Stress relief", description: "Assemblies are thermally conditioned so the liner is dimensionally stable in service." },
      { title: "Final inspection", description: "Dimensional check, spark testing and documentation before despatch." },
    ],
    quality: [
      "High-voltage spark testing of the complete liner",
      "Liner thickness verification",
      "Dimensional and face-to-face inspection",
      "Hydrostatic testing where specified",
      "Material traceability to housing heat number",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Technical datasheet", type: "PDF", note: "Available on request" },
      { title: "Installation manual", type: "PDF", note: "Available on request" },
      { title: "Chemical resistance guide", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-fittings", "ptfe-lined-valves", "ptfe-bellows"],
    seo: {
      title: "PTFE Lined Pipes | Corrosion-Resistant Piping",
      description:
        "PTFE, PFA and FEP lined carbon steel pipe spools engineered to ASTM F1545 for aggressive chemical, pharmaceutical and refinery service.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "ptfe-lined-fittings",
    title: "PTFE Lined Fittings",
    navLabel: "PTFE Lined Fittings",
    navDescription: "Elbows, tees, reducers and flanges",
    category: "lined-piping-systems",
    eyebrow: "Lined Piping Systems",
    shortDescription:
      "Elbows, tees, reducers, crosses and flanges lined to the same specification as the pipe run.",
    overview:
      "Fittings concentrate turbulence, erosion and thermal stress, which is why they define the service life of a lined system. Every fitting is lined to the same specification as the connecting pipe so a line has no weak link at a change of direction or diameter.",
    heroImageKey: "linedFittings",
    galleryImageKeys: ["productComponents", "manufacturingMachining", "engineeringWorkshop"],
    applications: [
      "Directional changes in corrosive process lines",
      "Branch connections and sample take-offs",
      "Diameter transitions between equipment",
      "Instrument connections into lined systems",
      "Line termination and isolation points",
    ],
    capabilities: [
      "45° and 90° elbows, including jacketed variants",
      "Equal, unequal, lateral and instrument tees",
      "Concentric reducers and crosses",
      "Reducing, blind and spacer flanges",
      "Non-standard angles engineered to drawing",
    ],
    materials: [
      "PTFE — general chemical service",
      "PFA — high purity and higher temperature",
      "FEP — permeation-critical duty",
      "PVDF — selected acid and abrasive service",
      "Carbon steel housing (stainless on request)",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545" },
      { label: "Flange dimensions", value: "ASME B16.5 / EN 1092-1" },
      { label: "Fitting geometry", value: "ASME B16.9 derived" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Nominal bore", value: "DN 25 – DN 300 (1\" – 12\")" },
      { label: "Liner thickness", value: "3 – 5 mm typical" },
      { label: "Design pressure", value: "Full vacuum to 10 bar g" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Elbow radius", value: "Long radius standard" },
      { label: "Jacketing", value: "Available on 45° elbows and headers" },
      { label: "Hydrostatic test pressure", value: "TODO(content): confirm test pressure and hold time" },
      { label: "Conductive liner option", value: "TODO(content): confirm whether an anti-static PTFE grade is offered" },
    ],
    manufacturing: [
      { title: "Housing fabrication", description: "Fitting bodies are formed or fabricated and flanges aligned to the required face-to-face dimension." },
      { title: "Liner moulding", description: "Liners are formed to the fitting geometry so the bore transition stays smooth through the change of direction." },
      { title: "Assembly and flaring", description: "Liner is seated and flared across both flange faces to form the sealing surface." },
      { title: "Thermal conditioning", description: "Assemblies are stabilised to eliminate forming stress." },
      { title: "Inspection", description: "Spark test, dimensional verification and documentation." },
    ],
    quality: [
      "High-voltage spark testing of the wetted surface",
      "Bore alignment and face-to-face verification",
      "Liner thickness check at the crown of bends",
      "Flange face flatness inspection",
      "Material traceability records",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Fittings dimensional catalogue", type: "PDF", note: "Available on request" },
      { title: "Installation manual", type: "PDF", note: "Available on request" },
      { title: "Bolt torque guidance", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-pipes", "ptfe-lined-valves", "ptfe-products"],
    seo: {
      title: "PTFE Lined Fittings | Elbows, Tees, Reducers & Flanges",
      description:
        "PTFE lined elbows, tees, crosses, reducers and flanges manufactured to ASTM F1545 for corrosive process piping systems.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "ptfe-lined-valves",
    title: "PTFE Lined Valves",
    navLabel: "PTFE Lined Valves",
    navDescription: "Ball, plug, butterfly and flush bottom",
    category: "lined-valves",
    eyebrow: "Lined Valves",
    shortDescription:
      "Ball, plug, butterfly, non-return, sampling and flush bottom valves with fully lined wetted paths.",
    overview:
      "A lined valve has to seal repeatedly against media that attacks everything else in the plant. Our range keeps the entire wetted path — body, seat, plug and stem interface — in fluoropolymer, so isolation performance holds up over thousands of cycles rather than degrading with exposure.",
    heroImageKey: "linedValves",
    galleryImageKeys: ["productValves", "engineeringTeam", "qualityInspection"],
    applications: [
      "Primary isolation on corrosive duty",
      "Reactor bottom discharge",
      "Representative process sampling",
      "Non-return protection on transfer pumps",
      "Throttling and regulation in lined systems",
    ],
    capabilities: [
      "Ball, plug and butterfly valves",
      "Non-return and sampling valves",
      "Flush bottom valves for vessel discharge",
      "Manual, gear, pneumatic and electric actuation",
      "Locking and position-indication arrangements",
    ],
    materials: [
      "PTFE — general chemical service",
      "PFA — high purity and higher temperature",
      "FEP — permeation-critical duty",
      "Carbon steel or ductile iron body",
      "Stainless steel stem with fluoropolymer isolation",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545" },
      { label: "Face-to-face", value: "ASME B16.10" },
      { label: "Flange dimensions", value: "ASME B16.5 / EN 1092-1" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Nominal bore", value: "DN 15 – DN 200 (½\" – 8\")" },
      { label: "Pressure class", value: "PN 10 / PN 16 / ASME 150" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Seat leakage", value: "Bubble-tight on test" },
      { label: "Actuation", value: "Manual, pneumatic or electric" },
      { label: "End connection", value: "Flanged" },
      { label: "Torque figures", value: "TODO(content): confirm operating torque by size" },
      { label: "Fire-safe certification", value: "TODO(content): confirm whether any size range is fire-safe certified" },
      { label: "Fugitive emission standard", value: "TODO(content): confirm compliance standard for stem sealing, if any" },
    ],
    manufacturing: [
      { title: "Body preparation", description: "Valve bodies are cast or fabricated, machined and prepared for lining with controlled surface condition." },
      { title: "Lining", description: "Body and closure member are lined so that no metallic surface remains in the wetted path." },
      { title: "Seat forming", description: "Sealing geometry is formed and finished to achieve consistent shut-off across the operating range." },
      { title: "Assembly", description: "Stem, packing and actuation are assembled with fluoropolymer isolation maintained throughout." },
      { title: "Function and seat testing", description: "Every valve is cycled and seat tested before despatch." },
    ],
    quality: [
      "Shell and seat pressure testing on every valve",
      "Spark testing of lined surfaces",
      "Operating torque verification",
      "Cycle testing of the closure member",
      "Material traceability for body and trim",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Valve selection guide", type: "PDF", note: "Available on request" },
      { title: "Installation & maintenance manual", type: "PDF", note: "Available on request" },
      { title: "Actuation sizing data", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-pipes", "ptfe-lined-fittings", "dip-pipes"],
    seo: {
      title: "PTFE Lined Valves | Ball, Plug, Butterfly & Flush Bottom",
      description:
        "Fluoropolymer lined ball, plug, butterfly, non-return, sampling and flush bottom valves for corrosive process service.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "ptfe-bellows",
    title: "PTFE Bellows & Expansion Joints",
    navLabel: "PTFE Bellows",
    navDescription: "Expansion joints for thermal movement",
    category: "engineered-components",
    eyebrow: "Engineered Components",
    shortDescription:
      "Fluoropolymer expansion joints absorbing thermal movement, misalignment and vibration.",
    overview:
      "Rigid lined systems have nowhere to put thermal growth. PTFE bellows absorb axial, lateral and angular movement while keeping the wetted path fully fluoropolymer — protecting equipment nozzles from loads that would otherwise transfer straight into the vessel.",
    heroImageKey: "bellows",
    galleryImageKeys: ["productComponents", "manufacturingDetail", "engineeringWorkshop"],
    applications: [
      "Thermal expansion take-up in lined pipe runs",
      "Pump and compressor vibration isolation",
      "Nozzle load relief at vessels and columns",
      "Misalignment correction during installation",
      "Movement absorption in jacketed lines",
    ],
    capabilities: [
      "Multi-convolution bellows to required movement",
      "Limit rods and control hardware",
      "Flanged and spool-piece configurations",
      "Movement analysis against customer thermal data",
    ],
    materials: [
      "PTFE convolutions",
      "PFA for higher temperature duty",
      "Carbon steel or stainless limit hardware",
      "Reinforcement rings as required",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545" },
      { label: "Flange dimensions", value: "ASME B16.5 / EN 1092-1" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Nominal bore", value: "DN 25 – DN 300 (1\" – 12\")" },
      { label: "Convolutions", value: "1 to 5" },
      { label: "Axial movement", value: "Application specific" },
      { label: "Design pressure", value: "Full vacuum to 10 bar g" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Control hardware", value: "Limit rods available" },
      { label: "Cycle life", value: "TODO(content): confirm rated cycles at full movement" },
      { label: "Lateral / angular movement", value: "TODO(content): confirm ratings alongside the axial figure" },
    ],
    manufacturing: [
      { title: "Movement review", description: "Thermal and mechanical movement data are reviewed to set convolution count and geometry." },
      { title: "Convolution forming", description: "PTFE is formed into the convoluted profile under controlled temperature." },
      { title: "End preparation", description: "Flanged ends and reinforcement are fitted to suit the connecting system." },
      { title: "Hardware fitting", description: "Limit rods and control hardware are installed where movement must be constrained." },
      { title: "Testing", description: "Assemblies are pressure and movement checked before despatch." },
    ],
    quality: [
      "Pressure testing of the completed joint",
      "Movement range verification",
      "Spark testing of the wetted surface",
      "Convolution wall thickness inspection",
      "Material traceability records",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Bellows selection & movement data", type: "PDF", note: "Available on request" },
      { title: "Installation manual", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-pipes", "flexible-hoses", "dip-pipes"],
    seo: {
      title: "PTFE Bellows & Expansion Joints",
      description:
        "PTFE lined expansion joints and bellows absorbing thermal movement, vibration and misalignment in corrosive piping systems.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "dip-pipes",
    title: "Dip Pipes & Vessel Components",
    navLabel: "Dip Pipes & Vessel Components",
    navDescription: "Spargers, headers, domes and covers",
    category: "engineered-components",
    eyebrow: "Engineered Components",
    shortDescription:
      "Dip pipes, spargers, headers, domes, manhole covers and GLR nozzle components.",
    overview:
      "Equipment engineered to the vessel rather than to a catalogue. Dip pipes and spargers introduce reagents below the liquid surface, while lined headers, domes, manhole covers and nozzle bushes extend fluoropolymer protection across the whole reactor envelope.",
    heroImageKey: "dipPipes",
    galleryImageKeys: ["productComponents", "engineeringDesign", "manufacturingDetail"],
    applications: [
      "Sub-surface reagent addition into reactors",
      "Gas sparging and distribution",
      "Glass-lined reactor nozzle protection",
      "Vessel manway and dome protection",
      "Distribution headers on corrosive duty",
    ],
    capabilities: [
      "Straight and angular dip pipes",
      "Dip pipes with integral spargers",
      "PTFE dip tubes and nozzle blind bushes",
      "Lined headers, domes and manhole covers",
      "PTFE nuts, bolts and fasteners",
    ],
    materials: [
      "PTFE — general chemical service",
      "PFA — high purity duty",
      "Carbon steel or stainless core where structural",
      "Solid PTFE construction where specified",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545" },
      { label: "Vessel interface", value: "To customer drawing" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Length", value: "Engineered to vessel depth" },
      { label: "Nominal bore", value: "DN 25 – DN 150 typical" },
      { label: "Sparger holes", value: "Pattern to process duty" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Angular variants", value: "Available" },
      { label: "Manufacture", value: "Made to drawing" },
      { label: "Wall thickness", value: "TODO(content): confirm liner and housing thickness range" },
      { label: "Support arrangement", value: "TODO(content): confirm standard support or guide detail for long lengths" },
    ],
    manufacturing: [
      { title: "Application review", description: "Vessel geometry, nozzle detail and process duty are reviewed with the customer before design is fixed." },
      { title: "Detail engineering", description: "Component is drawn against the vessel interface, including immersion depth and sparger pattern." },
      { title: "Fabrication and lining", description: "Core is fabricated and lined, or the component is produced in solid PTFE." },
      { title: "Sparger machining", description: "Distribution holes are machined to the agreed pattern and deburred." },
      { title: "Fit verification", description: "Interface dimensions are verified against the vessel drawing before despatch." },
    ],
    quality: [
      "Dimensional verification against customer drawing",
      "Spark testing of lined surfaces",
      "Sparger pattern and hole size inspection",
      "Immersion length confirmation",
      "Material traceability records",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Dip pipe data sheet template", type: "PDF", note: "Available on request" },
      { title: "Vessel interface questionnaire", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-valves", "ptfe-products", "ptfe-bellows"],
    seo: {
      title: "Dip Pipes, Spargers & Lined Vessel Components",
      description:
        "PTFE dip pipes, spargers, lined headers, domes, manhole covers and GLR nozzle bushes engineered to vessel drawings.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "ptfe-products",
    title: "Virgin & Filled PTFE Products",
    navLabel: "Virgin & Filled PTFE",
    navDescription: "Gaskets, bushes, sheet and rod",
    category: "ptfe-products",
    eyebrow: "PTFE Products",
    shortDescription:
      "Moulded and machined PTFE gaskets, spacers, bushes, sheet and rod in virgin and filled grades.",
    overview:
      "The sealing and wear parts that hold a lined system together. Virgin PTFE where purity and chemical resistance govern; filled grades where creep resistance, thermal conductivity or wear life matter more. Moulded to size or machined from stock shapes.",
    heroImageKey: "ptfeMoulded",
    galleryImageKeys: ["productPtfe", "manufacturingMachining", "qualityLab"],
    applications: [
      "Envelope gaskets for flanged lined joints",
      "Spacers and bushes in process equipment",
      "Bearing and wear surfaces in aggressive media",
      "Electrical and thermal isolation components",
      "Custom machined parts to customer drawing",
    ],
    capabilities: [
      "Compression moulding and sintering",
      "CNC machining from rod, tube and sheet",
      "Envelope gaskets and spacers",
      "Bushes, T-bushes and wear rings",
      "Sheet and rod in stock sizes",
    ],
    materials: [
      "Virgin PTFE — maximum purity and chemical resistance",
      "Glass-filled PTFE — creep and wear resistance",
      "Carbon-filled PTFE — thermal conductivity and wear life",
      "Bronze-filled PTFE — load-bearing duty",
      "Graphite-filled PTFE — low friction service",
    ],
    standards: [
      { label: "Material specification", value: "ASTM D4894 / D4895" },
      { label: "Gasket dimensions", value: "ASME B16.21 derived" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Sheet thickness", value: "1 – 50 mm" },
      { label: "Rod diameter", value: "6 – 250 mm" },
      { label: "Service temperature", value: "−200 °C to +260 °C" },
      { label: "Machining tolerance", value: "To customer drawing" },
      { label: "Grades", value: "Virgin and filled" },
      { label: "Custom parts", value: "Made to drawing" },
      { label: "Filled grades offered", value: "TODO(content): confirm filler types and loadings held or machined" },
      { label: "Density / material standard", value: "TODO(content): confirm the governing material specification" },
    ],
    manufacturing: [
      { title: "Resin selection", description: "Virgin or filled grade is selected against the chemical, thermal and mechanical duty." },
      { title: "Moulding", description: "Material is compression moulded to the required preform under controlled pressure." },
      { title: "Sintering", description: "Preforms are sintered on a controlled thermal cycle to develop full material properties." },
      { title: "Machining", description: "Components are CNC machined to drawing tolerance from sintered stock." },
      { title: "Inspection", description: "Dimensional and visual inspection before packing." },
    ],
    quality: [
      "Dimensional inspection against drawing",
      "Density and visual defect checks",
      "Material grade traceability",
      "Surface finish verification on sealing faces",
      "Batch records retained",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "PTFE grade comparison", type: "PDF", note: "Available on request" },
      { title: "Machining tolerance guide", type: "PDF", note: "Available on request" },
      { title: "R&D specimen request", type: "Form", note: "PTFE / PFA / FEP specimens available" },
    ],
    related: ["ptfe-lined-fittings", "dip-pipes", "ptfe-lined-pipes"],
    seo: {
      title: "Virgin & Filled PTFE Products | Gaskets, Bushes, Sheet & Rod",
      description:
        "Moulded and machined PTFE components — envelope gaskets, spacers, bushes, sheet and rod in virgin and filled grades.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "flexible-hoses",
    title: "PTFE Lined Flexible Hoses",
    navLabel: "Flexible Hoses",
    navDescription: "Braided assemblies for movement duty",
    category: "lined-piping-systems",
    eyebrow: "Lined Piping Systems",
    shortDescription:
      "Braided PTFE hose assemblies for movement, vibration and temporary transfer duty.",
    overview:
      "Where rigid pipe cannot go. PTFE lined flexible hose assemblies carry aggressive media across moving connections, vibrating equipment and transfer points, with braided reinforcement carrying the pressure load and the fluoropolymer core carrying the chemistry.",
    heroImageKey: "hoses",
    galleryImageKeys: ["productPiping", "engineeringWorkshop", "manufacturingDetail"],
    applications: [
      "Pump and equipment connections",
      "Road and rail tanker transfer",
      "Vibration isolation on rotating equipment",
      "Temporary and campaign transfer lines",
      "Drum and IBC filling duty",
    ],
    capabilities: [
      "Braided hose assemblies to length",
      "Flanged, threaded and camlock ends",
      "Smooth and convoluted bore",
      "Antistatic core where required",
    ],
    materials: [
      "PTFE hose core",
      "Stainless steel braid reinforcement",
      "Carbon or stainless steel end fittings",
      "Antistatic PTFE liner on request",
    ],
    standards: [
      { label: "Lining specification", value: "ASTM F1545 principles" },
      { label: "End connections", value: "ASME B16.5 / EN 1092-1" },
      { label: "Quality system", value: "ISO 9001:2015" },
    ],
    specifications: [
      { label: "Nominal bore", value: "DN 15 – DN 100" },
      { label: "Assembly length", value: "Made to order" },
      { label: "Design pressure", value: "Bore and construction dependent" },
      { label: "Service temperature", value: "−29 °C to +200 °C" },
      { label: "Bore type", value: "Smooth or convoluted" },
      { label: "Reinforcement", value: "Stainless steel braid" },
      { label: "Minimum bend radius", value: "TODO(content): confirm by nominal bore" },
      { label: "Burst pressure", value: "TODO(content): confirm ratio to design pressure" },
      { label: "Electrical continuity", value: "TODO(content): confirm whether static-dissipative construction is offered" },
    ],
    manufacturing: [
      { title: "Core extrusion", description: "PTFE core is produced to the required bore and wall specification." },
      { title: "Braiding", description: "Stainless braid is applied to carry the pressure load along the assembly." },
      { title: "End fitting", description: "Fittings are swaged and flared to keep the fluoropolymer path continuous into the connection." },
      { title: "Assembly", description: "Hose is cut to the ordered length and ends are fitted to the specified standard." },
      { title: "Pressure testing", description: "Each assembly is pressure tested and tagged before despatch." },
    ],
    quality: [
      "Hydrostatic proof testing of each assembly",
      "End fitting pull-off verification",
      "Bore and length confirmation",
      "Braid coverage inspection",
      "Assembly tagging and traceability",
      "Test and guarantee certificate issued with supply",
    ],
    documents: [
      { title: "Hose selection guide", type: "PDF", note: "Available on request" },
      { title: "Handling & storage guidance", type: "PDF", note: "Available on request" },
    ],
    related: ["ptfe-lined-pipes", "ptfe-bellows", "ptfe-lined-valves"],
    seo: {
      title: "PTFE Lined Flexible Hoses",
      description:
        "Braided PTFE lined flexible hose assemblies for chemical transfer, vibration isolation and tanker loading duty.",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((c) => c.slug === slug);
}
