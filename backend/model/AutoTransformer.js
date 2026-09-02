import mongoose from "mongoose";

// --- Sub-schemas for the forms to be nested inside the main schema ---

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
    // 5 checkpoint rows
    routeCondition:   { type: UnloadingCheckRowSchema, default: () => ({}) },
    siteCondition:    { type: UnloadingCheckRowSchema, default: () => ({}) },
    approachRoad:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    boundaryWall:     { type: UnloadingCheckRowSchema, default: () => ({}) },
    securityGuard:    { type: UnloadingCheckRowSchema, default: () => ({}) },
    // Signatures
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
    // 13 checklist rows
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
    // Signatures
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
    // 3 checklist rows
    accessoriesUnloadingPoint: { type: UnloadingCheckRowSchema, default: () => ({}) },
    dateOfUnloading:           { type: UnloadingCheckRowSchema, default: () => ({}) },
    storagePhotos:             { type: UnloadingCheckRowSchema, default: () => ({}) },
    // Accessories inventory (15 rows)
    accessoriesInventory: { type: [AccessoriesInventoryRowSchema], default: () => [] },
    remark: { type: String, trim: true, default: "" },
    // Signatures
    vpesSignature:         { type: String, trim: true, default: "" },
    vpesSignatureDate:     { type: String, trim: true, default: "" },
    customerSignature:     { type: String, trim: true, default: "" },
    customerSignatureDate: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────


