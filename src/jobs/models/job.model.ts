import {
  CompanyRecord,
  FileRecord,
  JobRecord,
  JobApplicationRecord,
} from 'src/infrastructure/database/database';

interface CompanyRelation {
  id: CompanyRecord['id'];
  name: CompanyRecord['name'];
  image?: {
    id: FileRecord['id'];
    url: FileRecord['url'];
  };
}

export interface JobApplicationRelation {
  user_id: JobApplicationRecord['user_id'];
}

export interface JobSalary {
  currency: string;
  value: { min: number; max: number };
  period: string;
}

export class JobModelData {
  id: JobRecord['id'];
  title: JobRecord['title'];
  description: JobRecord['description'];
  company?: CompanyRelation | null;
  salary: JobSalary;
  location_type: JobRecord['location_type'];
  start_date: JobRecord['start_date'];
  applications?: JobApplicationRelation[];
  employment_type: JobRecord['employment_type'];
  city: JobRecord['city'];
  country: JobRecord['country'];
}

export class Job {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  locationType: string;
  salary: JobSalary;
  startDate: string;
  applications: { userId: number }[];
  employmentType: string;
  city: string;
  country: string;

  constructor(data: JobModelData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.company = data.company;
    this.locationType = data.location_type;
    this.salary = data.salary;
    this.city = data.city;
    this.country = data.country;
    this.employmentType = data.employment_type;
    this.startDate = data.start_date.toISOString();
    this.applications = data.applications?.map((app) => ({
      userId: app.user_id,
    }));
  }
}
