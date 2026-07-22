// Combined test configuration utilities (ported from preConnectionTestConfig.ts,
// postConnectionTestConfig.ts, postTankingTestConfig.ts, finalLvTestConfig.ts, hvTestListConfig.ts)

// ─── Pre-Connection ───────────────────────────────────────────────────────────

export const PRE_CONN_WINDING_TERMS = ['1.1-2', '1.1-2.1', '2.1-2'];

export const getPreConnWindingResMaxGuaranteed = (term, type, capacity) => {
  if (type === 'Auto' && capacity === '12.3MVA') {
    return term === '1.1-2' ? '0.36' : '0.18';
  }
  if (type === 'Auto' && capacity === '16.5MVA') {
    return term === '1.1-2' ? '0.26' : '0.13';
  }
  return term === '1.1-2' ? '0.66' : '0.33';
};

export const seedPreConnWindingResGuaranteed = (data, type, capacity) => {
  const updated = { ...data };
  const forceOverwrite = type === 'Auto' && (capacity === '12.3MVA' || capacity === '16.5MVA');
  PRE_CONN_WINDING_TERMS.forEach((term) => {
    const key = `res_winding_${term}_guaranteed`;
    const defaultVal = getPreConnWindingResMaxGuaranteed(term, type, capacity);
    if (forceOverwrite || updated[key] === undefined || updated[key] === '') {
      updated[key] = defaultVal;
    }
  });
  return updated;
};

// ─── Post-Connection ──────────────────────────────────────────────────────────

export const getPostConnScImpedanceLvCurrent = (type, capacity) => {
  if (type === 'Auto' && capacity === '12.3MVA') return 447.27;
  if (type === 'Auto' && capacity === '16.5MVA') return 600;
  if (type === 'Auto' && capacity === '8MVA') return 290.91;
  return 290.91;
};

export const calculatePostConnScImpedanceZ = (appliedVoltage, measuredCurrent, type, capacity) => {
  if (isNaN(appliedVoltage) || isNaN(measuredCurrent) || measuredCurrent === 0) return '';
  const lvCurrent = getPostConnScImpedanceLvCurrent(type, capacity);
  return ((appliedVoltage / 55000) * (lvCurrent / measuredCurrent) * 100).toFixed(2);
};

export const getPostConnWindingResMaxGuaranteed = getPreConnWindingResMaxGuaranteed;

export const seedPostConnWindingResGuaranteed = (data, type, capacity) => {
  const updated = { ...data };
  const forceOverwrite = type === 'Auto' && capacity === '12.3MVA';
  PRE_CONN_WINDING_TERMS.forEach((term) => {
    const key = `pct_res_${term}_max`;
    const defaultVal = getPostConnWindingResMaxGuaranteed(term, type, capacity);
    if (forceOverwrite || updated[key] === undefined || updated[key] === '') {
      updated[key] = defaultVal;
    }
  });
  return updated;
};

// ─── Post-Tanking ─────────────────────────────────────────────────────────────

export const calculatePostTankingScImpedanceZ = calculatePostConnScImpedanceZ;
export const getPostTankingWindingResMaxGuaranteed = getPreConnWindingResMaxGuaranteed;

export const seedPostTankingWindingResGuaranteed = (data, type, capacity) => {
  const updated = { ...data };
  const forceOverwrite = type === 'Auto' && capacity === '12.3MVA';
  PRE_CONN_WINDING_TERMS.forEach((term) => {
    const key = `pt_res_${term}_max`;
    const defaultVal = getPostTankingWindingResMaxGuaranteed(term, type, capacity);
    if (forceOverwrite || updated[key] === undefined || updated[key] === '') {
      updated[key] = defaultVal;
    }
  });
  return updated;
};

// ─── Final LV ─────────────────────────────────────────────────────────────────

