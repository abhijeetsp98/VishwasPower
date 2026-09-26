import mongoose from "mongoose";

// ─── STAGE 0 — Unloading Checklist ───────────────────────────────────────────

const UnloadingCheckRowSchema = new mongoose.Schema(
  {
    status:    { type: String, trim: true, default: "" },
    remarks:   { type: String, trim: true, default: "" },
    date:      { type: String, trim: true, default: "" },
    checkedBy: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage0Form1SubSchema = new mongoose.Schema(
  {
    vpesRepresentative:    { type: String, trim: true, default: "" },
    date:                  { type: String, trim: true, default: "" },
    customerRepresentative:{ type: String, trim: true, default: "" },
    contactNo:             { type: String, trim: true, default: "" },
    routeCondition:   { type: UnloadingCheckRowSchema, default: () => ({}) },
    siteCondition:    { type: UnloadingCheckRowSchema, default: () => ({}) },
    approachRoad:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    boundaryWall:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    securityGuard:    { type: UnloadingCheckRowSchema, default: () => ({}) },
    vpesSignature:         { type: String, trim: true, default: "" },
    vpesSignatureDate:     { type: String, trim: true, default: "" },
    customerSignature:     { type: String, trim: true, default: "" },
    customerSignatureDate: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage0Form2SubSchema = new mongoose.Schema(
  {
    entryToTSS:           { type: UnloadingCheckRowSchema, default: () => ({}) },
    trailerMovement:      { type: UnloadingCheckRowSchema, default: () => ({}) },
    hydraBoomMovement:    { type: UnloadingCheckRowSchema, default: () => ({}) },
    unloadingPoint:       { type: UnloadingCheckRowSchema, default: () => ({}) },
    dateOfTrailerReached: { type: UnloadingCheckRowSchema, default: () => ({}) },
    dateOfUnloading:      { type: UnloadingCheckRowSchema, default: () => ({}) },
    aestheticRemarks:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    wheelLocking:         { type: UnloadingCheckRowSchema, default: () => ({}) },
    allSealChecks:        { type: UnloadingCheckRowSchema, default: () => ({}) },
    afterUnloadingPhotos: { type: UnloadingCheckRowSchema, default: () => ({}) },
    togLevelCheck:        { type: UnloadingCheckRowSchema, default: () => ({}) },
    trsCoveringPhoto:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    signAndStampCopy:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    vpesSignature:              { type: String, trim: true, default: "" },
    vpesSignatureDate:          { type: String, trim: true, default: "" },
    representativeSignature:    { type: String, trim: true, default: "" },
    representativeSignatureDate:{ type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const AccessoriesInventoryRowSchema = new mongoose.Schema(
  {
    packingCaseNumber:   { type: String, trim: true, default: "" },
    materialDescription: { type: String, trim: true, default: "" },
    qtyAsPerChallan:     { type: String, trim: true, default: "" },
    qtyAsReceived:       { type: String, trim: true, default: "" },
    date:                { type: String, trim: true, default: "" },
    checkedBy:           { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage0Form3SubSchema = new mongoose.Schema(
  {
    accessoriesUnloadingPoint: { type: UnloadingCheckRowSchema, default: () => ({}) },
    dateOfUnloading:           { type: UnloadingCheckRowSchema, default: () => ({}) },
    storagePhotos:             { type: UnloadingCheckRowSchema, default: () => ({}) },
    accessoriesInventory: { type: [AccessoriesInventoryRowSchema], default: () => [] },
    remark: { type: String, trim: true, default: "" },
    vpesSignature:         { type: String, trim: true, default: "" },
    vpesSignatureDate:     { type: String, trim: true, default: "" },
    customerSignature:     { type: String, trim: true, default: "" },
    customerSignatureDate: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────

// --- Sub-schemas for the forms to be nested inside the main schema ---

// Sub-schema for Stage 1 Form 1 (Transformer Details)
const Stage1Form1SubSchema = new mongoose.Schema(
  {
    make: { type: String, trim: true, default: "" },
    currentHV: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    currentLV: { type: String, trim: true, default: "" },

    mvaRating: { type: String, trim: true, default: "" },
    tempRiseOilC: { type: String, trim: true, default: "" },

    hvKv: { type: String, trim: true, default: "" },
    windingC: { type: String, trim: true, default: "" },

    lvKv: { type: String, trim: true, default: "" },
    oilQuantity: { type: String, trim: true, default: "" },

    impedancePercent: { type: String, trim: true, default: "" },
    weightCoreWdg: { type: String, trim: true, default: "" },

    yearOfMfg: { type: String, trim: true, default: "" },
    transportingWeight: { type: String, trim: true, default: "" },

    noOfCoolingFan: { type: String, trim: true, default: "" },
    totalWeight: { type: String, trim: true, default: "" },

    noOfOilPump: { type: String, trim: true, default: "" },
    noOfRadiators: { type: String, trim: true, default: "" },

    noOfTaps: { type: String, trim: true, default: "" },
    mfgOfOctc: { type: String, trim: true, default: "" },

    typeOfOctc: { type: String, trim: true, default: "" },
    srNoOctc: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 2 (Accessories Details)
const AccessoryItemSchema = new mongoose.Schema(
  {
    packingCase: { type: String, trim: true, default: "" },
    qtyPerPL: { type: String, trim: true, default: "" },
    qtyReceived: { type: String, trim: true, default: "" },
    shortQty: { type: String, trim: true, default: "" },
    damagedQty: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form2RowSubSchema = new mongoose.Schema(
  {
    packingCaseNumber: { type: String, trim: true, default: "" },
    materialDescription: { type: String, trim: true, default: "" },
    qtyAsPerPL: { type: String, trim: true, default: "" },
    qtyReceived: { type: String, trim: true, default: "" },
    shortQty: { type: String, trim: true, default: "" },
    damagedQty: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form2SubSchema = new mongoose.Schema(
  {
    accessoriesRows: { type: [Stage1Form2RowSubSchema], default: [] },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 3 (Core insulation + Equipment checklist + Safety equipment)
const CoreInsulationRowSubSchema = new mongoose.Schema(
  {
    obtainedValue: { type: String, trim: true, default: "" },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form3EquipmentRowSubSchema = new mongoose.Schema(
  {
    srNo: { type: Number, default: 0 },
    description: { type: String, trim: true, default: "" },
    ratingCapacity: { type: String, trim: true, default: "" },
    checkedBy: { type: String, trim: true, default: "" },
    ratingHint: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form3SafetyRowSubSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true, default: "" },
    confirmation: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form3SubSchema = new mongoose.Schema(
  {
    coreInsulation: {
      coreToFrame: { type: CoreInsulationRowSubSchema, default: () => ({}) },
      frameToTank: { type: CoreInsulationRowSubSchema, default: () => ({}) },
      coreToTank: { type: CoreInsulationRowSubSchema, default: () => ({}) },
    },

    equipment: { type: [Stage1Form3EquipmentRowSubSchema], default: [] },
    safety: { type: [Stage1Form3SafetyRowSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage1Form4CTRatioRowSubSchema = new mongoose.Schema(
  {
    appliedPrimaryCurrentA: { type: String, trim: true, default: "" },
    measuredSecondaryCurrentA: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form4KneePointRowSubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    measuredCurrentA: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 4 (Pre erection Ratio test of turret CTs - Phase 1.1 & 1.2)
const Stage1Form4SubSchema = new mongoose.Schema(
  {
    phase11: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
    phase12: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 1 Form 5 (Pre erection Ratio test of turret CTs - Phase 2.1 & 2.2)
 * Matches frontend Stage1Form5 in VConnected63MVATransformerForms.js
 */
const Stage1Form5SubSchema = new mongoose.Schema(
  {
    phase21: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
    phase22: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 1 Form 6 (Pre erection Ratio test of turret CTs - Phase 3.1 & 3.2 + WTI)
 * Matches frontend Stage1Form6 in VConnected63MVATransformerForms.js
 */
const Stage1Form6WTIRowSubSchema = new mongoose.Schema(
  {
    appliedPrimaryCurrentA: { type: String, trim: true, default: "" },
    measuredSecondaryCurrentS1S2A: { type: String, trim: true, default: "" },
    measuredSecondaryCurrentS1S3A: { type: String, trim: true, default: "" },
    measuredSecondaryCurrentS1S4A: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form6SubSchema = new mongoose.Schema(
  {
    phase31: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
    phase32: {
      ctRatioCoreS1S2: { type: Map, of: Stage1Form4CTRatioRowSubSchema, default: {} },
      kneePointVoltage: { type: Map, of: Stage1Form4KneePointRowSubSchema, default: {} },
    },
    wti: { type: Map, of: Stage1Form6WTIRowSubSchema, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 1 Form 7 (Tan Delta & Capacitance test on bushing)
 * Matches frontend Stage1Form7 in VConnected63MVATransformerForms.js
 */
const Stage1Form7StatusRowSubSchema = new mongoose.Schema(
  {
    phase: { type: String, trim: true, default: "" },
    tanDeltaPercent: { type: String, trim: true, default: "" },
    capacitancePf: { type: String, trim: true, default: "" },
    excitationCurrent: { type: String, trim: true, default: "" },
    dielectricLoss: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage1Form7SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    modelAndSerialNo: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },

    // added as per updated Stage1Form7 UI
    hvBushingSrNo: { type: String, trim: true, default: "" },
    hvBushingMake: { type: String, trim: true, default: "" },
    lvBushingSrNo: { type: String, trim: true, default: "" },
    lvBushingMake: { type: String, trim: true, default: "" },

    // HV bushing serials table (1.1 / 1.2 columns)
    bushingSrNoHv: { type: String, trim: true, default: "" },
    bushingSrNoHv_11: { type: String, trim: true, default: "" },
    bushingSrNoHv_12: { type: String, trim: true, default: "" },

    hvAt5kv: { type: [Stage1Form7StatusRowSubSchema], default: [] },
    hvAt10kv: { type: [Stage1Form7StatusRowSubSchema], default: [] },

    // LV bushing serials table (2.1 / 2.2 / 3.1 / 3.2 columns)
    bushingSrNoLv: { type: String, trim: true, default: "" },
    bushingSrNoLv_21: { type: String, trim: true, default: "" },
    bushingSrNoLv_22: { type: String, trim: true, default: "" },
    bushingSrNoLv_31: { type: String, trim: true, default: "" },
    bushingSrNoLv_32: { type: String, trim: true, default: "" },

    lvAt5kv: { type: [Stage1Form7StatusRowSubSchema], default: [] },
    lvAt10kv: { type: [Stage1Form7StatusRowSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 1 Form 8 (Record of Measurement of IR Values - Before Erection)
 * Matches frontend Stage1Form8 in VConnected63MVATransformerForms.js
 */
const Stage1Form8SubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },

    make: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_10sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_10sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_10sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_10sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_10sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Reservoir Tank Filtration rows used in Stage 2 Form 1
 * Matches filtrationRecords structure in frontend Stage2Form1
 */
const Stage2Form1FiltrationRecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    inletTemp: { type: String, trim: true, default: "" },
    outletTemp: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 2 Form 1
 * TEST VALUES PRIOR TO FILTERATION
 * - Record of Oil Filling in the Reservoirs Tank
 * - Reservoir Tank Filtration
 * Matches frontend Stage2Form1 in VConnected63MVATransformerForms.js
 *
 * NOTE: Keep this schema limited to only the fields present in the Stage2Form1 UI.
 */
const Stage2Form1SubSchema = new mongoose.Schema(
  {
    reservoirTanks: {
      tank1: {
        noOfBarrels: { type: String, trim: true, default: "" },
        startedOn: { type: String, trim: true, default: "" }, // datetime-local string
        completedOn: { type: String, trim: true, default: "" }, // datetime-local string
        bdv: { type: String, trim: true, default: "" },
        ppm: { type: String, trim: true, default: "" },
      },
      tank2: {
        noOfBarrels: { type: String, trim: true, default: "" },
        startedOn: { type: String, trim: true, default: "" },
        completedOn: { type: String, trim: true, default: "" },
        bdv: { type: String, trim: true, default: "" },
        ppm: { type: String, trim: true, default: "" },
      },
      tank3: {
        noOfBarrels: { type: String, trim: true, default: "" },
        startedOn: { type: String, trim: true, default: "" },
        completedOn: { type: String, trim: true, default: "" },
        bdv: { type: String, trim: true, default: "" },
        ppm: { type: String, trim: true, default: "" },
      },
    },

    filtrationRecords: { type: [Stage2Form1FiltrationRecordSubSchema], default: [] },

    // photoKey -> stored URL/path (uploaded file handled separately)
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 2 Form 2 (Line Lead Clearance + IR Values After Erection + Oil values)
// Matches frontend Stage2Form2 in VConnected63MVATransformerForms.js
const Stage2Form2SubSchema = new mongoose.Schema(
  {
    // Line Lead Clearance in mm
    hv_earth_11: { type: String, trim: true, default: "" },
    hv_earth_12: { type: String, trim: true, default: "" },
    lv1_earth_21: { type: String, trim: true, default: "" },
    lv1_earth_22: { type: String, trim: true, default: "" },
    lv2_earth_31: { type: String, trim: true, default: "" },
    lv2_earth_32: { type: String, trim: true, default: "" },

    // IR Values After erection - header fields
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    // IR measurements (15s / 60s / ratio)
    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_15sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_15sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_15sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_15sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_15sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    // Before oil filling in main tank
    bdv: { type: String, trim: true, default: "" },
    waterContent: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --- SUB-SCHEMAS FOR STAGE 3 ---

/**
 * Sub-schema for pressure test records - Stage 3 Form 1
 * Matches `pressureTests` rows in VacuumCycleRecordingForm (Stage3Form1) frontend
 */
const PressureTestRecordSubSchema = new mongoose.Schema(
  {
    timeStarted: { type: String, trim: true, default: "" },
    pressure: { type: String, trim: true, default: "" },
    tempAmb: { type: String, trim: true, default: "" },
    tempOti: { type: String, trim: true, default: "" },
    tempWti: { type: String, trim: true, default: "" },
  },
  { _id: false }
)

/**
 * Sub-schema for Stage 3 Form 1 (Vacuum Cycle Recording + IR after topping + Pressure test)
 * Matches frontend VacuumCycleRecordingForm in VConnected63MVATransformerForms.js
 */
const Stage3Form1SubSchema = new mongoose.Schema(
  {
    // Vacuum cycle header
    vacuumHoseCheckedBy: { type: String, trim: true, default: "" },
    vacuumHoseConnectedTo: { type: String, trim: true, default: "" },
    evacuationStartedAt: { type: String, trim: true, default: "" },
    evacuationStartedOn: { type: String, trim: true, default: "" },

    // Vacuum cycle table
    vacuumRecords: [
      {
        date: { type: String, trim: true, default: "" },
        time: { type: String, trim: true, default: "" },
        vacuumLevelMic: { type: String, trim: true, default: "" },
        vacuumLevelTransformer: { type: String, trim: true, default: "" },
      },
    ],

    // IR After oil Topping up To Conservator - header fields (matches frontend Stage3Form1)
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    // IR After oil Topping up To Conservator (15s / 60s / ratio)
    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_15sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_15sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_15sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_15sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_15sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    // Pressure Test Report
    pressureTestDate: { type: String, trim: true, default: "" },
    pressureTests: { type: [PressureTestRecordSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
)


// --- SUB-SCHEMAS FOR STAGE 4 ---

// Sub-schema for voltage ratio test records
const VoltageRatioTestSubSchema = new mongoose.Schema(
  {
    appliedVoltage11_12: { type: String, trim: true, default: "" },
    measuredVoltage11_21: { type: String, trim: true, default: "" },
    measuredVoltage12_21: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for magnetising test records
const MagnetisingTestSubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    measuredCurrent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for signatures
const SignatureSubSchema = new mongoose.Schema(
  {
    vpesName: { type: String, trim: true },
    vpesSignature: { type: String, trim: true }, // Storing base64 image data as a string
    customerName: { type: String, trim: true },
    customerSignature: { type: String, trim: true }, // Storing base64 image data as a string
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 1 (Record for Oil Filtration - Main Tank)
// Matches frontend Stage4Form1 in VConnected63MVATransformerForms.js
const Stage4Form1FiltrationRecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    mcOutletTemp: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage4Form1SubSchema = new mongoose.Schema(
  {
    filtrationRecords: { type: [Stage4Form1FiltrationRecordSubSchema], default: [] },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 2 (IR Value before radiator/combine filtration + Cooler Bank Filtration)
// Matches frontend Stage4Form2 in VConnected63MVATransformerForms.js
const Stage4Form2CoolerBankRecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    mcOutletTemp: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage4Form2SubSchema = new mongoose.Schema(
  {
    // IR values (these are the ones used by the current frontend Stage4Form2 table)
    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_10sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_10sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_10sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_10sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_10sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    // Cooler bank filtration records
    coolerBankRecords: { type: [Stage4Form2CoolerBankRecordSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 3 (Oil filtration of Combine - Main Tank + Cooler bank)
// Matches frontend Stage4Form3 in VConnected63MVATransformerForms.js
const Stage4Form3CombineRecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    mcOutletTemp: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage4Form3SubSchema = new mongoose.Schema(
  {
    combineRecords: { type: [Stage4Form3CombineRecordSubSchema], default: [] },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 4 Form 4 (IR & PI Value after filtration)
 * Matches frontend Stage4Form4 in VConnected63MVATransformerForms.js
 */
const Stage4Form4SubSchema = new mongoose.Schema(
  {
    // IR & PI Value after filtration (as per frontend Stage4Form4)
    // NOTE: Frontend does not currently render the header fields (date/time/temps etc.)
    // but we keep them for completeness + backward compatibility.
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    // IR & PI measurements (10 / 60 / 600 sec + PI)
    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_600sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_10sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_600sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_10sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_600sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_10sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_600sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_10sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_600sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_10sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_600sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    // After Oil Filtration of main tank
    bdv: { type: String, trim: true, default: "" },
    waterContent: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --- SUB-SCHEMAS FOR STAGE 5 ---

// Sub-schema for valve status and air venting
const StatusQtySubSchema = new mongoose.Schema(
  {
    qty: { type: String, trim: true, default: "" },
    status: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for protection trails
const ProtectionTrailsSubSchema = new mongoose.Schema(
  { checked: { type: String, trim: true, default: "" } },
  { _id: false }
);

// Sub-schema for bushing test tap
const BushingTestTapSubSchema = new mongoose.Schema(
  {
    hvTestCapEarthed: { type: String, trim: true, default: "" },
    lvTestCapEarthed: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for a more detailed signatures object
const DetailedSignatureSubSchema = new mongoose.Schema(
  {
    vpesName: { type: String, trim: true, default: "" },
    vpesDesignation: { type: String, trim: true, default: "" },
    vpesSignature: { type: String, trim: true, default: "" },
    vpesDate: { type: String, trim: true, default: "" },
    customerName: { type: String, trim: true, default: "" },
    customerDesignation: { type: String, trim: true, default: "" },
    customerSignature: { type: String, trim: true, default: "" },
    customerDate: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 5 Form 1 (SFRA Test Record + IR Values)
 * Matches frontend Stage5Form1 in VConnected63MVATransformerForms.js
 */
const Stage5Form1SubSchema = new mongoose.Schema(
  {
    // SFRA header
    makeOfMeter: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
    testReportReviewedBy: { type: String, trim: true, default: "" },
    acceptanceOfTest: { type: String, trim: true, default: "" },

    // IR header (names prefixed with `ir` in frontend)
    irDate: { type: String, trim: true, default: "" },
    irTime: { type: String, trim: true, default: "" },
    irAmbTemp: { type: String, trim: true, default: "" },
    irOilTemp: { type: String, trim: true, default: "" },
    irWdgTemp: { type: String, trim: true, default: "" },
    irRelativeHumidity: { type: String, trim: true, default: "" },
    irMake: { type: String, trim: true, default: "" },
    irSrNo: { type: String, trim: true, default: "" },
    irRange: { type: String, trim: true, default: "" },
    irVoltageLevel: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },

    // IR table values (15s/60s/ratio)
    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_15sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    lv2Earth_15sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_15sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    hvLv2_15sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_ratio: { type: String, trim: true, default: "" },

    lv1Lv2_15sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 5 Form 2 (RATIO TEST)
 * Matches frontend Stage5Form2 in VConnected63MVATransformerForms.js
 */
const Stage5Form2TapRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    namePlateRatio: { type: String, trim: true, default: "" },
    measuredRatio: { type: String, trim: true, default: "" },
    deviationPercent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form2RatioSetSubSchema = new mongoose.Schema(
  {
    namePlateText: { type: String, trim: true, default: "" },
    measuredText: { type: String, trim: true, default: "" },
    taps: { type: [Stage5Form2TapRowSubSchema], default: [] },
  },
  { _id: false }
);

const Stage5Form2SubSchema = new mongoose.Schema(
  {
    // Header fields
    meterUsed: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" }, // frontend uses `modelSrNo`
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    vectorGroup: { type: String, trim: true, default: "" },
    mf: { type: String, trim: true, default: "" },

    // Two ratio sets (two blocks in the table)
    ratioSet1: { type: Stage5Form2RatioSetSubSchema, default: () => ({}) },
    ratioSet2: { type: Stage5Form2RatioSetSubSchema, default: () => ({}) },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 5 Form 3 (Magnetizing Current Test LV and HV)
 * Matches frontend Stage5Form3 in VConnected63MVATransformerForms.js
 */
const Stage5Form3HVMeasurementRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    hvVoltage: { type: String, trim: true, default: "" },
    hvCurrent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form3SubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },

    hvMeasurements: { type: [Stage5Form3HVMeasurementRowSubSchema], default: [] },

    lv1Voltage: { type: String, trim: true, default: "" },
    lv1Current: { type: String, trim: true, default: "" },
    lv2Voltage: { type: String, trim: true, default: "" },
    lv2Current: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 5 Form 4 (Polarity Test)
 * Matches frontend Stage5Form4 in VConnected63MVATransformerForms.js
 */
const Stage5Form4SubSchema = new mongoose.Schema(
  {
    condition1_11_12_22: { type: String, trim: true, default: "" },
    condition1_21_22_22: { type: String, trim: true, default: "" },
    condition1_11_22_22: { type: String, trim: true, default: "" },
    condition1_calc_22: { type: String, trim: true, default: "" },

    condition2_11_12_22: { type: String, trim: true, default: "" },
    condition2_21_22_22: { type: String, trim: true, default: "" },
    condition2_11_21_22: { type: String, trim: true, default: "" },
    condition2_calc_22: { type: String, trim: true, default: "" },

    condition1_11_12_32: { type: String, trim: true, default: "" },
    condition1_31_32_32: { type: String, trim: true, default: "" },
    condition1_11_32_32: { type: String, trim: true, default: "" },
    condition1_calc_32: { type: String, trim: true, default: "" },

    condition2_11_12_32: { type: String, trim: true, default: "" },
    condition2_31_32_32: { type: String, trim: true, default: "" },
    condition2_11_31_32: { type: String, trim: true, default: "" },
    condition2_calc_32: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);


const Stage5Form5TapRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    voltage: { type: String, trim: true, default: "" },
    hvCurrent: { type: String, trim: true, default: "" },
    lvCurrent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form5SubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },

    // Stage5Form5 UI includes this extra field (LV 1 SHORT, LV2 OPEN)
    lv1ShortLv2Open: { type: String, trim: true, default: "" },

    taps: { type: [Stage5Form5TapRowSubSchema], default: [] },

    // Impedance calculation
    appliedVoltageHV: { type: String, trim: true, default: "" },
    ratedCurrentLV: { type: String, trim: true, default: "" },
    percentZ: { type: String, trim: true, default: "" },
    ratedVoltageHV: { type: String, trim: true, default: "" },
    measuredCurrentLV: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage5Form6TapRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    voltage: { type: String, trim: true, default: "" },
    hvCurrent: { type: String, trim: true, default: "" },
    lvCurrent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form6SubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },

    // Stage5Form6 UI includes this extra field (LV 1 OPEN, LV2 SHORT)
    lv1OpenLv2Short: { type: String, trim: true, default: "" },

    taps: { type: [Stage5Form6TapRowSubSchema], default: [] },

    // Impedance calculation
    appliedVoltageHV: { type: String, trim: true, default: "" },
    ratedCurrentLV: { type: String, trim: true, default: "" },
    percentZ: { type: String, trim: true, default: "" },
    ratedVoltageHV: { type: String, trim: true, default: "" },
    measuredCurrentLV: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage5Form7TapRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    voltage: { type: String, trim: true, default: "" },
    hvCurrent: { type: String, trim: true, default: "" },
    lvCurrent: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form7SubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },

    // Stage5Form7 UI includes this extra field (LV1 AND LV2 SHORT)
    lv1AndLv2Short: { type: String, trim: true, default: "" },

    taps: { type: [Stage5Form7TapRowSubSchema], default: [] },

    // Impedance calculation
    appliedVoltageHV: { type: String, trim: true, default: "" },
    ratedCurrentLV: { type: String, trim: true, default: "" },
    percentZ: { type: String, trim: true, default: "" },
    ratedVoltageHV: { type: String, trim: true, default: "" },
    measuredCurrentLV: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage5Form8HVRowSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    resistance_11_12: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form8LV21RowSubSchema = new mongoose.Schema(
  {
    rowNo: { type: Number, default: 0 },
    resistance_21_22: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form8LV31RowSubSchema = new mongoose.Schema(
  {
    rowNo: { type: Number, default: 0 },
    resistance_31_32: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form8SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },

    hvSide: { type: [Stage5Form8HVRowSubSchema], default: [] },
    lvSide21_22: { type: [Stage5Form8LV21RowSubSchema], default: [] },
    lvSide31_32: { type: [Stage5Form8LV31RowSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage5Form9RowSubSchema = new mongoose.Schema(
  {
    voltageKv: { type: String, trim: true, default: "" },
    bushingSerialNo: { type: String, trim: true, default: "" },
    testMode: { type: String, trim: true, default: "" },
    capacitanceFactory: { type: String, trim: true, default: "" },
    capacitanceSite: { type: String, trim: true, default: "" },
    tanDeltaFactory: { type: String, trim: true, default: "" },
    tanDeltaSite: { type: String, trim: true, default: "" },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form9SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    modelAndSerialNo: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },

    hvBushingSrNo: { type: String, trim: true, default: "" },
    hvBushingMake: { type: String, trim: true, default: "" },
    lvBushingSrNo: { type: String, trim: true, default: "" },
    lvBushingMake: { type: String, trim: true, default: "" },

    // keyed by: hv11, hv12, lv21, lv22, lv31, lv32
    rows: { type: Map, of: Stage5Form9RowSubSchema, default: {} },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);


const Stage5Form10RowSubSchema = new mongoose.Schema(
  {
    between: { type: String, trim: true, default: "" },
    mode: { type: String, trim: true, default: "" },
    tanDelta: { type: String, trim: true, default: "" },
    capacitance: { type: String, trim: true, default: "" },
    excitationCurrent: { type: String, trim: true, default: "" },
    dielectricLoss: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form10SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    modelAndSerialNo: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },

    at05kvRows: { type: [Stage5Form10RowSubSchema], default: [] },
    at10kvRows: { type: [Stage5Form10RowSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const Stage5Form11SignatureSubSchema = new mongoose.Schema(
  {
    vpesName: { type: String, trim: true, default: "" },
    vpesSignature: { type: String, trim: true, default: "" },
    vpesDate: { type: String, trim: true, default: "" },
    customerName: { type: String, trim: true, default: "" },
    customerSignature: { type: String, trim: true, default: "" },
    customerDate: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form11SubSchema = new mongoose.Schema(
  {
    // Header (customer/project details)
    customerName: { type: String, trim: true, default: "" },
    ratingMVA: { type: String, trim: true, default: "" },
    projectName: { type: String, trim: true, default: "" },
    ratingVoltage: { type: String, trim: true, default: "" },
    nameTSS: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    manufacturerName: { type: String, trim: true, default: "" },

    // Valve Status / Air Venting / Protection Trails sections (as captured by frontend)
    valveStatus: { type: Map, of: String, default: {} },
    airVenting: { type: mongoose.Schema.Types.Mixed, default: {} },
    protectionTrails: { type: Map, of: String, default: {} },

    // IR header fields
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    // IR table values (15/60/600 + ratios)
    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_600sec: { type: String, trim: true, default: "" },
    hvEarth_ratio_ir60: { type: String, trim: true, default: "" },
    hvEarth_ratio_ir600: { type: String, trim: true, default: "" },

    lv1Earth_15sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_600sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio_ir60: { type: String, trim: true, default: "" },
    lv1Earth_ratio_ir600: { type: String, trim: true, default: "" },

    lv2Earth_15sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_600sec: { type: String, trim: true, default: "" },
    lv2Earth_ratio_ir60: { type: String, trim: true, default: "" },
    lv2Earth_ratio_ir600: { type: String, trim: true, default: "" },

    hvLv1_15sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_600sec: { type: String, trim: true, default: "" },
    hvLv1_ratio_ir60: { type: String, trim: true, default: "" },
    hvLv1_ratio_ir600: { type: String, trim: true, default: "" },

    hvLv2_15sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_600sec: { type: String, trim: true, default: "" },
    hvLv2_ratio_ir60: { type: String, trim: true, default: "" },
    hvLv2_ratio_ir600: { type: String, trim: true, default: "" },

    lv1Lv2_15sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_600sec: { type: String, trim: true, default: "" },
    lv1Lv2_ratio_ir60: { type: String, trim: true, default: "" },
    lv1Lv2_ratio_ir600: { type: String, trim: true, default: "" },

    signatures: { type: Stage5Form11SignatureSubSchema, default: () => ({}) },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/* --- SUB-SCHEMAS FOR STAGE 6 --- */

/**
 * Sub-schema for Stage 6 Form 1 (Pre-Commissioning Checklist)
 * Matches frontend Stage6Form1 in VConnected63MVATransformerForms.js
 */
const Stage6Form1ValveStatusRowSubSchema = new mongoose.Schema(
  {
    qty: { type: String, trim: true, default: "" },
    open: { type: String, trim: true, default: "" },
    shut: { type: String, trim: true, default: "" },
    na: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form1AirVentingSubSchema = new mongoose.Schema(
  {
    mainTank: { type: String, trim: true, default: "" },
    pipeLineTop: { type: String, trim: true, default: "" },
    pipeLineBottom: { type: String, trim: true, default: "" },
    radiatorTop: { type: String, trim: true, default: "" },
    rfbd: { type: String, trim: true, default: "" },
    diverterSwitch: { type: String, trim: true, default: "" },

    bucholzRelay: {
      location1: { type: String, trim: true, default: "" },
      location2: { type: String, trim: true, default: "" },
    },
    hvBushing: {
      location11: { type: String, trim: true, default: "" },
      location12: { type: String, trim: true, default: "" },
    },
    lvBushing: {
      location21: { type: String, trim: true, default: "" },
      location22: { type: String, trim: true, default: "" },
      location31: { type: String, trim: true, default: "" },
      location32: { type: String, trim: true, default: "" },
    },
    headerTop: {
      location1: { type: String, trim: true, default: "" },
      location2: { type: String, trim: true, default: "" },
    },
    headerBottom: {
      location1: { type: String, trim: true, default: "" },
      location2: { type: String, trim: true, default: "" },
    },
    oilPump: {
      location1: { type: String, trim: true, default: "" },
      location2: { type: String, trim: true, default: "" },
      location3: { type: String, trim: true, default: "" },
      location4: { type: String, trim: true, default: "" },
    },
  },
  { _id: false }
);

const Stage6Form1SubSchema = new mongoose.Schema(
  {
    customerName: { type: String, trim: true, default: "" },
    projectCompanyName: { type: String, trim: true, default: "" },
    nameOfTSS: { type: String, trim: true, default: "" },
    ratingMVA: { type: String, trim: true, default: "" },
    ratingVoltage: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    manufacturerName: { type: String, trim: true, default: "" },

    // Section totals row
    valveStatusSectionQty: { type: String, trim: true, default: "" },
    valveStatusSectionOpen: { type: String, trim: true, default: "" },
    valveStatusSectionShut: { type: String, trim: true, default: "" },
    valveStatusSectionNa: { type: String, trim: true, default: "" },

    // A..M rows keyed by row key (bucholzToConservator, mainTankToBucholz, etc)
    valveStatus: { type: Map, of: Stage6Form1ValveStatusRowSubSchema, default: {} },

    airVenting: { type: Stage6Form1AirVentingSubSchema, default: () => ({}) },

    protectionTrails: { type: Map, of: String, default: {} },
    otiSetTemperature: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 6 Form 2 (Transformer Protection relay / Accessories Checking / IR Values)
 * Matches frontend Stage6Form2 in VConnected63MVATransformerForms.js
 */
const Stage6Form2RelayRowSubSchema = new mongoose.Schema(
  {
    make: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    lastTestedDate: { type: String, trim: true, default: "" }, // date input
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form2AccessoriesRowSubSchema = new mongoose.Schema(
  {
    setTemp: { type: String, trim: true, default: "" },
    checked: { type: String, trim: true, default: "" },
    noOfHrsRun: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form2FinalIrRowSubSchema = new mongoose.Schema(
  {
    at10: { type: String, trim: true, default: "" },
    at60: { type: String, trim: true, default: "" },
    at600: { type: String, trim: true, default: "" },
    pi: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form2SubSchema = new mongoose.Schema(
  {
    // Transformer Protection relay
    overCurrentRelay: { type: Stage6Form2RelayRowSubSchema, default: () => ({}) },
    restrictedEarthFaultRelay: { type: Stage6Form2RelayRowSubSchema, default: () => ({}) },
    differentialRelay: { type: Stage6Form2RelayRowSubSchema, default: () => ({}) },
    masterTripRelay: { type: Stage6Form2RelayRowSubSchema, default: () => ({}) },

    separateEarthPit: { type: String, trim: true, default: "" },
    neutralEarthPitResistanceValues: { type: String, trim: true, default: "" },
    gridEarthResistanceValues: { type: String, trim: true, default: "" },
    cleaningCheckingMainTankEarthing: { type: String, trim: true, default: "" },

    laCounterReading: { type: mongoose.Schema.Types.Mixed, default: {} }, // keys: 1.1, 2.1, 3.1, 1.2, 2.2, 3.2
    whetherLaEarthingChecked: { type: String, trim: true, default: "" },
    irValueOfLa: { type: String, trim: true, default: "" },

    phases: { type: mongoose.Schema.Types.Mixed, default: {} }, // keys: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2

    // Accessories checking (fan/pump + octc tap + octc items)
    accessories: { type: Map, of: Stage6Form2AccessoriesRowSubSchema, default: {} }, // keys: fanStart, fanStop, pumpStart1, pumpStart2, octcTapPosition, diverterSwitch, driveMechanism, tpiRtcc

    // Bushing Test Tap Earthed
    bushingTestTapEarthed: {
      hvChecked: { type: mongoose.Schema.Types.Mixed, default: {} }, // keys: 1.1, 1.2
      lvChecked: { type: mongoose.Schema.Types.Mixed, default: {} }, // keys: 2.1, 2.2, 3.1, 3.2
    },

    // Oil values
    oilValues: {
      bdvKv: { type: String, trim: true, default: "" },
      moistureContentPpm: { type: String, trim: true, default: "" },
    },

    // Final IR Values
    finalIrValues: { type: Map, of: Stage6Form2FinalIrRowSubSchema, default: {} },

    oilLevelInConservator: { type: String, trim: true, default: "" },

    connectorsHvJumpers: { type: mongoose.Schema.Types.Mixed, default: {} }, // keys: 1.1, 1.2

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/**
 * Sub-schema for Stage 6 Form 3 (Final Checklist and Clearance)
 * Matches frontend Stage6Form3 in VConnected63MVATransformerForms.js
 */
const Stage6Form3SubSchema = new mongoose.Schema(
  {
    connectors: {
      lv21: { type: String, trim: true, default: "" },
      lv22: { type: String, trim: true, default: "" },
      lv31: { type: String, trim: true, default: "" },
      lv32: { type: String, trim: true, default: "" },
    },

    anabondApplied: { type: String, trim: true, default: "" },
    jointsSealed: { type: String, trim: true, default: "" },
    foreignMaterialCleared: { type: String, trim: true, default: "" },
    temperatureWTI: { type: String, trim: true, default: "" },
    temperatureOTI: { type: String, trim: true, default: "" },

    remarks: { type: String, trim: true, default: "" },

    signatures: {
      vpesName: { type: String, trim: true, default: "" },
      vpesSignature: { type: String, trim: true, default: "" },
      vpesDate: { type: String, trim: true, default: "" },
      customerName: { type: String, trim: true, default: "" },
      customerSignature: { type: String, trim: true, default: "" },
      customerDate: { type: String, trim: true, default: "" },
    },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

/* --- SUB-SCHEMAS FOR STAGE 7 --- */

// Sub-schema for Stage 7 Form 1
// Note: Stage 7 Work Completion Report currently uses the same structure as Stage 6 Form 1 in the frontend.
const Stage7Form1SubSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: "",
    },
    orderNumber: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      trim: true,
      default: "",
    },
    capacity: {
      type: String,
      trim: true,
      default: "",
    },
    voltageRating: {
      type: String,
      trim: true,
      default: "",
    },
    make: {
      type: String,
      trim: true,
      default: "",
    },
    serialNumber: {
      type: String,
      trim: true,
     default: "",
    },
    completionDate: {
      type: String,
      trim: true,
      default: "",
    },
    chargingDate: {
      type: String,
      trim: true,
      default: "",
    },
    commissioningDate: {
      type: String,
      trim: true,
      default: "",
    },
    signatures: {
      type: DetailedSignatureSubSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

// --- Main Schema to merge all forms into a single document ---

const VConnectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      trim: true,
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
      required: true,
    },
    vConnectData: {
      stage0: {
        form1: { type: Stage0Form1SubSchema, default: () => ({}) },
        form2: { type: Stage0Form2SubSchema, default: () => ({}) },
        form3: { type: Stage0Form3SubSchema, default: () => ({}) },
      },
      stage1: {
        form1: { type: Stage1Form1SubSchema, default: () => ({}) },
        form2: { type: Stage1Form2SubSchema, default: () => ({}) },
        form3: { type: Stage1Form3SubSchema, default: () => ({}) },
        form4: { type: Stage1Form4SubSchema, default: () => ({}) },
        form5: { type: Stage1Form5SubSchema, default: () => ({}) },
        form6: { type: Stage1Form6SubSchema, default: () => ({}) },
        form7: { type: Stage1Form7SubSchema, default: () => ({}) },
        form8: { type: Stage1Form8SubSchema, default: () => ({}) },
      },
      stage2: {
        form1: { type: Stage2Form1SubSchema, default: () => ({}) },
        form2: { type: Stage2Form2SubSchema, default: () => ({}) },
      },
      stage3: {
        form1: { type: Stage3Form1SubSchema, default: () => ({}) },
      },
      stage4: {
        form1: { type: Stage4Form1SubSchema, default: () => ({}) },
        form2: { type: Stage4Form2SubSchema, default: () => ({}) },
        form3: { type: Stage4Form3SubSchema, default: () => ({}) },
        form4: { type: Stage4Form4SubSchema, default: () => ({}) },
      },
      stage5: {
        form1: { type: Stage5Form1SubSchema, default: () => ({}) },
        form2: { type: Stage5Form2SubSchema, default: () => ({}) },
        form3: { type: Stage5Form3SubSchema, default: () => ({}) },
        form4: { type: Stage5Form4SubSchema, default: () => ({}) },
        form5: { type: Stage5Form5SubSchema, default: () => ({}) },
        form6: { type: Stage5Form6SubSchema, default: () => ({}) },
        form7: { type: Stage5Form7SubSchema, default: () => ({}) },
        form8: { type: Stage5Form8SubSchema, default: () => ({}) },
        form9: { type: Stage5Form9SubSchema, default: () => ({}) },
        form10: { type: Stage5Form10SubSchema, default: () => ({}) },
        form11: { type: Stage5Form11SubSchema, default: () => ({}) },
      },
      stage6: {
        form1: { type: Stage6Form1SubSchema, default: () => ({}) },
        form2: { type: Stage6Form2SubSchema, default: () => ({}) },
        form3: { type: Stage6Form3SubSchema, default: () => ({}) },
      },
      stage7: {
        form1: { type: Stage7Form1SubSchema, default: () => ({}) },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("VConnect", VConnectSchema);
