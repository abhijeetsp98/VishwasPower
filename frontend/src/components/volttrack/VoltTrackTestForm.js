import React, { useState, useCallback, useRef } from 'react';
import { getCTConfig, seedCTNameplateDefaults, getRatioAppliedPrimary } from './config/ctTestConfig';
import {
  seedPreConnWindingResGuaranteed,
  seedPostConnWindingResGuaranteed,
  calculatePostConnScImpedanceZ,
  seedPostTankingWindingResGuaranteed,
  calculatePostTankingScImpedanceZ,
  seedFinalLvWindingResGuaranteed,
  calculateFinalLvScImpedanceZ,
  getPreConnWindingResMaxGuaranteed,
  getPostConnWindingResMaxGuaranteed,
  getPostTankingWindingResMaxGuaranteed,
  getFinalLvWindingResMaxGuaranteed,
  seedHVTestListDefaults,
  applyHVLLCalculations,
  getHVLLConfig,
  getHVNllGuaranteedCurrent,
  getHVNllGuaranteedPower,
  HV_NLL_VOLTAGE_ROWS,
  PRE_CONN_WINDING_TERMS,
} from './config/testConfigs';

const NAMES_TECHNICIANS = [
  'NITIN PATIL', 'PANKAJ KAWLE', 'AKASH PANCHESWAR', 'CHANCHALESH RABLE',
  'ROHIT SONEWANE', 'RIPEKSHIT TUMBALE', 'ABHIJIT KHARKATE', 'HEMANT BHAGAT',
];
const NAMES_REVIEWERS = ['SOMYA DAS', 'GAURAV KUREKAR', 'KAPIL GAUTAM', 'HEMANT BHAGAT', 'PANKAJ KAWLE'];
const NAMES_AUTHORIZERS = ['KIRAN JOHARAPURKAR', 'SHREYASH BHAVE', 'VIKAS CHAUHAN'];

const RATIO_ROWS = ['20%', '40%', '60%', '80%', '100%'];
const KNEE_ROWS = ['20%', '40%', '60%', '80%', '100%', '110%'];