// Sub-schema for Stage 1 Form 1 (Transformer Details)
const Stage1Form1SubSchema = new mongoose.Schema(
  {
    make: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    yearOfMfg: { type: String, trim: true, default: "" },
    currentHV: { type: String, trim: true, default: "" },
    currentLV: { type: String, trim: true, default: "" },
    hvKv: { type: String, trim: true, default: "" },
    lvKv: { type: String, trim: true, default: "" },
    mvaRating: { type: String, trim: true, default: "" },
    impedancePercent: { type: String, trim: true, default: "" },
    winding: { type: String, trim: true, default: "" },
    tempRiseOil: { type: String, trim: true, default: "" },
    noOfRadiators: { type: String, trim: true, default: "" },
    transportingWeight: { type: String, trim: true, default: "" },
    weightCoreWinding: { type: String, trim: true, default: "" },
    oilQuantityLiter: { type: String, trim: true, default: "" },
    totalWeight: { type: String, trim: true, default: "" },
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

const Stage1Form2SubSchema = new mongoose.Schema(
  {
    accessories: { type: Map, of: AccessoryItemSchema, default: {} },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 3 (Safety and Equipment Checklist)
const Stage1Form3SubSchema = new mongoose.Schema(
  {
    betweenCoreFrame: { type: String, trim: true, default: "" },
    betweenCoreFrameRemarks: { type: String, trim: true, default: "" },
    betweenFrameTank: { type: String, trim: true, default: "" },
    betweenFrameTankRemarks: { type: String, trim: true, default: "" },
    betweenCoreTank: { type: String, trim: true, default: "" },
    betweenCoreTankRemarks: { type: String, trim: true, default: "" },
    filterMachine: { type: String, trim: true, default: "" },
    filterMachineChecked: { type: String, default: "" },
    filterCapacity: { type: String, trim: true, default: "" },
    filterCapacityChecked: { type: String, default: "" },
    vacuumPumpCapacity: { type: String, trim: true, default: "" },
    vacuumPumpCapacityChecked: { type: String, default: "" },
    reservoirAvailable: { type: String, trim: true, default: "" },
    reservoirAvailableChecked: { type: String, default: "" },
    reservoirCapacity: { type: String, trim: true, default: "" },
    reservoirCapacityChecked: { type: String, default: "" },
    hosePipes: { type: String, trim: true, default: "" },
    hosePipesChecked: { type: String, default: "" },
    craneAvailable: { type: String, trim: true, default: "" },
    craneAvailableChecked: { type: String, default: "" },
    fireExtinguisher: { type: String, trim: true, default: "" },
    firstAidKit: { type: String, trim: true, default: "" },
    ppeEquipment: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 4 (Measurement Details)
const Stage1Form4SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    bushing11: { type: String, trim: true, default: "" },
    bushing12: { type: String, trim: true, default: "" },
    bushing11_05kv_phase: { type: String, trim: true, default: "" },
    bushing11_05kv_tanDelta: { type: String, trim: true, default: "" },
    bushing11_05kv_capacitance: { type: String, trim: true, default: "" },
    bushing11_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing11_05kv_dielectricLoss: { type: String, trim: true, default: "" },
    bushing12_05kv_phase: { type: String, trim: true, default: "" },
    bushing12_05kv_tanDelta: { type: String, trim: true, default: "" },
    bushing12_05kv_capacitance: { type: String, trim: true, default: "" },
    bushing12_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing12_05kv_dielectricLoss: { type: String, trim: true, default: "" },
    bushing11_10kv_phase: { type: String, trim: true, default: "" },
    bushing11_10kv_tanDelta: { type: String, trim: true, default: "" },
    bushing11_10kv_capacitance: { type: String, trim: true, default: "" },
    bushing11_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing11_10kv_dielectricLoss: { type: String, trim: true, default: "" },
    bushing12_10kv_phase: { type: String, trim: true, default: "" },
    bushing12_10kv_tanDelta: { type: String, trim: true, default: "" },
    bushing12_10kv_capacitance: { type: String, trim: true, default: "" },
    bushing12_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing12_10kv_dielectricLoss: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 1 Form 5 (Insulation Resistance)
const Stage1Form5SubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    make: { type: String, trim: true, default: "" },
    srNo: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    ambTemp: { type: String, trim: true, default: "" },
    oilTemp: { type: String, trim: true, default: "" },
    wdgTemp: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    relativeHumidity: { type: String, trim: true, default: "" },
    voltageLevel: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    ratioIR60IR15: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Filtration records (nested within Stage2Form1)
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

// Sub-schema for Stage 2 Form 1 (Oil Filtration)
const Stage2Form1SubSchema = new mongoose.Schema(
  {
    tank1NoOfBarrels: { type: String, trim: true, default: "" },
    tank1StartedDateTime: { type: String, trim: true, default: "" },
    tank1CompletedDateTime: { type: String, trim: true, default: "" },
    tank1BDV: { type: String, trim: true, default: "" },
    tank1MoistureContent: { type: String, trim: true, default: "" },
    filtrationRecords: [FiltrationRecordSchema],
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 2 Form 2 (Insulation Resistance)
const Stage2Form2SubSchema = new mongoose.Schema(
  {
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    ratioIR60IR15: { type: String, trim: true, default: "" },
    hvWithRespectToEarth: { type: String, trim: true, default: "" },
    lvWithRespectToEarth: { type: String, trim: true, default: "" },
    neutralWithRespectToEarth: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --- SUB-SCHEMAS FOR STAGE 3 ---

// Sub-schema for pressure test records
const PressureTestRecordSubSchema = new mongoose.Schema(
  {
    srNo: { type: String, trim: true, default: "" },
    timeStarted: { type: String, trim: true, default: "" },
    pressureKgCm2: { type: String, trim: true, default: "" },
    tempAmb: { type: String, trim: true, default: "" },
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 3 Form 1
const Stage3Form1SubSchema = new mongoose.Schema(
  {
    bdvKV: { type: String, trim: true, default: "" },
    waterContentPPM: { type: String, trim: true, default: "" },
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    ratioIR60IR15: { type: String, trim: true, default: "" },
    pressureTestDate: { type: String, trim: true, default: "" },
    pressureTestRecords: [PressureTestRecordSubSchema],
  },
  { _id: false }
);

// Sub-schema for individual filtration records for Stage 3 Form 2
const Stage3FiltrationRecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    mcOutletTemp: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 3 Form 2
const Stage3Form2SubSchema = new mongoose.Schema(
  {
    filtrationRecords: { type: [Stage3FiltrationRecordSubSchema], default: [] },
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    ratioIR60IR15: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for records that have the same structure in Stage 3 Form 3
const Stage3RecordSubSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    vacuumLevel: { type: String, trim: true, default: "" },
    mcOutletTemp: { type: String, trim: true, default: "" },
    otiTemp: { type: String, trim: true, default: "" },
    wtiTemp: { type: String, trim: true, default: "" },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 3 Form 3
const Stage3Form3SubSchema = new mongoose.Schema(
  {
    radiatorRecords: { type: [Stage3RecordSubSchema], default: [] },
    combineRecords: { type: [Stage3RecordSubSchema], default: [] },
    bdvKV: { type: String, trim: true, default: "" },
    waterContentPPM: { type: String, trim: true, default: "" },
    tempOTI: { type: String, trim: true, default: "" },
    tempWTI: { type: String, trim: true, default: "" },
    tempAMB: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    hvEarth600Sec: { type: String, trim: true, default: "" },
    hvEarth60600Sec: { type: String, trim: true, default: "" },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

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
    appliedVoltageValue: { type: String, trim: true, default: "" },
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

// Sub-schema for Stage 4 Form 1
const Stage4Form1SubSchema = new mongoose.Schema(
  {
    makeOfMeter: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    modelSrNo: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    testReportReviewed: { type: String, trim: true, default: "" },
    acceptanceOfTest: { type: String, trim: true, default: "" },
    // Tan delta and capacitance test on bushing
    meterUsedBushing: { type: String, trim: true, default: "" },
    dateBushing: { type: String, trim: true, default: "" },
    timeBushing: { type: String, trim: true, default: "" },
    modelSrNoBushing: { type: String, trim: true, default: "" },
    wtiBushing: { type: String, trim: true, default: "" },
    otiBushing: { type: String, trim: true, default: "" },
    // AT 05 KV PHASE - Missing phase fields
    bushing11_05kv_phase: { type: String, trim: true, default: "" },
    bushing11_05kv_tanDelta: { type: String, trim: true, default: "" },
    bushing11_05kv_capacitance: { type: String, trim: true, default: "" },
    bushing11_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing11_05kv_dielectricLoss: { type: String, trim: true, default: "" },
    bushing12_05kv_phase: { type: String, trim: true, default: "" },
    bushing12_05kv_tanDelta: { type: String, trim: true, default: "" },
    bushing12_05kv_capacitance: { type: String, trim: true, default: "" },
    bushing12_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing12_05kv_dielectricLoss: { type: String, trim: true, default: "" },
    // AT 10 KV PHASE - Missing phase fields
    bushing11_10kv_phase: { type: String, trim: true, default: "" },
    bushing11_10kv_tanDelta: { type: String, trim: true, default: "" },
    bushing11_10kv_capacitance: { type: String, trim: true, default: "" },
    bushing11_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing11_10kv_dielectricLoss: { type: String, trim: true, default: "" },
    bushing12_10kv_phase: { type: String, trim: true, default: "" },
    bushing12_10kv_tanDelta: { type: String, trim: true, default: "" },
    bushing12_10kv_capacitance: { type: String, trim: true, default: "" },
    bushing12_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    bushing12_10kv_dielectricLoss: { type: String, trim: true, default: "" },
    // Tan delta and capacitance test on winding
    meterUsedWinding: { type: String, trim: true, default: "" },
    dateWinding: { type: String, trim: true, default: "" },
    timeWinding: { type: String, trim: true, default: "" },
    makeSrNoWinding: { type: String, trim: true, default: "" },
    ambientTempWinding: { type: String, trim: true, default: "" },
    oilTempWinding: { type: String, trim: true, default: "" },
    // AT 05 KV IN BETWEEN HV-G
    hvg_05kv_phase: { type: String, trim: true, default: "" },
    hvg_05kv_tanDelta: { type: String, trim: true, default: "" },
    hvg_05kv_capacitance: { type: String, trim: true, default: "" },
    hvg_05kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvg_05kv_dielectricLoss: { type: String, trim: true, default: "" },
    // AT 10 KV IN BETWEEN HV-G
    hvg_10kv_phase: { type: String, trim: true, default: "" },
    hvg_10kv_tanDelta: { type: String, trim: true, default: "" },
    hvg_10kv_capacitance: { type: String, trim: true, default: "" },
    hvg_10kv_excitationCurrent: { type: String, trim: true, default: "" },
    hvg_10kv_dielectricLoss: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 2
const Stage4Form2SubSchema = new mongoose.Schema(
  {
    // IR Values section
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
    hvEarth10Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    ratioIR60IR10: { type: String, trim: true, default: "" },
    
    // VOLTAGE RATIO TEST - Table 1 (1.1 - 1.2, 1.1 - 2.1, 1.2 - 2.1)
    voltageRatioTest_table1_11_12: { type: String, trim: true, default: "" },
    voltageRatioTest_table1_11_21: { type: String, trim: true, default: "" },
    voltageRatioTest_table1_12_21: { type: String, trim: true, default: "" },
    
    // VOLTAGE RATIO TEST - Table 2 (1.1 - 2.1, 1.1 - 1.2, 2.1 - 1.2) - Alternative fields to avoid conflicts
    voltageRatioTest_table2_11_21_alt: { type: String, trim: true, default: "" },
    voltageRatioTest_table2_11_12_alt: { type: String, trim: true, default: "" },
    voltageRatioTest_table2_21_12: { type: String, trim: true, default: "" },
    
    // VOLTAGE RATIO TEST - Table 3 (2.1 - 1.2, 1.1 - 1.2, 1.1 - 2.1) - Alternative fields to avoid conflicts
    voltageRatioTest_table3_21_12_alt: { type: String, trim: true, default: "" },
    voltageRatioTest_table3_11_12_alt: { type: String, trim: true, default: "" },
    voltageRatioTest_table3_11_21_alt: { type: String, trim: true, default: "" },
    
    // Magnetising Current Test
    appliedVoltageMag: { type: String, trim: true, default: "" },
    dateMag: { type: String, trim: true, default: "" },
    timeMag: { type: String, trim: true, default: "" },
    meterMakeSrNoMag: { type: String, trim: true, default: "" },
    magnetisingTests: { type: [MagnetisingTestSubSchema], default: [] },
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 3
const Stage4Form3SubSchema = new mongoose.Schema(
  {
    appliedVoltage: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },
    test11_12_measuredCurrent11_23: { type: String, trim: true, default: "" },
    test11_12_measuredCurrent11: { type: String, trim: true, default: "" },
    test11_12_measuredCurrent12_21: { type: String, trim: true, default: "" },
    test12_21_measuredCurrent12_21: { type: String, trim: true, default: "" },
    test12_21_measuredCurrent12: { type: String, trim: true, default: "" },
    test12_21_measuredCurrent11_21: { type: String, trim: true, default: "" },
    appliedVoltageHV: { type: String, trim: true, default: "" },
    ratedCurrentLV: { type: String, trim: true, default: "" },
    percentZ: { type: String, trim: true, default: "" },
    ratedVoltageHV: { type: String, trim: true, default: "" },
    measuredCurrentLV: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for Stage 4 Form 4
const Stage4Form4SubSchema = new mongoose.Schema(
  {
    meterUsed: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    meterMakeSrNo: { type: String, trim: true, default: "" },
    wti: { type: String, trim: true, default: "" },
    oti: { type: String, trim: true, default: "" },
    range: { type: String, trim: true, default: "" },
    ambient: { type: String, trim: true, default: "" },
    winding11_12: { type: String, trim: true, default: "" },
    winding11_21: { type: String, trim: true, default: "" },
    winding21_12: { type: String, trim: true, default: "" },
    dateIR: { type: String, trim: true, default: "" },
    timeIR: { type: String, trim: true, default: "" },
    insulationTesterDetails: { type: String, trim: true, default: "" },
    ambTempIR: { type: String, trim: true, default: "" },
    makeIR: { type: String, trim: true, default: "" },
    oilTempIR: { type: String, trim: true, default: "" },
    srNoIR: { type: String, trim: true, default: "" },
    wdgTempIR: { type: String, trim: true, default: "" },
    rangeIR: { type: String, trim: true, default: "" },
    relativeHumidityIR: { type: String, trim: true, default: "" },
    voltageLevelIR: { type: String, trim: true, default: "" },
    hvEarth10Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    hvEarth600Sec: { type: String, trim: true, default: "" },
    ratioIR60IR10: { type: String, trim: true, default: "" },
    ratioIR600IR60: { type: String, trim: true, default: "" },
    signatures: { type: SignatureSubSchema, default: () => ({}) },
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

// Sub-schema for Stage 5 Form 1
const Stage5Form1SubSchema = new mongoose.Schema(
  {
    valveStatus: { type: Map, of: StatusQtySubSchema, default: {} },
    airVenting: { type: Map, of: StatusQtySubSchema, default: {} },
    protectionTrails: { type: Map, of: ProtectionTrailsSubSchema, default: {} },
    bushingTestTap: { type: BushingTestTapSubSchema, default: {} },
  },
  { _id: false }
);

// Sub-schema for Stage 5 Form 2
const Stage5Form2SubSchema = new mongoose.Schema(
  {
    bdvKV: { type: String, trim: true, default: "" },
    moistureContentPPM: { type: String, trim: true, default: "" },
    hvEarth15Sec: { type: String, trim: true, default: "" },
    hvEarth60Sec: { type: String, trim: true, default: "" },
    hvEarth600Sec: { type: String, trim: true, default: "" },
    oilLevelConservator: { type: String, trim: true, default: "" },
    hvJumpersConnected: { type: String, enum: ["Yes", "No", ""], default: "" },
    lvJumpersConnected: { type: String, enum: ["Yes", "No", ""], default: "" },
    incomingLACounter: { type: String, trim: true, default: "" },
    outgoingLACounter: { type: String, trim: true, default: "" },
    allCTCableTerminated: { type: String, trim: true, default: "" },
    protectionRelaysChecked: { type: String, trim: true, default: "" },
    anabondAppliedHVBushings: { type: String, trim: true, default: "" },
    allJointsSealed: { type: String, trim: true, default: "" },
    allForeignMaterialCleared: { type: String, trim: true, default: "" },
    temperatureWTI: { type: String, trim: true, default: "" },
    temperatureOTI: { type: String, trim: true, default: "" },
    remarks: { type: String, trim: true, default: "" },
    signatures: { type: DetailedSignatureSubSchema, default: () => ({}) },
    photos: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

// --- SUB-SCHEMAS FOR STAGE 6 ---

// Sub-schema for Stage 6 Form 1
const Stage6Form1SubSchema = new mongoose.Schema(
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

const AutoTransformerSchema = new mongoose.Schema(
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
    autoTransformerData: {
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
      },
      stage2: {
        form1: { type: Stage2Form1SubSchema, default: () => ({}) },
        form2: { type: Stage2Form2SubSchema, default: () => ({}) },
      },
      stage3: {
        form1: { type: Stage3Form1SubSchema, default: () => ({}) },
        form2: { type: Stage3Form2SubSchema, default: () => ({}) },
        form3: { type: Stage3Form3SubSchema, default: () => ({}) },
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
      },
      stage6: {
        form1: { type: Stage6Form1SubSchema, default: () => ({}) },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("AutoTransformer", AutoTransformerSchema);
