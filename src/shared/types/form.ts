export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'number';
  label: string;
  placeholder: string;
  required: boolean;
  validation?: {
    message: string;
    min?: number;
    max?: number;
    pattern?: string;
  };
  autocomplete?: string;
}

export interface FormConfig {
  formId: string;
  formType: 'hero' | 'cta' | 'consultation' | 'callback' | 'lead' | 'footer' | 'section';
  fields: FormField[];
  submitText: string;
  endpoint?: string;
  variant?: 'inline' | 'stacked' | 'compact';
}

export interface FormErrors {
  [key: string]: string;
}
