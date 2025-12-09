export enum UnitSystem {
  SI = 'SI',
  IMPERIAL = 'Imperial' // Placeholder for future expansion
}

export interface InputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  defaultValue: number;
  description?: string;
}

export interface FormulaConfig {
  id: string;
  title: string;
  latex: string; // Representation of the formula
  description: string;
  inputs: InputField[];
  calculate: (values: Record<string, number>) => number;
  resultUnit: string;
  color: string;
}

export interface CalculationResult {
  value: number;
  formulaId: string;
}
