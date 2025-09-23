// Global types
export interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  experience: string;
  description: string;
  avatar?: string;
}

export interface CalculatorData {
  minValue: number;
  maxValue: number;
  defaultValues: {
    debtAmount: number;
    creditorsCount: number;
    property: string;
  };
  propertyOptions: Array<{ value: string; label: string }>;
}
