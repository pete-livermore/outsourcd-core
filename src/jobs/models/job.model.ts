import { Selectable } from 'kysely';
import { Tables } from 'src/database/database';

interface CompanyRelation {
  id: number;
  name: string;
}

export interface JobApplicationRelation {
  user_id: number;
}

export interface JobSalary {
  currency: string;
  value: { min: number; max: number };
  period: string;
}

type DatabaseTable = Selectable<Tables['jobs']>;

export class JobModelData {
  id: DatabaseTable['id'];
  title: DatabaseTable['title'];
  description: DatabaseTable['description'];
  company?: CompanyRelation | null;
  salary: JobSalary;
  location_type: DatabaseTable['location_type'];
  start_date: DatabaseTable['start_date'];
  applications?: JobApplicationRelation[];
  employment_type: DatabaseTable['employment_type'];
  city: DatabaseTable['city'];
  country: DatabaseTable['country'];
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
