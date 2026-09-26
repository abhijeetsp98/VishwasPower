import mongoose from "mongoose";

// ============================================================
// Traction Transformer - Mongoose Schema
// Kept ONLY schemas that are used by current Traction UI forms:
// frontend/src/components/TractionTransformerForms.js
// (stageFormsMapping for stages 1..6)
// ============================================================

// ─── STAGE 0 — Unloading Checklist ───────────────────────────────────────────

// Sub-schema for a single checklist row (used in all 3 Stage 0 forms)
const UnloadingCheckRowSchema = new mongoose.Schema(
  {
    status:    { type: String, trim: true, default: "" },
    remarks:   { type: String, trim: true, default: "" },
    date:      { type: String, trim: true, default: "" },
    checkedBy: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 0 Form 1 (Site condition at time of unloading)
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

// Sub-schema for Stage 0 Form 2 (Main Tank Checklist)
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

// Sub-schema for accessories inventory row (Form 3)
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

// Sub-schema for Stage 0 Form 3 (Protocol for Accessories Checking)
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

// --------------------
// Stage 1 - Form 1
// --------------------
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
    noOfRadiators: { type: String, trim: true, default: "" },
    noOfTaps: { type: String, trim: true, default: "" },
    mfgOfOctc: { type: String, trim: true, default: "" },
    typeOfOctc: { type: String, trim: true, default: "" },
    srNoOctc: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 2
// --------------------
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

const Stage1Form2SubSchema = new mongoose.Schema(
  {
    accessories: { type: Map, of: AccessoryItemSchema, default: {} },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 3
// --------------------
const Stage1Form3SubSchema = new mongoose.Schema(
  {
    // Core Insulation Check fields
    coreFrame_obtainedValue: { type: String, trim: true, default: "" },
    coreFrame_remarks: { type: String, trim: true, default: "" },
    frameTank_obtainedValue: { type: String, trim: true, default: "" },
    frameTank_remarks: { type: String, trim: true, default: "" },
    coreTank_obtainedValue: { type: String, trim: true, default: "" },
    coreTank_remarks: { type: String, trim: true, default: "" },

    // Equipment checklist fields
    filterMachine: { type: String, trim: true, default: "" },
    filterMachineCapacity: { type: String, trim: true, default: "" },
    vacuumPumpCapacity: { type: String, trim: true, default: "" },
    reservoirAvailable: { type: String, trim: true, default: "" },
    reservoirCapacity: { type: String, trim: true, default: "" },
    hosePipes: { type: String, trim: true, default: "" },
    craneAvailable: { type: String, trim: true, default: "" },
    dryAir: { type: String, trim: true, default: "" },
    dewPointMeter: { type: String, trim: true, default: "" },
    mecLeodGauge: { type: String, trim: true, default: "" },

    // Safety equipment fields
    fireExtinguisher: { type: String, trim: true, default: "" },
    firstAidKit: { type: String, trim: true, default: "" },
    ppeEquipment: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 4
// --------------------
const Stage1Form4SubSchema = new mongoose.Schema(
  {
    makeOfMeter: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
    testReportReviewedBy: { type: String, trim: true, default: "" },
    acceptanceOfTest: { type: String, trim: true, default: "" },

    // Phase 1.1 - CT Ratio test fields (S1-S2)
    phase31_20percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_40percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_60percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_80percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_100percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },

    // Phase 1.1 - CT Ratio test fields (S1-S3)
    phase31_20percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_40percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_60percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_80percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_100percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 1.1 - Knee point voltage fields (S1-S2)
    phase31_knee_20percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_40percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_60percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_80percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_100percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_110percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_110percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },

    // Phase 1.1 - Knee point voltage fields (S1-S3)
    phase31_knee_20percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_40percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_60percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_80percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_100percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_110percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_110percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 1.2 - CT Ratio test fields (S1-S2)
    phase32_20percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_40percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_60percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_80percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_100percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },

    // Phase 1.2 - CT Ratio test fields (S1-S3)
    phase32_20percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_40percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_60percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_80percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_100percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 1.2 - Knee point voltage fields (S1-S2)
    phase32_knee_20percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_40percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_60percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_80percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_100percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_110percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_110percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },

    // Phase 1.2 - Knee point voltage fields (S1-S3)
    phase32_knee_20percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_40percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_60percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_80percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_100percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_110percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_110percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 5
// --------------------
const Stage1Form5SubSchema = new mongoose.Schema(
  {
    // Phase 2.1 CT Ratio measurements
    phase31_20percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_20percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_40percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_40percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_60percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_60percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_80percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_80percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_100percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_100percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 2.1 Knee point voltage measurements
    phase31_knee_20percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_20percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_40percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_40percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_60percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_60percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_80percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_80percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_100percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_100percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_110percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_110percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase31_knee_110percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase31_knee_110percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 2.2 CT Ratio measurements
    phase32_20percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_20percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_40percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_40percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_60percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_60percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_80percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_80percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_100percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_100percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // Phase 2.2 Knee point voltage measurements
    phase32_knee_20percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_20percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_40percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_40percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_60percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_60percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_80percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_80percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_100percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_100percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_110percent_appliedVoltage_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_110percent_appliedVoltage_s1s3: { type: String, trim: true, default: "" },
    phase32_knee_110percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    phase32_knee_110percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },

    // WTI CT Ratio measurements (S1-S2, S1-S3, S1-S4)
    wti_20percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_20percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_20percent_appliedCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s4: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s2: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s3: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s4: { type: String, trim: true, default: "" },

    // WTI CT Ratio measurements (S1-S5, S1-S6, S1-S7)
    wti_20percent_appliedCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_20percent_appliedCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_20percent_appliedCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_20percent_measuredCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_40percent_appliedCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_40percent_measuredCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_60percent_appliedCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_60percent_measuredCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_80percent_appliedCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_80percent_measuredCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_100percent_appliedCurrent_s1s7: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s5: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s6: { type: String, trim: true, default: "" },
    wti_100percent_measuredCurrent_s1s7: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 6
// --------------------
const Stage1Form6SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },

    hvBushing11_srNo: { type: String, trim: true, default: "" },
    hvBushing12_srNo: { type: String, trim: true, default: "" },

    hvBushing11_05kv_tanDelta: { type: String, trim: true, default: "" },
    hvBushing11_05kv_capacitance: { type: String, trim: true, default: "" },
    hvBushing11_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvBushing11_05kv_dielectricLoss: { type: String, trim: true, default: "" },

    hvBushing12_05kv_tanDelta: { type: String, trim: true, default: "" },
    hvBushing12_05kv_capacitance: { type: String, trim: true, default: "" },
    hvBushing12_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvBushing12_05kv_dielectricLoss: { type: String, trim: true, default: "" },

    hvBushing11_10kv_tanDelta: { type: String, trim: true, default: "" },
    hvBushing11_10kv_capacitance: { type: String, trim: true, default: "" },
    hvBushing11_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvBushing11_10kv_dielectricLoss: { type: String, trim: true, default: "" },

    hvBushing12_10kv_tanDelta: { type: String, trim: true, default: "" },
    hvBushing12_10kv_capacitance: { type: String, trim: true, default: "" },
    hvBushing12_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvBushing12_10kv_dielectricLoss: { type: String, trim: true, default: "" },

    lvBushing21_srNo: { type: String, trim: true, default: "" },
    lvBushing22_srNo: { type: String, trim: true, default: "" },

    lvBushing21_05kv_tanDelta: { type: String, trim: true, default: "" },
    lvBushing21_05kv_capacitance: { type: String, trim: true, default: "" },
    lvBushing21_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    lvBushing21_05kv_dielectricLoss: { type: String, trim: true, default: "" },

    lvBushing22_05kv_tanDelta: { type: String, trim: true, default: "" },
    lvBushing22_05kv_capacitance: { type: String, trim: true, default: "" },
    lvBushing22_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    lvBushing22_05kv_dielectricLoss: { type: String, trim: true, default: "" },

    lvBushing21_10kv_tanDelta: { type: String, trim: true, default: "" },
    lvBushing21_10kv_capacitance: { type: String, trim: true, default: "" },
    lvBushing21_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    lvBushing21_10kv_dielectricLoss: { type: String, trim: true, default: "" },

    lvBushing22_10kv_tanDelta: { type: String, trim: true, default: "" },
    lvBushing22_10kv_capacitance: { type: String, trim: true, default: "" },
    lvBushing22_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    lvBushing22_10kv_dielectricLoss: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 1 - Form 7
// --------------------
const Stage1Form7SubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },
    lvEarth_10sec: { type: String, trim: true, default: "" },
    lvEarth_60sec: { type: String, trim: true, default: "" },
    lvEarth_ratio: { type: String, trim: true, default: "" },
    hvLv_10sec: { type: String, trim: true, default: "" },
    hvLv_60sec: { type: String, trim: true, default: "" },
    hvLv_ratio: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 2 - Form 1
// --------------------
const FiltrationRecordSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    inletTemp: { type: String, trim: true, default: "" },
    outletTemp: { type: String, trim: true, default: "" },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage2Form1SubSchema = new mongoose.Schema(
  {
    tank1_noOfBarrels: { type: String, trim: true, default: "" },
    tank1_startedDate: { type: String, trim: true, default: "" },
    tank1_startedTime: { type: String, trim: true, default: "" },
    tank1_completedDate: { type: String, trim: true, default: "" },
    tank1_completedTime: { type: String, trim: true, default: "" },
    tank1_bdv: { type: String, trim: true, default: "" },
    tank1_ppm: { type: String, trim: true, default: "" },

    tank2_noOfBarrels: { type: String, trim: true, default: "" },
    tank2_startedDate: { type: String, trim: true, default: "" },
    tank2_startedTime: { type: String, trim: true, default: "" },
    tank2_completedDate: { type: String, trim: true, default: "" },
    tank2_completedTime: { type: String, trim: true, default: "" },
    tank2_bdv: { type: String, trim: true, default: "" },
    tank2_ppm: { type: String, trim: true, default: "" },

    tank3_noOfBarrels: { type: String, trim: true, default: "" },
    tank3_startedDate: { type: String, trim: true, default: "" },
    tank3_startedTime: { type: String, trim: true, default: "" },
    tank3_completedDate: { type: String, trim: true, default: "" },
    tank3_completedTime: { type: String, trim: true, default: "" },
    tank3_bdv: { type: String, trim: true, default: "" },
    tank3_ppm: { type: String, trim: true, default: "" },

    filtrationRecords: [FiltrationRecordSchema],
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 2 - Form 2
// --------------------
const Stage2Form2SubSchema = new mongoose.Schema(
  {
    hv_earth_11: { type: String, trim: true, default: "" },
    hv_earth_12: { type: String, trim: true, default: "" },
    lv1_earth_21: { type: String, trim: true, default: "" },
    lv1_earth_22: { type: String, trim: true, default: "" },

    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },

    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lvEarth_10sec: { type: String, trim: true, default: "" },
    lvEarth_60sec: { type: String, trim: true, default: "" },
    lvEarth_ratio: { type: String, trim: true, default: "" },

    hvLv_10sec: { type: String, trim: true, default: "" },
    hvLv_60sec: { type: String, trim: true, default: "" },
    hvLv_ratio: { type: String, trim: true, default: "" },

    bdv: { type: String, trim: true, default: "" },
    waterContent: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 3 - Form 1
// --------------------
const VacuumRecordSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevelMic: { type: String, trim: true, default: "" },
    vacuumLevelTransformer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PressureTestItemSchema = new mongoose.Schema(
  {
    timeStarted: { type: String, trim: true, default: "" },
    pressure: { type: String, trim: true, default: "" },
    tempAmb: { type: String, trim: true, default: "" },
    tempOti: { type: String, trim: true, default: "" },
    tempWti: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage3Form1SubSchema = new mongoose.Schema(
  {
    vacuumHoseCheckedBy: { type: String, trim: true, default: "" },
    vacuumHoseConnectedTo: { type: String, trim: true, default: "" },
    evacuationStartedAt: { type: String, trim: true, default: "" },
    evacuationStartedOn: { type: String, trim: true, default: "" },

    vacuumRecords: [VacuumRecordSchema],

    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },

    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lvEarth_10sec: { type: String, trim: true, default: "" },
    lvEarth_60sec: { type: String, trim: true, default: "" },
    lvEarth_ratio: { type: String, trim: true, default: "" },

    hvLv_10sec: { type: String, trim: true, default: "" },
    hvLv_60sec: { type: String, trim: true, default: "" },
    hvLv_ratio: { type: String, trim: true, default: "" },

    pressureTestDate: { type: String, trim: true, default: "" },
    pressureTests: { type: [PressureTestItemSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 4 - Form 1
// --------------------
const Stage4FiltrationRecordSchema = new mongoose.Schema(
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
    filtrationRecords: [Stage4FiltrationRecordSchema],
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 4 - Form 2
// --------------------
const Stage4CoolerBankRecordSchema = new mongoose.Schema(
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
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },

    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_ratio: { type: String, trim: true, default: "" },

    lv1Earth_15sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_ratio: { type: String, trim: true, default: "" },

    hvLv1_15sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_ratio: { type: String, trim: true, default: "" },

    coolerBankRecords: [Stage4CoolerBankRecordSchema],

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 4 - Form 3
// --------------------
const Stage4CombineRecordSchema = new mongoose.Schema(
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
    combineRecords: [Stage4CombineRecordSchema],
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 4 - Form 4
// --------------------
const Stage4Form4SubSchema = new mongoose.Schema(
  {
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

    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },

    hvEarth_10sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_600sec: { type: String, trim: true, default: "" },
    hvEarth_pi: { type: String, trim: true, default: "" },

    lv1Earth_10sec: { type: String, trim: true, default: "" },
    lv1Earth_60sec: { type: String, trim: true, default: "" },
    lv1Earth_600sec: { type: String, trim: true, default: "" },
    lv1Earth_pi: { type: String, trim: true, default: "" },

    lv2Earth_10sec: { type: String, trim: true, default: "" },
    lv2Earth_60sec: { type: String, trim: true, default: "" },
    lv2Earth_600sec: { type: String, trim: true, default: "" },
    lv2Earth_pi: { type: String, trim: true, default: "" },

    hvLv1_10sec: { type: String, trim: true, default: "" },
    hvLv1_60sec: { type: String, trim: true, default: "" },
    hvLv1_600sec: { type: String, trim: true, default: "" },
    hvLv1_pi: { type: String, trim: true, default: "" },

    hvLv2_10sec: { type: String, trim: true, default: "" },
    hvLv2_60sec: { type: String, trim: true, default: "" },
    hvLv2_600sec: { type: String, trim: true, default: "" },
    hvLv2_pi: { type: String, trim: true, default: "" },

    lv1Lv2_10sec: { type: String, trim: true, default: "" },
    lv1Lv2_60sec: { type: String, trim: true, default: "" },
    lv1Lv2_600sec: { type: String, trim: true, default: "" },
    lv1Lv2_pi: { type: String, trim: true, default: "" },

    bdv: { type: String, trim: true, default: "" },
    waterContent: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 1
// --------------------
const Stage5Form1SubSchema = new mongoose.Schema(
  {
    makeOfMeter: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    testReportReviewedBy: { type: String, trim: true, default: "" },
    acceptanceOfTest: { type: String, trim: true, default: "" },

    trSrNo: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    customer: { type: String, trim: true, default: "" },
    testDate: { type: String, trim: true, default: "" },
    testTime: { type: String, trim: true, default: "" },

    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },

    hvEarth_15sec: { type: String, trim: true, default: "" },
    hvEarth_60sec: { type: String, trim: true, default: "" },
    hvEarth_600sec: { type: String, trim: true, default: "" },
    hvEarth_ratio60_15: { type: String, trim: true, default: "" },
    hvEarth_ratio600_60: { type: String, trim: true, default: "" },

    lvEarth_15sec: { type: String, trim: true, default: "" },
    lvEarth_60sec: { type: String, trim: true, default: "" },
    lvEarth_600sec: { type: String, trim: true, default: "" },
    lvEarth_ratio60_15: { type: String, trim: true, default: "" },
    lvEarth_ratio600_60: { type: String, trim: true, default: "" },

    hvLv_15sec: { type: String, trim: true, default: "" },
    hvLv_60sec: { type: String, trim: true, default: "" },
    hvLv_600sec: { type: String, trim: true, default: "" },
    hvLv_ratio60_15: { type: String, trim: true, default: "" },
    hvLv_ratio600_60: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 2 (Ratio Test)
// --------------------
const RatioTestItemSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    appliedVoltageHV: { type: String, trim: true, default: "" },
    measuredVoltageLV: { type: String, trim: true, default: "" },
    calculatedRatio: { type: String, trim: true, default: "" },
    deviationPercent: { type: String, trim: true, default: "" },
    namePlateRatio: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form2SubSchema = new mongoose.Schema(
  {
    meterSrNo: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ratioTestData: { type: [RatioTestItemSubSchema], default: [] },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 3 (Magnetising Current Test)
// --------------------
const Stage5Form3SubSchema = new mongoose.Schema(
  {
    hvTap1_voltageApplied: { type: String, trim: true, default: "" },
    hvTap1_measuredCurrent: { type: String, trim: true, default: "" },
    hvTap3_voltageApplied: { type: String, trim: true, default: "" },
    hvTap3_measuredCurrent: { type: String, trim: true, default: "" },
    hvTap6_voltageApplied: { type: String, trim: true, default: "" },
    hvTap6_measuredCurrent: { type: String, trim: true, default: "" },

    lvTap1_voltageApplied: { type: String, trim: true, default: "" },
    lvTap1_measuredCurrent: { type: String, trim: true, default: "" },
    lvTap2_voltageApplied: { type: String, trim: true, default: "" },
    lvTap2_measuredCurrent: { type: String, trim: true, default: "" },
    lvTap3_voltageApplied: { type: String, trim: true, default: "" },
    lvTap3_measuredCurrent: { type: String, trim: true, default: "" },
    lvTap4_voltageApplied: { type: String, trim: true, default: "" },
    lvTap4_measuredCurrent: { type: String, trim: true, default: "" },
    lvTap5_voltageApplied: { type: String, trim: true, default: "" },
    lvTap5_measuredCurrent: { type: String, trim: true, default: "" },
    lvTap6_voltageApplied: { type: String, trim: true, default: "" },
    lvTap6_measuredCurrent: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 4 (Polarity Test)
// --------------------
const Stage5Form4SubSchema = new mongoose.Schema(
  {
    cond1_11_12: { type: String, trim: true, default: "" },
    cond1_21_22: { type: String, trim: true, default: "" },
    cond1_11_22: { type: String, trim: true, default: "" },
    // Condition 1 equation result boxes
    cond1_eq_lhs: { type: String, trim: true, default: "" },
    cond1_eq_rhs1: { type: String, trim: true, default: "" },
    cond1_eq_rhs2: { type: String, trim: true, default: "" },
    cond1_eq_check_lhs: { type: String, trim: true, default: "" },
    cond1_eq_check_rhs: { type: String, trim: true, default: "" },

    cond2_11_12: { type: String, trim: true, default: "" },
    cond2_21_22: { type: String, trim: true, default: "" },
    cond2_11_21: { type: String, trim: true, default: "" },
    // Condition 2 equation result boxes
    cond2_eq_lhs: { type: String, trim: true, default: "" },
    cond2_eq_rhs1: { type: String, trim: true, default: "" },
    cond2_eq_rhs2: { type: String, trim: true, default: "" },
    cond2_eq_check_lhs: { type: String, trim: true, default: "" },
    cond2_eq_check_rhs: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 5 (Short Circuit Test)
// --------------------
const ShortCircuitTapReadingSubSchema = new mongoose.Schema(
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

    tapReadings: { type: [ShortCircuitTapReadingSubSchema], default: [] },

    impedance_appliedVoltageHV: { type: String, trim: true, default: "" },
    impedance_ratedVoltageHV: { type: String, trim: true, default: "" },
    impedance_ratedCurrentLV: { type: String, trim: true, default: "" },
    impedance_measuredCurrentLV: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 6 (Winding Resistance Test)
// --------------------
const WindingResistanceTapReadingSubSchema = new mongoose.Schema(
  {
    tapNo: { type: Number, default: 0 },
    value: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form6SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },
    range1: { type: String, trim: true, default: "" },
    range2: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },

    hvHeader: { type: String, trim: true, default: "" },
    hvTapReadings: { type: [WindingResistanceTapReadingSubSchema], default: [] },

    lvHeader: { type: String, trim: true, default: "" },
    lvValue: { type: String, trim: true, default: "" },
    lvValue2: { type: String, trim: true, default: "" },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 7 (Tan Delta & Capacitance - Bushing)
// --------------------
const TanDeltaBushingRowSubSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "" },
    voltageKv: { type: String, trim: true, default: "" },
    testMode: { type: String, trim: true, default: "" },
    capFactory: { type: String, trim: true, default: "" },
    capSite: { type: String, trim: true, default: "" },
    tdFactory: { type: String, trim: true, default: "" },
    tdSite: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage5Form7SubSchema = new mongoose.Schema(
  {
    bushingSrNoHv: { type: String, trim: true, default: "" },
    bushingSrNoLv: { type: String, trim: true, default: "" },
    makeHv: { type: String, trim: true, default: "" },
    makeLv: { type: String, trim: true, default: "" },

    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    modelAndSrNo: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },

    rows: { type: [TanDeltaBushingRowSubSchema], default: [] },
    rows2: { type: [TanDeltaBushingRowSubSchema], default: [] },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 5 - Form 8 (Tan Delta - Winding + IR section)
// --------------------
const TanDeltaWindingRowSubSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: "" },
    between: { type: String, trim: true, default: "" },
    mode: { type: String, trim: true, default: "" },
    tanDelta: { type: String, trim: true, default: "" },
    capacitance: { type: String, trim: true, default: "" },
    excitationCurrent: { type: String, trim: true, default: "" },
    dielectricLoss: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const IrValueRowSubSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "" },
    sec15: { type: String, trim: true, default: "" },
    sec60: { type: String, trim: true, default: "" },
    sec600: { type: String, trim: true, default: "" },
    ratio60_15: { type: String, trim: true, default: "" },
    ratio600_60: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const IrSectionSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },
    rows: { type: [IrValueRowSubSchema], default: [] },
  },
  { _id: false }
);

const Stage5Form8SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    modelAndSrNo: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },

    kv5_rows: { type: [TanDeltaWindingRowSubSchema], default: [] },
    kv10_rows: { type: [TanDeltaWindingRowSubSchema], default: [] },

    ir: { type: IrSectionSubSchema, default: () => ({}) },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 6 - Form 1 (Pre-Commissioning Checklist)
// --------------------
const Stage6StatusItemSubSchema = new mongoose.Schema(
  {
    open: { type: String, trim: true, default: "" },
    shut: { type: String, trim: true, default: "" },
    na: { type: String, trim: true, default: "" },
    qty: { type: String, trim: true, default: "" }, // only for airVenting rows
  },
  { _id: false }
);

const Stage6ProtectionTrialsSubSchema = new mongoose.Schema(
  {
    buchholzAlarm: { type: String, trim: true, default: "" },
    buchholzTrip: { type: String, trim: true, default: "" },
    mogAlarm: { type: String, trim: true, default: "" },
    prvTrip: { type: String, trim: true, default: "" },
    otiAlarm: { type: String, trim: true, default: "" },
    otiTrip: { type: String, trim: true, default: "" },
    wtiAlarm: { type: String, trim: true, default: "" },
    wtiTrip: { type: String, trim: true, default: "" },
    setTemperature: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form1SubSchema = new mongoose.Schema(
  {
    valveStatus: { type: Map, of: Stage6StatusItemSubSchema, default: {} },
    airVenting: { type: Map, of: Stage6StatusItemSubSchema, default: {} },
    protectionTrials: { type: Stage6ProtectionTrialsSubSchema, default: () => ({}) },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 6 - Form 2 (Pre-Commissioning Checklist - Cont.)
// --------------------
const Stage6Form2SignatureSubSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    signature: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form2TempSubSchema = new mongoose.Schema(
  {
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const Stage6Form2SubSchema = new mongoose.Schema(
  {
    protectionRelay: { type: mongoose.Schema.Types.Mixed, default: {} },
    accessoriesChecking: { type: mongoose.Schema.Types.Mixed, default: {} },
    octcTapPosition: { type: mongoose.Schema.Types.Mixed, default: {} },
    bushingTestTapEarthed: { type: mongoose.Schema.Types.Mixed, default: {} },
    oilValues: { type: mongoose.Schema.Types.Mixed, default: {} },
    finalIR: { type: mongoose.Schema.Types.Mixed, default: {} },
    oilLevelInConservator: { type: String, trim: true, default: "" },
    connectors: { type: mongoose.Schema.Types.Mixed, default: {} },

    connectorsLvJumpers: { type: mongoose.Schema.Types.Mixed, default: {} },
    ctCableAndGlandsSealed: { type: String, trim: true, default: "" },
    anabondAppliedHvBushings: { type: String, trim: true, default: "" },
    allJointsSealedAgainstWaterIngress: { type: String, trim: true, default: "" },
    foreignMaterialCleared: { type: String, trim: true, default: "" },

    temperature: { type: Stage6Form2TempSubSchema, default: () => ({}) },
    remarksChargingAsOn: { type: String, trim: true, default: "" },
    remarksText: { type: String, trim: true, default: "" },

    checkedBy: { type: Stage6Form2SignatureSubSchema, default: () => ({}) },
    witnessedBy: { type: Stage6Form2SignatureSubSchema, default: () => ({}) },
    reviewedBy: { type: Stage6Form2SignatureSubSchema, default: () => ({}) },
    witnessedBy2: { type: Stage6Form2SignatureSubSchema, default: () => ({}) },

    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --------------------
// Stage 7 - Form 1 (Work Completion Report)
// --------------------
const Stage7Form1SignaturesSubSchema = new mongoose.Schema(
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

const Stage7Form1SubSchema = new mongoose.Schema(
  {
    customerName: { type: String, trim: true, default: "" },
    orderNumber: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    type: { type: String, trim: true, default: "" },
    capacity: { type: String, trim: true, default: "" },
    voltageRating: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    serialNumber: { type: String, trim: true, default: "" },
    completionDate: { type: String, trim: true, default: "" },
    chargingDate: { type: String, trim: true, default: "" },
    commissioningDate: { type: String, trim: true, default: "" },
    signatures: { type: Stage7Form1SignaturesSubSchema, default: () => ({}) },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// ============================================================
// Main schema
// ============================================================
const TractionSchema = new mongoose.Schema(
  {
    projectName: { type: String, trim: true, required: true },
    companyName: { type: String, trim: true, required: true },

    TractionData: {
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
      },
      stage6: {
        form1: { type: Stage6Form1SubSchema, default: () => ({}) },
        form2: { type: Stage6Form2SubSchema, default: () => ({}) },
      },
      stage7: {
        form1: { type: Stage7Form1SubSchema, default: () => ({}) },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Traction", TractionSchema);