export const calculateFinalLvScImpedanceZ = calculatePostConnScImpedanceZ;
export const getFinalLvWindingResMaxGuaranteed = getPreConnWindingResMaxGuaranteed;

const toLvWrTermKey = (term) => term.replace('.', '_');

export const seedFinalLvWindingResGuaranteed = (data, type, capacity) => {
  const updated = { ...data };
  const forceOverwrite = type === 'Auto' && capacity === '12.3MVA';
  PRE_CONN_WINDING_TERMS.forEach((term) => {
    const key = `lv_wr_${toLvWrTermKey(term)}_max`;
    const defaultVal = getFinalLvWindingResMaxGuaranteed(term, type, capacity);
    if (forceOverwrite || updated[key] === undefined || updated[key] === '') {
      updated[key] = defaultVal;
    }
  });
  return updated;
};

// ─── HV Test List ─────────────────────────────────────────────────────────────

export const HV_NLL_VOLTAGE_ROWS = ['90', '100', '110'];

const DEFAULT_HV_LL_CONFIG = {
  ctRatio: '200/1', ctFactor: 200, mf: 2000,
  ratedA: '145.45', ratedADefault: 145.45,
  guarLoss: '16kW', guarZPercent: '0.49%',
  ptFactor: 10, ratedV: 55000,
};

const AUTO_12_3MVA_HV_LL_CONFIG = {
  ctRatio: '250/1', ctFactor: 250, mf: 2500,
  ratedA: '223.64', ratedADefault: 223.64,
  guarLoss: '22kW', guarZPercent: '0.49%',
  ptFactor: 10, ratedV: 55000,
};

const AUTO_16_5MVA_HV_LL_CONFIG = {
  ctRatio: '500/1', ctFactor: 500, mf: 5000,
  ratedA: '300.00', ratedADefault: 300,
  guarLoss: '26kW', guarZPercent: '0.55%',
  ptFactor: 10, ratedV: 55000,
};

export const getHVLLConfig = (type, capacity) => {
  if (type === 'Auto' && capacity === '12.3MVA') return AUTO_12_3MVA_HV_LL_CONFIG;
  if (type === 'Auto' && capacity === '16.5MVA') return AUTO_16_5MVA_HV_LL_CONFIG;
  return DEFAULT_HV_LL_CONFIG;
};

export const applyHVLLCalculations = (updated, type, capacity) => {
  const config = getHVLLConfig(type, capacity);
  const mf = parseFloat(updated['hv_ll_mf'] || String(config.mf)) || config.mf;
  const u1 = parseFloat(updated['hv_ll_u1'] || '');
  const u3 = parseFloat(updated['hv_ll_u3'] || '');
  const i1 = parseFloat(updated['hv_ll_i1'] || '');
  const i3 = parseFloat(updated['hv_ll_i3'] || '');
  const p = parseFloat(updated['hv_ll_p'] || '');
  const ratedV = parseFloat(updated['hv_ll_rated_v'] || String(config.ratedV)) || config.ratedV;
  const ratedA = parseFloat(updated['hv_ll_rated_a'] || config.ratedA) || config.ratedADefault;

  if (!isNaN(u1) && !isNaN(u3)) {
    const meterV = u1 + u3;
    updated['hv_ll_meter_v'] = meterV.toFixed(4);
    updated['hv_ll_measured_v'] = (meterV * config.ptFactor).toFixed(2);
  } else {
    updated['hv_ll_meter_v'] = '';
    updated['hv_ll_measured_v'] = '';
  }

  if (!isNaN(i1) && !isNaN(i3)) {
    const meterI = (i1 + i3) / 2;
    updated['hv_ll_meter_i'] = meterI.toFixed(4);
    updated['hv_ll_applied_a'] = (meterI * config.ctFactor).toFixed(2);
  } else {
    updated['hv_ll_meter_i'] = '';
    updated['hv_ll_applied_a'] = '';
  }

  if (!isNaN(p)) {
    updated['hv_ll_meter_w'] = p.toFixed(4);
  } else {
    updated['hv_ll_meter_w'] = '';
  }

  const appliedA = parseFloat(updated['hv_ll_applied_a'] || '');
  const measuredV = parseFloat(updated['hv_ll_measured_v'] || '');
  const meterW = parseFloat(updated['hv_ll_meter_w'] || '');

  if (appliedA > 0 && !isNaN(meterW)) {
    updated['hv_ll_loss_corrected'] = ((meterW * mf / 1000) * Math.pow(ratedA / appliedA, 2)).toFixed(4);
  } else {
    updated['hv_ll_loss_corrected'] = '';
  }

  if (appliedA > 0 && !isNaN(measuredV)) {
    updated['hv_ll_z_percent'] = ((measuredV / ratedV) * (ratedA / appliedA) * 100).toFixed(4);
  } else {
    updated['hv_ll_z_percent'] = '';
  }
};

