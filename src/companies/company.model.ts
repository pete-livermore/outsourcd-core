class SectorRelation {
  id: number;
  name: string;
}

class CompanyModelData {
  id: number;
  name: string;
  sector?: SectorRelation | null;
}

export class Company {
  id: number;
  name: string;
  sector?: SectorRelation | null;

  constructor(data: CompanyModelData) {
    this.id = data.id;
    this.name = data.name;
    this.sector = data.sector;
  }
}
