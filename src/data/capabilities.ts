import type { CapabilityStep } from "@/lib/types";

/**
 * ENGINEERING PROCESS & MANUFACTURING CAPABILITIES
 * Positions IPS-PL as an engineering organisation rather than a catalogue
 * supplier. Copy is descriptive of process, not of unverified capacity.
 */

export const engineeringProcess: CapabilityStep[] = [
  {
    index: "01",
    title: "Understand",
    description:
      "Process data before product selection. Media, concentration, temperature, pressure and duty cycle are established first.",
    detail: [
      "Chemical inventory review including cleaning agents",
      "Operating and upset condition envelope",
      "Existing failure history where a system is being replaced",
      "Site, layout and installation constraints",
    ],
  },
  {
    index: "02",
    title: "Engineer",
    description:
      "Material grade, liner thickness, geometry and movement provision are specified against the duty rather than a catalogue.",
    detail: [
      "Liner grade selection — PTFE, PFA, FEP or PVDF",
      "Wall thickness and vacuum resistance assessment",
      "Thermal movement and expansion provision",
      "Interface design to existing plant and vessels",
    ],
  },
  {
    index: "03",
    title: "Manufacture",
    description:
      "Housing preparation, lining, forming and thermal conditioning carried out in-house under controlled process parameters.",
    detail: [
      "Housing fabrication and bore preparation",
      "Liner forming, drawing and flaring",
      "Controlled sintering and stress relief",
      "CNC machining of fluoropolymer components",
    ],
  },
  {
    index: "04",
    title: "Inspect",
    description:
      "Verification against specification at each stage, with the evidence retained and issued rather than assumed.",
    detail: [
      "High-voltage spark testing of wetted surfaces",
      "Liner thickness and dimensional verification",
      "Hydrostatic and seat testing where specified",
      "Material traceability to heat and batch number",
    ],
  },
  {
    index: "05",
    title: "Deliver",
    description:
      "Protected despatch with documentation, installation guidance and continuing technical support.",
    detail: [
      "Test and guarantee certificates issued with supply",
      "Installation manuals and torque guidance",
      "Protective packing for transit and storage",
      "Emergency response for breakdown requirements",
    ],
  },
];

/** Manufacturing stages shown in the immersive manufacturing section. */
export const manufacturingStages = [
  {
    index: "01",
    title: "Fabrication",
    description: "Housings cut, welded and prepared with bore condition controlled for liner seating.",
    imageKey: "manufacturingCutting",
  },
  {
    index: "02",
    title: "Lining",
    description: "Fluoropolymer liners formed, drawn and flared to create a continuous wetted barrier.",
    imageKey: "manufacturingLining",
  },
  {
    index: "03",
    title: "Machining",
    description: "CNC machining of PTFE components and sealing faces to drawing tolerance.",
    imageKey: "manufacturingMachining",
  },
  {
    index: "04",
    title: "Inspection",
    description: "Dimensional, spark and pressure verification before any item is released.",
    imageKey: "qualityInspection",
  },
  {
    index: "05",
    title: "Testing",
    description: "Functional and hydrostatic testing with results recorded against the order.",
    imageKey: "qualityTesting",
  },
];

/** Quality pillars for the quality section. */
export const qualityPillars = [
  {
    index: "01",
    title: "Quality Control",
    description: "Inspection built into each production stage rather than applied as a final gate.",
  },
  {
    index: "02",
    title: "Material Traceability",
    description: "Housing heat numbers and polymer batch records retained against every order.",
  },
  {
    index: "03",
    title: "Testing",
    description: "Spark, hydrostatic and seat testing carried out and recorded before release.",
  },
  {
    index: "04",
    title: "Inspection",
    description: "Dimensional and visual verification against drawing and specification.",
  },
  {
    index: "05",
    title: "Documentation",
    description: "Test and guarantee certificates issued with supply as standard.",
  },
  {
    index: "06",
    title: "Standards",
    description: "Manufactured to ASTM F1545 under an ISO 9001:2015 quality system.",
  },
];
