// VoltTrack type constants (ported from types.ts)

export const TRANSFORMER_CAPACITIES = ['8MVA', '12.3MVA', '16.5MVA'];
export const TRANSFORMER_TYPES = ['Auto', 'Traction', 'V Connect'];
export const TEST_STAGES = ['Not Started', 'Tested', 'Reviewed', 'Authorized'];
export const JOB_STATUSES = ['Processing', 'Completed'];
export const USER_ROLES = ['Viewer', 'Admin_Tested', 'Admin_Reviewed', 'Admin_Authorized'];

export const TEST_NAMES = [
  'CT TEST',
  'BUSHING TEST',
  '2 KV TEST',
  'PRE-CONNECTION TEST',
  'POST-CONNECTION TEST',
  'PRE & POST VPD SERVICING',
  'OIL SOAKING SERVICING PLANNING',
  'POST-TANKING TEST',
  'FINAL LV TEST REPORT',
  'Checklist for TFR BEFORE HV',
  'List of HV Test',
];

// Map VishwasPower roles to VoltTrack roles
export const mapRoleToVoltTrack = (vishwasPowerRole) => {
  switch (vishwasPowerRole) {
    case 'admin':
      return 'Admin_Authorized';
    case 'etcadmin':
      return 'Admin_Reviewed';
    case 'site-engineer':
    default:
      return 'Admin_Tested';
  }
};

export const STAGE_ORDER = ['Not Started', 'Tested', 'Reviewed', 'Authorized'];

export const getStageColor = (stage) => {
  switch (stage) {
    case 'Authorized': return '#16a34a';
    case 'Reviewed': return '#2563eb';
    case 'Tested': return '#d97706';
    case 'Not Started': default: return '#6b7280';
  }
};

export const getStageIcon = (stage) => {
  switch (stage) {
    case 'Authorized': return '✅';
    case 'Reviewed': return '🔍';
    case 'Tested': return '🧪';
    case 'Not Started': default: return '⏳';
  }
};