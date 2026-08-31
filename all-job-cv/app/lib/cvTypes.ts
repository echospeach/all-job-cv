export type Experience = {
  role: string;
  company: string;
  dates: string;
  description: string;
};

export type Education = {
  qualification: string;
  institution: string;
  date: string;
};

export type Certificate = {
  name: string;
  issuer: string;
};

export type CvContent = {
  name?: string;
  title?: string;
  email?: string;
  summary?: string;
  skills?: string;
  experience?: Experience[];
  photoUrl?: string;
  hobbies?: string;
  education?: Education[];
  tagline?: string;
  languages?: string;
  phone?: string;
  location?: string;
  postcode?: string;
  linkedin?: string;
  certificates?: Certificate[];
};
