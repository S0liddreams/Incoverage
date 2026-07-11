export interface Medication {
  id: string;
  name: string;
  coverage: 'covered' | 'partial' | 'not-covered';
  copay: string;
  refills: number;
  alternatives: string[];
  note?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  accreditation: 'accredited' | 'pending' | 'not-accredited';
}

export interface Coordinator {
  state: string;
  name: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  month: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}