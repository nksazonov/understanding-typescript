export abstract class Component<HE extends HTMLElement, E extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: HE;
  element: E;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as HE;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as E;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