// ── Shared Field Component ────────────────────────────────────────────────────
function Field({ id, data, onChange, pdfValue = '', label, placeholder = '-', type = 'text', readOnly = false, className = '' }) {
  const value = data[id] !== undefined ? data[id] : (pdfValue || '');
  return (
    <div className={`vt-field ${className}`}>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => !readOnly && onChange(id, e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
}

// ── Company Header ────────────────────────────────────────────────────────────
function CompanyHeader() {
  return (
    <div className="vt-company-header">
      <img src="/logo.png" alt="Vishvas Power Logo" />
      <h1>M/S VISHVAS POWER ENGINEERING SERVICES (P) LTD</h1>
      <p>K-5, MIDC, BUTIBORI INDUSTRIAL AREA, NAGPUR</p>
    </div>
  );
}

// ── Signature Section ─────────────────────────────────────────────────────────
function SignatureSection({ data, onChange, currentRole, prefix = '' }) {
  const testedKey = prefix ? `${prefix}_tested_by` : 'tested_by';
  const testedAtKey = prefix ? `${prefix}_tested_at` : 'tested_at';
  const reviewedKey = prefix ? `${prefix}_reviewed_by` : 'reviewed_by';
  const reviewedAtKey = prefix ? `${prefix}_reviewed_at` : 'reviewed_at';
  const authorizedKey = prefix ? `${prefix}_authorized_by` : 'authorized_by';
  const authorizedAtKey = prefix ? `${prefix}_authorized_at` : 'authorized_at';

  const handleSelect = (key, atKey, value) => {
    const updated = { ...data, [key]: value, [atKey]: value ? new Date().toLocaleString() : '' };
    onChange(key, value);
    onChange(atKey, updated[atKey]);
  };

  return (
    <div className="vt-signature-row">
      <div className="vt-signature-box">
        <select
          className="vt-signature-select"
          value={data[testedKey] || ''}
          onChange={(e) => handleSelect(testedKey, testedAtKey, e.target.value)}
        >
          <option value="">Select Technician</option>
          {NAMES_TECHNICIANS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {data[testedAtKey] && <div className="vt-signature-timestamp">{data[testedAtKey]}</div>}
        <div className="vt-signature-label">TESTED BY</div>
      </div>
      <div className="vt-signature-box">
        <select
          className="vt-signature-select"
          value={data[reviewedKey] || ''}
          onChange={(e) => handleSelect(reviewedKey, reviewedAtKey, e.target.value)}
          disabled={currentRole === 'Admin_Tested'}
        >
          <option value="">Select Reviewer</option>
          {NAMES_REVIEWERS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {data[reviewedAtKey] && <div className="vt-signature-timestamp">{data[reviewedAtKey]}</div>}
        <div className="vt-signature-label">REVIEWED BY</div>
      </div>
      <div className="vt-signature-box">
        <select
          className="vt-signature-select"
          value={data[authorizedKey] || ''}
          onChange={(e) => handleSelect(authorizedKey, authorizedAtKey, e.target.value)}
          disabled={currentRole === 'Admin_Tested' || currentRole === 'Admin_Reviewed'}
        >
          <option value="">Select Authorizer</option>
          {NAMES_AUTHORIZERS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {data[authorizedAtKey] && <div className="vt-signature-timestamp">{data[authorizedAtKey]}</div>}
        <div className="vt-signature-label">AUTHORIZED BY</div>
      </div>
    </div>
  );
}

// ── CT TEST ───────────────────────────────────────────────────────────────────
function CTTestForm({ data, onChange, job, currentRole }) {
  const ctConfig = getCTConfig(job?.type, job?.capacity);

  return (
    <div>
      <CompanyHeader />
      <div className="vt-section-title">Name Plate Details</div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>Sr.</th>
              <th>Description</th>
              {ctConfig.sections.map((s) => <th key={s} style={{ textAlign: 'center', color: '#2563eb' }}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {ctConfig.nameplateRows.map((row) => (
              <tr key={row.key}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>{row.id}</td>
                <td style={{ fontWeight: 600 }}>{row.label}</td>
                {ctConfig.sections.map((s) => (
                  <td key={s} style={{ padding: 4 }}>
                    <Field id={`np_${s}_${row.key}`} data={data} onChange={onChange} pdfValue={row.defaults[s]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ctConfig.sections.map((section) => (
        <div key={section} style={{ marginBottom: 32, border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, left: 16, background: 'white', padding: '0 8px', color: '#2563eb', fontWeight: 700, fontSize: 11, border: '1px solid #2563eb', borderRadius: 20 }}>
            SECTION {section}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Ratio Test */}
            <div>
              <div className="vt-section-title">Ratio Test Core S1-S2</div>
              <div className="vt-table-wrapper">
                <table className="vt-table">
                  <thead>
                    <tr>
                      <th>Current %</th>
                      <th style={{ textAlign: 'center' }}>Applied Primary (A)</th>
                      <th style={{ textAlign: 'center', background: '#fffbeb' }}>Measured Secondary (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RATIO_ROWS.map((pct) => (
                      <tr key={pct}>
                        <td style={{ fontWeight: 700 }}>{pct}</td>
                        <td style={{ textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>
                          {getRatioAppliedPrimary(section, pct, data[`np_${section}_ratio`], job?.type, job?.capacity)}
                        </td>
                        <td style={{ padding: 4 }}>
                          <Field id={`ratio_${section}_${pct}_measured`} data={data} onChange={onChange} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Knee Point */}
            <div>
              {section !== 'WTI' ? (
                <>
                  <div className="vt-section-title">Knee Point Voltage</div>
                  <div className="vt-table-wrapper" style={{ marginBottom: 12 }}>
                    <table className="vt-table">
                      <thead>
                        <tr>
                          <th>Voltage %</th>
                          <th style={{ textAlign: 'center' }}>Applied (V)</th>
                          <th style={{ textAlign: 'center', background: '#eff6ff' }}>Measured (mA)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {KNEE_ROWS.map((pct) => {
                          const kneeV = parseFloat(data[`np_${section}_knee_v`] || ctConfig.getKneeFallback(section));
                          const val = (parseFloat(pct) / 100) * kneeV;
                          const calc = isNaN(val) ? '-' : (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1));
                          return (
                            <tr key={pct}>
                              <td style={{ fontWeight: 700 }}>{pct}</td>
                              <td style={{ textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>{calc}</td>
                              <td style={{ padding: 4 }}>
                                <Field id={`kv_${section}_${pct}_measured`} data={data} onChange={onChange} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="vt-section-title">Auxiliary Checks</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 6, padding: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>Continuity:</span>
                  <Field id={`cont_${section}`} data={data} onChange={onChange} placeholder="OK / Not OK" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 6, padding: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>Resistance:</span>
                  <Field id={`res_${section}`} data={data} onChange={onChange} placeholder="Value" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>Ω</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} />
    </div>
  );
}

// ── BUSHING TEST ──────────────────────────────────────────────────────────────
function BushingTestForm({ data, onChange, currentRole }) {
  const SECTIONS = ['1.1', '2'];
  const VOLTAGES = ['05 KV', '10 KV'];
  return (
    <div>
      <CompanyHeader />
      <div className="vt-grid-2" style={{ marginBottom: 20 }}>
        <Field id="bushing_make" data={data} onChange={onChange} label="Temp (°C)" />
        <Field id="bushing_sr_no" data={data} onChange={onChange} label="Humidity (%)" />
        <Field id="bushing_meter_make" data={data} onChange={onChange} pdfValue="DOBEL" label="Meter Make" />
        <Field id="bushing_meter_sr" data={data} onChange={onChange} label="SL. NO." />
      </div>
      {SECTIONS.map((sec) => (
        <div key={sec} style={{ marginBottom: 24, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '8px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>SECTION {sec} — Mode: UST R/B</span>
          </div>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field id={sec === '1.1' ? 'section1_1_sr_no' : 'section2_sr_no'} data={data} onChange={onChange} label="Sr. No." />
            <Field id={sec === '1.1' ? 'section1_1_make' : 'section2_make'} data={data} onChange={onChange} label="Make" />
          </div>
          <div className="vt-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="vt-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>VOLTAGE (kV)</th>
                  <th style={{ textAlign: 'center' }}>TAN DELTA (%)</th>
                  <th style={{ textAlign: 'center' }}>CAPACITANCE (pF)</th>
                  <th style={{ textAlign: 'center' }}>EXCITATION CURRENT (mA)</th>
                  <th style={{ textAlign: 'center' }}>DIELECTRIC LOSS (W)</th>
                </tr>
              </thead>
              <tbody>
                {VOLTAGES.map((v) => (
                  <tr key={v}>
                    <td style={{ fontWeight: 700, background: '#f8fafc' }}>{v}</td>
                    {['tan_delta', 'capacitance', 'excitation', 'dielectric'].map((col) => (
                      <td key={col} style={{ padding: 4 }}>
                        <Field id={`bushing_${sec}_${v}_${col}`} data={data} onChange={onChange} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} />
    </div>
  );
}

// ── 2 KV TEST ─────────────────────────────────────────────────────────────────
function TwoKVTestForm({ data, onChange, currentRole }) {
  const SECTIONS = ['HORIZANTAL', 'VERTICAL'];
  const ROWS = ['CORE-FRAME', 'FRAME-FRAME'];
  return (
    <div>
      <CompanyHeader />
      {SECTIONS.map((section) => (
        <div key={section} style={{ marginBottom: 24, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{section} — 2KV TESTING</span>
          </div>
          <div className="vt-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="vt-table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>{section}</th>
                  <th style={{ textAlign: 'center' }}>Voltage Applied (kV)</th>
                  <th style={{ textAlign: 'center' }}>Duration (Sec)</th>
                  <th style={{ textAlign: 'center' }}>Leakage Current (mA)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const key = `2kv_${section.toLowerCase()}_${row.toLowerCase().replace('-', '_')}`;
                  return (
                    <tr key={row}>
                      <td style={{ fontWeight: 700, background: '#f8fafc' }}>{row}</td>
                      <td style={{ padding: 4 }}><Field id={`${key}_voltage`} data={data} onChange={onChange} pdfValue="2" /></td>
                      <td style={{ padding: 4 }}><Field id={`${key}_duration`} data={data} onChange={onChange} pdfValue="60" /></td>
                      <td style={{ padding: 4 }}><Field id={`${key}_leakage`} data={data} onChange={onChange} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} />
    </div>
  );
}

// ── PRE-CONNECTION TEST ───────────────────────────────────────────────────────
function PreConnectionTestForm({ data, onChange, job, currentRole }) {
  const RATIO_TERMINALS = ['(1.1-2.)-(2.1-2)', '(1.1-2)-(2.1-1.1)', '(1.1-2.1)-(2-2.1)'];
  const MAG_TERMINALS = ['1.1-2', '1.1-2.1', '2.1-2'];

  return (
    <div>
      <CompanyHeader />

      {/* 1. IR Values */}
      <div className="vt-section-title">1. Measurement of IR Values</div>
      <div className="vt-grid-2" style={{ marginBottom: 16 }}>
        <Field id="ir_date" data={data} onChange={onChange} label="Date" type="date" />
        <Field id="ir_time" data={data} onChange={onChange} label="Time" type="time" />
        <Field id="ir_amb_temp" data={data} onChange={onChange} label="Ambient Temp (°C)" />
        <Field id="ir_core_temp" data={data} onChange={onChange} label="Core Temp (°C)" />
        <Field id="ir_wdg_temp" data={data} onChange={onChange} label="Wdg. Temp (°C)" />
        <Field id="ir_humidity" data={data} onChange={onChange} label="Relative Humidity (%)" />
        <Field id="ir_tester_make" data={data} onChange={onChange} label="Tester Make" pdfValue="MEGGER" />
        <Field id="ir_tester_sr_no" data={data} onChange={onChange} label="Tester Sr. No" pdfValue="A01148D22" />
        <Field id="ir_tester_range" data={data} onChange={onChange} label="Range" pdfValue="1-TO-5 kV" />
        <Field id="ir_tester_voltage_level" data={data} onChange={onChange} label="Voltage Level" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead><tr><th>Combination</th><th style={{ textAlign: 'center' }}>15 Sec (MΩ)</th><th style={{ textAlign: 'center' }}>60 Sec (MΩ)</th><th style={{ textAlign: 'center' }}>Ratio (60s/15s)</th></tr></thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, background: '#f8fafc' }}>WINDING-EARTH</td>
              <td style={{ padding: 4 }}><Field id="ir_winding_earth_15s" data={data} onChange={onChange} /></td>
              <td style={{ padding: 4 }}><Field id="ir_winding_earth_60s" data={data} onChange={onChange} /></td>
              <td style={{ padding: 4 }}><Field id="ir_winding_earth_ratio" data={data} onChange={onChange} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Ratio Test */}
      <div className="vt-section-title">2. Ratio Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="ratio_meter_make" data={data} onChange={onChange} label="Meter Make" pdfValue="Eltel" />
        <Field id="ratio_meter_sr_no" data={data} onChange={onChange} label="Meter Sr. No" />
        <Field id="ratio_test_date" data={data} onChange={onChange} label="Test Date" type="date" />
        <Field id="ratio_test_time" data={data} onChange={onChange} label="Test Time" type="time" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead><tr><th>Terminals</th><th style={{ textAlign: 'center' }}>Cal. Ratio</th><th style={{ textAlign: 'center' }}>Measured Ratio</th><th style={{ textAlign: 'center' }}>Deviation %</th></tr></thead>
          <tbody>
            {RATIO_TERMINALS.map((term) => (
              <tr key={term}>
                <td style={{ fontWeight: 700, background: '#f8fafc' }}>{term}</td>
                <td style={{ padding: 4 }}><Field id={`ratio_${term}_cal`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`ratio_${term}_measured`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`ratio_${term}_deviation`} data={data} onChange={onChange} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Magnetizing Current */}
      <div className="vt-section-title">3. Magnetizing Current Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="mag_applied_volt" data={data} onChange={onChange} label="Applied Voltage (V)" />
        <Field id="mag_date" data={data} onChange={onChange} label="Date" type="date" />
        <Field id="mag_time" data={data} onChange={onChange} label="Time" type="time" />
        <Field id="mag_meter_make" data={data} onChange={onChange} label="Meter Make" pdfValue="HTC" />
        <Field id="mag_meter_sr_no" data={data} onChange={onChange} label="Meter Sr. No" pdfValue="HTC2406CG0246" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead><tr><th>Terminals</th><th style={{ textAlign: 'center' }}>Applied Voltage (V)</th><th style={{ textAlign: 'center' }}>Measured Current (mA)</th></tr></thead>
          <tbody>
            {MAG_TERMINALS.map((term) => (
              <tr key={term}>
                <td style={{ fontWeight: 700, background: '#f8fafc' }}>{term}</td>
                <td style={{ padding: 4 }}><Field id={`mag_curr_${term}_v`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`mag_curr_${term}_measured`} data={data} onChange={onChange} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Winding Resistance */}
      <div className="vt-section-title">4. Winding Resistance Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="res_meter_make" data={data} onChange={onChange} label="Meter Make" />
        <Field id="res_meter_sr_no" data={data} onChange={onChange} label="Meter Sr. No" />
        <Field id="res_meter_range" data={data} onChange={onChange} label="Range" />
        <Field id="res_test_date" data={data} onChange={onChange} label="Test Date" type="date" />
        <Field id="res_test_time" data={data} onChange={onChange} label="Test Time" type="time" />
        <Field id="res_env_wdg" data={data} onChange={onChange} label="Wdg Temp (°C)" />
        <Field id="res_env_core" data={data} onChange={onChange} label="Core Temp (°C)" />
        <Field id="res_env_ambient" data={data} onChange={onChange} label="Ambient Temp (°C)" />
        <Field id="res_env_humidity" data={data} onChange={onChange} label="Humidity (%)" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead>
            <tr>
              <th>Terminals</th>
              <th style={{ textAlign: 'center' }}>Resistance @ Amb. (Ω)</th>
              <th style={{ textAlign: 'center', background: '#fff7ed', color: '#c2410c' }}>Resistance @75°C (Ω)</th>
              <th style={{ textAlign: 'center' }}>Max. Guaranteed @75°C (Ω)</th>
            </tr>
          </thead>
          <tbody>
            {MAG_TERMINALS.map((term) => (
              <tr key={term}>
                <td style={{ fontWeight: 700, background: '#f8fafc' }}>{term}</td>
                <td style={{ padding: 4 }}><Field id={`res_winding_${term}_amb`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4, background: '#fff7ed' }}><Field id={`res_winding_${term}_75c`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`res_winding_${term}_guaranteed`} data={data} onChange={onChange} pdfValue={getPreConnWindingResMaxGuaranteed(term, job?.type, job?.capacity)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} />
    </div>
  );
}

// ── POST-CONNECTION TEST ──────────────────────────────────────────────────────
function PostConnectionTestForm({ data, onChange, job, currentRole }) {
  const RATIO_TERMINALS = ['(1.1-2.)-(2.1-2)', '(1.1-2)-(2.1-1.1)', '(1.1-2.1)-(2-2.1)'];
  const MAG_TERMINALS = ['1.1-2', '1.1-2.1', '2.1-2'];
  const fixedCalRatios = { '(1.1-2.)-(2.1-2)': '2', '(1.1-2)-(2.1-1.1)': '2', '(1.1-2.1)-(2-2.1)': '1' };

  const scZ1 = calculatePostConnScImpedanceZ(parseFloat(data['pct_sc_v1'] || ''), parseFloat(data['pct_sc_ref1'] || ''), job?.type, job?.capacity);
  const scZ2 = calculatePostConnScImpedanceZ(parseFloat(data['pct_sc_v2'] || ''), parseFloat(data['pct_sc_ref2'] || ''), job?.type, job?.capacity);

  return (
    <div>
      <CompanyHeader />

      {/* 1. IR Values */}
      <div className="vt-section-title">1. Measurement of IR Values</div>
      <div className="vt-grid-2" style={{ marginBottom: 16 }}>
        <Field id="pct_date" data={data} onChange={onChange} label="Date" type="date" />
        <Field id="pct_time" data={data} onChange={onChange} label="Time" type="time" />
        <Field id="pct_amb_temp" data={data} onChange={onChange} label="Amb. Temp (°C)" />
        <Field id="pct_wdg_temp" data={data} onChange={onChange} label="Wdg. Temp (°C)" />
        <Field id="pct_core_temp" data={data} onChange={onChange} label="Core Temp (°C)" />
        <Field id="pct_humidity" data={data} onChange={onChange} label="Relative Humidity (%)" />
        <Field id="pct_tester_make" data={data} onChange={onChange} label="Tester Make" />
        <Field id="pct_tester_sr_no" data={data} onChange={onChange} label="Tester Sr. No" />
        <Field id="pct_tester_range" data={data} onChange={onChange} label="Range" />
        <Field id="pct_tester_v_level" data={data} onChange={onChange} label="Voltage Level" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead><tr><th>Combination</th><th style={{ textAlign: 'center' }}>15 Sec (MΩ)</th><th style={{ textAlign: 'center' }}>60 Sec (MΩ)</th><th style={{ textAlign: 'center' }}>Ratio (60/15s)</th></tr></thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, background: '#f8fafc' }}>WINDING-EARTH</td>
              <td style={{ padding: 4 }}><Field id="pct_ir_15s" data={data} onChange={onChange} /></td>
              <td style={{ padding: 4 }}><Field id="pct_ir_60s" data={data} onChange={onChange} /></td>
              <td style={{ padding: 4 }}><Field id="pct_ir_ratio" data={data} onChange={onChange} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Ratio Test */}
      <div className="vt-section-title">2. Ratio Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="pct_ratio_meter_make" data={data} onChange={onChange} label="Meter Make" pdfValue="Eltel" />
        <Field id="pct_ratio_meter_sr_no" data={data} onChange={onChange} label="Meter Sr. No" />
        <Field id="pct_ratio_test_date" data={data} onChange={onChange} label="Test Date" type="date" />
        <Field id="pct_ratio_test_time" data={data} onChange={onChange} label="Test Time" type="time" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead><tr><th>Terminals</th><th style={{ textAlign: 'center' }}>Cal. Ratio</th><th style={{ textAlign: 'center' }}>Measured Ratio</th><th style={{ textAlign: 'center' }}>Deviation %</th></tr></thead>
          <tbody>
            {RATIO_TERMINALS.map((term) => (
              <tr key={term}>
                <td style={{ fontWeight: 700, background: '#f8fafc' }}>{term}</td>
                <td style={{ padding: 4 }}><Field id={`pct_ratio_${term}_cal`} data={data} onChange={onChange} pdfValue={fixedCalRatios[term]} /></td>
                <td style={{ padding: 4 }}><Field id={`pct_ratio_${term}_measured`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`pct_ratio_${term}_dev`} data={data} onChange={onChange} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Short Circuit Test */}
      <div className="vt-section-title">3. Short Circuit Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="pct_sc_meter_make" data={data} onChange={onChange} label="Meter Make" pdfValue="HTC" />
        <Field id="pct_sc_sr_no" data={data} onChange={onChange} label="Meter Sr. No" pdfValue="HTC2406CG0246" />
        <Field id="pct_sc_date" data={data} onChange={onChange} label="Test Date" type="date" />
        <Field id="pct_sc_time" data={data} onChange={onChange} label="Test Time" type="time" />
      </div>
      <div className="vt-grid-2" style={{ marginBottom: 16 }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>Row 1: 1.1-2 (2-2.1 Short)</div>
          <div className="vt-grid-3">
            <Field id="pct_sc_v1" data={data} onChange={onChange} label="Applied Voltage (V)" />
            <Field id="pct_sc_a1" data={data} onChange={onChange} label="Measured Current (A)" />
            <Field id="pct_sc_ref1" data={data} onChange={onChange} label="Short Current (A)" />
          </div>
        </div>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>Row 2: 1.1-2 (1.1-2.1 Short)</div>
          <div className="vt-grid-3">
            <Field id="pct_sc_v2" data={data} onChange={onChange} label="Applied Voltage (V)" />
            <Field id="pct_sc_a2" data={data} onChange={onChange} label="Measured Current (A)" />
            <Field id="pct_sc_ref2" data={data} onChange={onChange} label="Short Current (A)" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>% Z (Row 1) =</span>
          <Field id="pct_sc_z" data={data} onChange={onChange} pdfValue={scZ1} />
          <span style={{ fontWeight: 700 }}>%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>% Z (Row 2) =</span>
          <Field id="pct_sc_z2" data={data} onChange={onChange} pdfValue={scZ2} />
          <span style={{ fontWeight: 700 }}>%</span>
        </div>
      </div>

      {/* 4. Winding Resistance */}
      <div className="vt-section-title">4. Winding Resistance Test</div>
      <div className="vt-grid-4" style={{ marginBottom: 16 }}>
        <Field id="pct_res_meter_make" data={data} onChange={onChange} label="Meter Make" />
        <Field id="pct_res_sr_no" data={data} onChange={onChange} label="Meter Sr. No." />
        <Field id="pct_res_range" data={data} onChange={onChange} label="Range" />
        <Field id="pct_res_wdg_temp" data={data} onChange={onChange} label="Wdg Temp (°C)" />
        <Field id="pct_res_core_temp" data={data} onChange={onChange} label="Core Temp (°C)" />
        <Field id="pct_res_amb_temp" data={data} onChange={onChange} label="Ambient (°C)" />
        <Field id="pct_res_humidity" data={data} onChange={onChange} label="Humidity (%)" />
      </div>
      <div className="vt-table-wrapper" style={{ marginBottom: 24 }}>
        <table className="vt-table">
          <thead>
            <tr>
              <th>Terminals</th>
              <th style={{ textAlign: 'center' }}>Resistance @ Amb. (Ω)</th>
              <th style={{ textAlign: 'center', background: '#fff7ed', color: '#c2410c' }}>Resistance @75°C (Ω)</th>
              <th style={{ textAlign: 'center' }}>Max. Guaranteed @75°C (Ω)</th>
            </tr>
          </thead>
          <tbody>
            {MAG_TERMINALS.map((term) => (
              <tr key={term}>
                <td style={{ fontWeight: 700, background: '#f8fafc' }}>{term}</td>
                <td style={{ padding: 4 }}><Field id={`pct_res_${term}_amb`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4, background: '#fff7ed' }}><Field id={`pct_res_${term}_75c`} data={data} onChange={onChange} /></td>
                <td style={{ padding: 4 }}><Field id={`pct_res_${term}_max`} data={data} onChange={onChange} pdfValue={getPostConnWindingResMaxGuaranteed(term, job?.type, job?.capacity)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} prefix="pct" />
    </div>
  );
}

// ── GENERIC FORM (for remaining test types) ───────────────────────────────────
function GenericTestForm({ testName, data, onChange, currentRole }) {
  const fields = Object.entries(data).filter(([k]) => !k.startsWith('_') && k !== 'tested_by' && k !== 'reviewed_by' && k !== 'authorized_by' && k !== 'tested_at' && k !== 'reviewed_at' && k !== 'authorized_at');

  return (
    <div>
      <CompanyHeader />
      <div className="vt-section-title">{testName}</div>
      {fields.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <p style={{ fontSize: 13, fontWeight: 600 }}>Start filling in the form fields below.</p>
          <p style={{ fontSize: 12, color: '#cbd5e1' }}>Data will be saved automatically when you click Save.</p>
        </div>
      ) : (
        <div className="vt-grid-2" style={{ marginBottom: 24 }}>
          {fields.map(([key]) => (
            <Field key={key} id={key} data={data} onChange={onChange} label={key.replace(/_/g, ' ').toUpperCase()} />
          ))}
        </div>
      )}
      {/* Add common fields for all generic forms */}
      <div className="vt-section-title" style={{ marginTop: 24 }}>General Observations</div>
      <div className="vt-grid-2" style={{ marginBottom: 24 }}>
        <Field id="gen_date" data={data} onChange={onChange} label="Date" type="date" />
        <Field id="gen_time" data={data} onChange={onChange} label="Time" type="time" />
        <Field id="gen_amb_temp" data={data} onChange={onChange} label="Ambient Temp (°C)" />
        <Field id="gen_humidity" data={data} onChange={onChange} label="Humidity (%)" />
        <Field id="gen_remarks" data={data} onChange={onChange} label="Remarks" />
      </div>
      <SignatureSection data={data} onChange={onChange} currentRole={currentRole} />
    </div>
  );
}

// ── Main VoltTrackTestForm Component ──────────────────────────────────────────
export default function VoltTrackTestForm({ test, job, currentRole, onSave, onStageChange, isSaving }) {
  const [localData, setLocalData] = useState(() => {
    let d = { ...(test.observationData || {}) };
    // Seed defaults based on test type
    if (test.name === 'CT TEST') d = seedCTNameplateDefaults(d, job?.type, job?.capacity);
    if (test.name === 'PRE-CONNECTION TEST') d = seedPreConnWindingResGuaranteed(d, job?.type, job?.capacity);
    if (test.name === 'POST-CONNECTION TEST') d = seedPostConnWindingResGuaranteed(d, job?.type, job?.capacity);
    if (test.name === 'POST-TANKING TEST') d = seedPostTankingWindingResGuaranteed(d, job?.type, job?.capacity);
    if (test.name === 'FINAL LV TEST REPORT') d = seedFinalLvWindingResGuaranteed(d, job?.type, job?.capacity);
    if (test.name === 'List of HV Test') d = seedHVTestListDefaults(d, job?.type, job?.capacity);
    return d;
  });

  const isDirty = useRef(false);

  const handleChange = useCallback((key, value) => {
    setLocalData((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-calculate IR ratio for post-connection
      if (test.name === 'POST-CONNECTION TEST') {
        if (key === 'pct_ir_15s' || key === 'pct_ir_60s') {
          const v15 = parseFloat(updated['pct_ir_15s'] || '');
          const v60 = parseFloat(updated['pct_ir_60s'] || '');
          if (!isNaN(v15) && !isNaN(v60) && v15 !== 0) {
            updated['pct_ir_ratio'] = (v60 / v15).toFixed(2);
          }
        }
        if (['pct_sc_v1', 'pct_sc_ref1'].includes(key)) {
          updated['pct_sc_z'] = calculatePostConnScImpedanceZ(parseFloat(updated['pct_sc_v1'] || ''), parseFloat(updated['pct_sc_ref1'] || ''), job?.type, job?.capacity);
        }
        if (['pct_sc_v2', 'pct_sc_ref2'].includes(key)) {
          updated['pct_sc_z2'] = calculatePostConnScImpedanceZ(parseFloat(updated['pct_sc_v2'] || ''), parseFloat(updated['pct_sc_ref2'] || ''), job?.type, job?.capacity);
        }
      }
      return updated;
    });
    isDirty.current = true;
  }, [test.name, job]);

  const handleSave = () => {
    onSave(localData);
    isDirty.current = false;
  };

  const handlePrint = () => window.print();

  const canAdvanceStage = () => {
    if (test.stage === 'Not Started' && currentRole !== 'Viewer') return true;
    if (test.stage === 'Tested' && (currentRole === 'Admin_Reviewed' || currentRole === 'Admin_Authorized')) return true;
    if (test.stage === 'Reviewed' && currentRole === 'Admin_Authorized') return true;
    return false;
  };

  const getNextStage = () => {
    if (test.stage === 'Not Started') return 'Tested';
    if (test.stage === 'Tested') return 'Reviewed';
    if (test.stage === 'Reviewed') return 'Authorized';
    return null;
  };

  const stageBadgeClass = {
    'Not Started': 'vt-stage-not-started',
    'Tested': 'vt-stage-tested',
    'Reviewed': 'vt-stage-reviewed',
    'Authorized': 'vt-stage-authorized',
  }[test.stage] || 'vt-stage-not-started';

  const renderForm = () => {
    switch (test.name) {
      case 'CT TEST': return <CTTestForm data={localData} onChange={handleChange} job={job} currentRole={currentRole} />;
      case 'BUSHING TEST': return <BushingTestForm data={localData} onChange={handleChange} currentRole={currentRole} />;
      case '2 KV TEST': return <TwoKVTestForm data={localData} onChange={handleChange} currentRole={currentRole} />;
      case 'PRE-CONNECTION TEST': return <PreConnectionTestForm data={localData} onChange={handleChange} job={job} currentRole={currentRole} />;
      case 'POST-CONNECTION TEST': return <PostConnectionTestForm data={localData} onChange={handleChange} job={job} currentRole={currentRole} />;
      default: return <GenericTestForm testName={test.name} data={localData} onChange={handleChange} currentRole={currentRole} />;
    }
  };

  return (
    <div className="vt-form-area">
      <div className="vt-form-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="vt-form-toolbar-title">{test.name}</span>
          <span className={`vt-test-stage-badge ${stageBadgeClass}`}>{test.stage}</span>
          {isSaving && <span className="vt-saving">⏳ Saving...</span>}
        </div>
        <div className="vt-form-toolbar-actions">
          {canAdvanceStage() && getNextStage() && (
            <button className="vt-btn vt-btn-success vt-btn-sm" onClick={() => onStageChange(getNextStage())}>
              ✓ Mark as {getNextStage()}
            </button>
          )}
          <button className="vt-btn vt-btn-ghost vt-btn-sm" onClick={handlePrint}>🖨 Print</button>
          <button className="vt-btn vt-btn-primary vt-btn-sm" onClick={handleSave} disabled={isSaving}>
            💾 Save
          </button>
        </div>
      </div>
      <div className="vt-form-content">
        {renderForm()}
      </div>
    </div>
  );
}