// validation logic
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  const value = validatableInput.value;
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  if (validatableInput.minLength != null && typeof value === 'string') {
    isValid = isValid && value.length >= validatableInput.minLength;
  }
  
  if (validatableInput.maxLength != null && typeof value === 'string') {
    isValid = isValid && value.length <= validatableInput.maxLength;
  }

  if (validatableInput.min != null && typeof value === 'number') {
    isValid = isValid && value >= validatableInput.min;
  }

  if (validatableInput.max != null && typeof value === 'number') {
    isValid = isValid && value <= validatableInput.max;
  }

  return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return method.bind(this);
    }
  }
  return adjDescriptor;
}

// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 3,
      maxLength: 20,
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: false,
      maxLength: 150,
    }

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 10,
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable) 
    ) {
      alert('Invalid input, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    
    if (Array.isArray(userInput)) {
      this.clearInputs();
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
