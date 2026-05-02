export type VisualizationType = 'bar' | 'line' | 'pie' | 'velocity' | 'progress' | 'metric-only';

export interface Action {
  label: string;
  onClick?: () => void;
}

export interface MetricData {
  value: string | number;
  trend?: {
    value: number;
    label: string;
    isUp: boolean;
  };
}

export interface DashboardCard {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'insights' | 'engagement';
  title: string;
  subtitle?: string;
  data: any;
  visualization?: VisualizationType;
  actions?: string[];
  footer?: string;
  width?: 'full' | 'half' | 'third';
  codeSnippet?: string;
  developerNotes?: string;
}

export interface AppState {
  currentDashboard: DashboardCard[];
  isGenerating: boolean;
  prompt: string;
}
