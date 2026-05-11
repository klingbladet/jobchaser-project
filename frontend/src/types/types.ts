export interface Job {
  logo_url?: string;
  id: string;
  headline: string;
  employer: {
    name: string;
  };
  workplace_address: {
    municipality: string;
  }
  description: {
    text: string;
  },
  publication_date: string;
  working_hours_type: {
    label: string;
  },
  duration: {
    label: string;
  },
  occupation_field: {
    label: string;
  }
  webpage_url: string;
}