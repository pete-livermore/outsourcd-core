export class JobApplicationModelData {
  user_id: number;
  job_id: number;
  min_salary_expectation: number;
  cover_letter: string;
}

export class JobApplication {
  userId: number;
  jobId: number;
  minSalaryExpectation: number;
  coverLetter: string;

  constructor(data: JobApplicationModelData) {
    this.userId = data.user_id;
    this.jobId = data.job_id;
    this.minSalaryExpectation = data.min_salary_expectation;
    this.coverLetter = data.cover_letter;
  }
}
