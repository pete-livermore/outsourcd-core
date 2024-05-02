export class JobModelData {
  id: number;
  title: string;
  description: string;
}

export class Job {
  id: number;
  title: string;
  description: string;

  constructor(data: JobModelData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
  }
}
