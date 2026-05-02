export const SUBJECTS = [
  { id: 1, name: 'Mathematics', mean: 0, median: 0, stdDev: 0 },
  { id: 2, name: 'English',     mean: 0, median: 0, stdDev: 0 },
  { id: 3, name: 'Science',     mean: 0, median: 0, stdDev: 0 },
  { id: 4, name: 'History',     mean: 0, median: 0, stdDev: 0 },
  { id: 5, name: 'Physical Education', mean: 0, median: 0, stdDev: 0 },
  { id: 6, name: 'Art',         mean: 0, median: 0, stdDev: 0 },
];

export const AT_RISK_STUDENTS = [];

export const SCORE_DISTRIBUTION = [
  { range: '0–20',   count: 0, color: '#f09595' },
  { range: '21–40',  count: 0, color: '#888780' },
  { range: '41–60',  count: 0, color: '#1a1a2e' },
  { range: '61–80',  count: 0, color: '#1a1a2e' },
  { range: '81–100', count: 0, color: '#e07b3a' },
];

export const CLUSTER_DATA = [];

export const KPI_CARDS = [
  {
    id: 'gpa',
    label: 'Average GPA',
    value: '0.00',
    unit: '/ 4.0',
    change: '0%',
    changeUp: true,
    iconBg: '#e8eeff',
    iconColor: '#3b5bdb',
  },
  {
    id: 'atrisk',
    label: 'At-Risk Students',
    value: '0',
    unit: 'students',
    change: '0%',
    changeUp: false,
    iconBg: '#fce8e8',
    iconColor: '#a32d2d',
  },
  {
    id: 'topsubject',
    label: 'Top Performing Subject',
    value: 'N/A',
    unit: '0%',
    change: '0%',
    changeUp: true,
    iconBg: '#faeeda',
    iconColor: '#633806',
  },
  {
    id: 'passrate',
    label: 'Pass Rate',
    value: '0.0',
    unit: '%',
    change: '0%',
    changeUp: true,
    iconBg: '#eaf3de',
    iconColor: '#27500a',
  },
];

export const NAV_ITEMS = [
  { id: 'Dashboard',         icon: 'grid' },
  { id: 'Student Directory', icon: 'person' },
  { id: 'Subject Analysis',  icon: 'book' },
  { id: 'Risk Reports',      icon: 'alert-circle' },
  { id: 'Trend Logs',        icon: 'trending-up' },
  { id: 'Settings',          icon: 'settings' },
];

export const RISK_COLORS = {
  High:   { bg: '#fce8e8', text: '#a32d2d', border: '#f09595' },
  Medium: { bg: '#faeeda', text: '#633806', border: '#ef9f27' },
  Low:    { bg: '#eaf3de', text: '#27500a', border: '#97c459' },
};

export const CLUSTER_COLORS = {
  Excellent: '#1a1a2e',
  Good:      '#e07b3a',
  Fair:      '#888780',
  AtRisk:    '#e24b4a',
};
