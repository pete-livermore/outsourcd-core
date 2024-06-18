interface CompanyRelation {
  id: number;
  name: string;
}

export interface JobApplicant {
  id: number;
}

export interface JobSalary {
  currency: string;
  value: { min: number; max: number };
  period: string;
}

export class JobModelData {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  salary: JobSalary;
  location_type: string;
  start_date: Date;
  applicants?: JobApplicant[];
}

export class Job {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  locationType: string;
  salary: JobSalary;
  startDate: string;
  applicants: JobApplicant[];

  constructor(data: JobModelData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.company = data.company;
    this.locationType = data.location_type;
    this.salary = data.salary;
    this.startDate = data.start_date.toISOString();
    this.applicants = data.applicants;
  }
}
