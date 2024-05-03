interface CompanyRelation {
  id: number;
  name: string;
}

export interface SalaryRelation {
  currency: string;
  value: { min: number; max: number };
  period: string;
}

export class JobModelData {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  salary?: SalaryRelation;
  location_type: string;
}

export class Job {
  id: number;
  title: string;
  description: string;
  company?: CompanyRelation | null;
  locationType: string;

  constructor(data: JobModelData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.company = data.company;
    this.locationType = data.location_type;
  }
}
