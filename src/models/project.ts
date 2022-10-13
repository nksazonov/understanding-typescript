export enum ProjectStatus {
  Active = 'Active',
  Finished = 'Finished',
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
