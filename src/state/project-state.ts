import { Project, ProjectStatus } from "../models/project.js";

type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listenerFunctions: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listenerFunctions.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active,
    );
    this.projects.push(newProject);

    this.notifyListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.notifyListeners();
    }

  }

  private notifyListeners() {
    for (let listenerFn of this.listenerFunctions) {
      // provide a copy of projects array so it can not be modified
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
