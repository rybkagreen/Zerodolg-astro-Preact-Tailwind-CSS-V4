export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'number';
  label: string;
  placeholder: string;
  required: boolean;
  validation?: {
    message: string;
  };
}

export interface FormConfig {
  formId: string;
  formType: 'hero' | 'cta' | 'consultation' | 'callback' | 'lead' | 'footer' | 'section';
  fields: FormField[];
  submitText: string;
  endpoint?: string;
  variant?: 'inline' | 'stacked' | 'compact';
}