const DEFAULT_NLL_GUARANTEED = {
  '90': { curr: '1.2', pow: '3.60' },
  '100': { curr: '1.8', pow: '4.40' },
  '110': { curr: '3.0', pow: '5.50' },
};

const AUTO_12_3MVA_NLL_GUARANTEED = {
  '90': { curr: '1.0', pow: '5.80' },
  '100': { curr: '1.5', pow: '6.80' },
  '110': { curr: '2.8', pow: '8.80' },
};

const AUTO_16_5MVA_NLL_GUARANTEED = {
  '90': { curr: '1.0', pow: '6.50' },
  '100': { curr: '1.5', pow: '7.00' },
  '110': { curr: '2.8', pow: '8.30' },
};

const getNllGuaranteedConfig = (type, capacity) => {
  if (type === 'Auto' && capacity === '12.3MVA') return AUTO_12_3MVA_NLL_GUARANTEED;
  if (type === 'Auto' && capacity === '16.5MVA') return AUTO_16_5MVA_NLL_GUARANTEED;
  return DEFAULT_NLL_GUARANTEED;
};

export const getHVNllGuaranteedCurrent = (rowKey, type, capacity) => {
  const config = getNllGuaranteedConfig(type, capacity);
  return config[rowKey]?.curr ?? DEFAULT_NLL_GUARANTEED['100'].curr;
};

export const getHVNllGuaranteedPower = (rowKey, type, capacity) => {
  const config = getNllGuaranteedConfig(type, capacity);
  return config[rowKey]?.pow ?? DEFAULT_NLL_GUARANTEED['100'].pow;
};

export const seedHVTestListDefaults = (data, type, capacity) => {
  const updated = { ...data };
  const forceOverwrite = type === 'Auto' && (capacity === '12.3MVA' || capacity === '16.5MVA');
  const config = getHVLLConfig(type, capacity);

  HV_NLL_VOLTAGE_ROWS.forEach((rowKey) => {
    const currKey = `hv_nll_${rowKey}_curr_g`;
    const powKey = `hv_nll_${rowKey}_pow_g`;
    if (forceOverwrite || updated[currKey] === undefined || updated[currKey] === '') {
      updated[currKey] = getHVNllGuaranteedCurrent(rowKey, type, capacity);
    }
    if (forceOverwrite || updated[powKey] === undefined || updated[powKey] === '') {
      updated[powKey] = getHVNllGuaranteedPower(rowKey, type, capacity);
    }
  });

  const llDefaults = {
    hv_ll_ct: config.ctRatio,
    hv_ll_mf: String(config.mf),
    hv_ll_rated_a: config.ratedA,
    hv_ll_guar_loss: config.guarLoss,
    hv_ll_guar_z_percent: config.guarZPercent,
  };

  Object.entries(llDefaults).forEach(([key, value]) => {
    if (forceOverwrite || updated[key] === undefined || updated[key] === '') {
      updated[key] = value;
    }
  });

  return updated;
};