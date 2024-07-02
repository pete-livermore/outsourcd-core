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

export class JobModelData {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  salary: JobSalary;
  location_type: string;
  start_date: Date;
  applications?: JobApplicationRelation[];
  employment_type: string;
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

  constructor(data: JobModelData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.company = data.company;
    this.locationType = data.location_type;
    this.salary = data.salary;
    this.employmentType = data.employment_type;
    this.startDate = data.start_date.toISOString();
    this.applications = data.applications?.map((app) => ({
      userId: app.user_id,
    }));
  }
}
