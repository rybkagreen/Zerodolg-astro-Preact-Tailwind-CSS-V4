export interface TeamMemberStats {
  experience: string;
  cases: string;
  success: string;
}

export interface TeamMemberContacts {
  phone: string;
  email: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  role: string;
  quote: string;
  description: string;
  stats: TeamMemberStats;
  specializations: string[];
  achievements: string[];
  contacts: TeamMemberContacts;
}
