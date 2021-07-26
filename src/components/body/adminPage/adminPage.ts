import {
  addNewCategory,
  addNewWord,
  addRout,
  categoriesGeneral,
  changeCategory,
  changeWord,
  deleteCategory,
  deleteWord,
  getWords,
} from '../../api';
import { gameElements, OBJECTS, ProgramSettings, shareElements } from '../../base';
import { BaseComponent } from '../../base-component';
import { createElement } from '../../painter';
import './adminPage.scss';

export class AdminPage extends BaseComponent {
  catInfo: { index: number; categoryName: string; countWords: number }[] | undefined;

  wordsInfo: { word: string; translation: string; image: string; audioSrc: string }[] | undefined;

  createPage(): HTMLElement {
    super.create('div', ['adminPage']);
    (<HTMLElement>shareElements.adminCategories).addEventListener('click', () => {
      if ((<HTMLElement>shareElements.adminWords).classList.contains('hActive'))
        (<HTMLElement>shareElements.adminWords).classList.remove('hActive');
      (<HTMLElement>shareElements.adminWords).classList.remove('active');
      (<HTMLElement>shareElements.adminCategories).classList.add('hActive');
      this.deleteElements();
      this.loadingCategories();
    });
    (<HTMLElement>shareElements.adminWords).addEventListener('click', () => {
      this.createWords(gameElements.selectCategory);
    });
    this.loadingCategories();
    return this.element;
  }

  loadingCategories(): void {
    const categories = categoriesGeneral();
    categories.then((value) => {
      this.catInfo = [];
      this.catInfo = value;
      this.createCatContainers(this.catInfo);
    });
  }

  createCatContainers(categories: { index: number; categoryName: string; countWords: number }[]): void {
    shareElements.cardsCategory = [];
    categories.forEach((element) => {
      this.drawElement(element.index, element.categoryName, element.countWords);
    });
    const addCategoryFormButton = this.createAddCategory('Create new Category');
    addCategoryFormButton[1].addEventListener('click', () => {
      this.addCategory(addCategoryFormButton[0]);
    });
  }

  drawElement(id: number, name: string, count: number): HTMLElement {
    const container = createElement(this.element, 'section', 'categoriesContainer');
    container.addEventListener('click', (event) => {
      this.clickHandler(event);
    });
    const headCont = createElement(container, 'div', 'headCont');
    const titleContainer = createElement(headCont, 'div', 'titleCatContainer');
    const title = createElement(titleContainer, 'label', 'categoriesTitle', '', name);
    const spanCont = createElement(headCont, 'div', 'spanCont');
    createElement(spanCont, 'span', 'head_span');
    createElement(spanCont, 'span', 'head_span');
    const bodyCont = createElement(container, 'div', 'bodyCont');
    const countWords = createElement(bodyCont, 'label', 'countWords', '', `Words: ${count}`);
    const changeTitle = createElement(bodyCont, 'label', 'changeTitle', '', `Category Name:`);
    const catInput = createElement(bodyCont, 'input', 'categoriesInput', '', name);
    const buttonContainer = createElement(container, 'div', 'buttonCatContainer');
    const buttonCancel = createElement(buttonContainer, 'button', 'buttonCancel', '', 'Cancel');
    const buttonCreate = createElement(buttonContainer, 'button', 'buttonCreate', '', 'Create');
    const buttonUpdate = createElement(buttonContainer, 'button', 'buttonUpdate', '', 'Update');
    const buttonAdd = createElement(buttonContainer, 'button', 'buttonAdd', '', 'Add word');
    const standardElement = [title, countWords, buttonUpdate, buttonAdd];
    const changeElement = [changeTitle, catInput, buttonCancel, buttonCreate];
    AdminPage.restructuringCategoryFormChange(changeElement);
    buttonUpdate.addEventListener('click', () =>
      AdminPage.restructuringCategoryFormChange(standardElement, changeElement)
    );
    buttonCancel.addEventListener('click', () =>
      AdminPage.restructuringCategoryFormChange(changeElement, standardElement)
    );
    buttonCreate.addEventListener('click', () => {
      if ((<HTMLInputElement>catInput).value.length !== 0) {
        changeCategory(name, (<HTMLInputElement>catInput).value);
        title.innerHTML = (<HTMLInputElement>catInput).value;
        AdminPage.restructuringCategoryFormChange(changeElement, standardElement);
      } else {
        changeTitle.innerHTML = 'Enter category';
        changeTitle.classList.add('errorName');
      }
    });
    shareElements.cardsCategory.push(container);
    return container;
  }

  static restructuringCategoryFormChange(arrAppear: HTMLElement[], disappear?: HTMLElement[]): void {
    arrAppear.forEach((elem) => elem.classList.add('noExist'));
    if (disappear) disappear.forEach((elem) => elem.classList.remove('noExist'));
  }

  createAddCategory(title: string): HTMLElement[] {
    const container = createElement(this.element, 'section', 'categoriesAddContainer');
    const headCont = createElement(container, 'div', 'newHeadCont');
    const titleContainer = createElement(headCont, 'div', 'titleCat');
    createElement(titleContainer, 'label', 'categoriesTitle', '', title);
    const createCat = createElement(container, 'div', 'createCat');
    createElement(createCat, 'span', 'create_span');
    createElement(createCat, 'span', 'create_span');
    const elementsArr = [container, createCat];
    return elementsArr;
  }

  clickHandler(event: MouseEvent): void {
    if (
      (<HTMLElement>event.target).classList.contains('spanCont') ||
      (<HTMLElement>event.target).classList.contains('head_span')
    ) {
      const selectElement = (<HTMLElement>event.target).closest('section');
      const elementTitle = (<HTMLElement>selectElement).children[0].children[0].children[0].innerHTML;
      deleteCategory(elementTitle);
      if (selectElement !== null) this.element.removeChild(selectElement);
    } else if ((<HTMLElement>event.target).classList.contains('buttonAdd')) {
      const selectElement = (<HTMLElement>event.target).closest('section');
      const elementTitle = (<HTMLElement>selectElement).children[0].children[0].children[0].innerHTML;
      this.addNewWord(elementTitle);
    } else {
      AdminPage.selectElem(event);
    }
  }

  deleteElements(): void {
    while (this.element.children.length !== 0) {
      this.element.removeChild(this.element.children[this.element.children.length - 1]);
    }
  }

  createWords(selectCategory: string | null | undefined): void {
    if ((<HTMLElement>shareElements.adminCategories).classList.contains('hActive'))
      (<HTMLElement>shareElements.adminCategories).classList.remove('hActive');
    (<HTMLElement>shareElements.adminWords).classList.add('hActive');
    this.deleteElements();
    if (typeof selectCategory === 'string') {
      const words = getWords(selectCategory);
      this.wordsInfo = [];
      words.then((value) => {
        this.wordsInfo = value;
        if (this.wordsInfo.length !== 0) {
          this.wordsInfo.forEach((element) => {
            this.drawWords(element.word, element.translation, element.audioSrc, selectCategory, element.image);
          });
          const createWordObj = this.createAddCategory('Create new Word');
          createWordObj[1].addEventListener('click', () => this.addNewWord(selectCategory));
        } else {
          const createWordObj = this.createAddCategory('Create new Word');
          createWordObj[1].addEventListener('click', () => this.addNewWord(selectCategory));
        }
      });
    }
  }

  wordHandler(event: MouseEvent, category: string, wordName: string): void {
    if (
      (<HTMLElement>event.target).classList.contains('spanCont') ||
      (<HTMLElement>event.target).classList.contains('head_span')
    ) {
      const selectElement = (<HTMLElement>event.target).closest('section');
      if (selectElement !== null) this.element.removeChild(selectElement);
      deleteWord(wordName, category);
    } else if ((<HTMLElement>event.target).classList.contains('buttonArt')) {
      this.changeWord(wordName, category);
    }
  }

  changeWord(wordName: string, category: string): void {
    this.deleteElements();
    const findObjects = (<string[]>OBJECTS.categories[0]).indexOf(category);
    const selectCat = OBJECTS.categories[findObjects + 1] as {
      word: string;
      translation: string;
      image: string;
      audioSrc: string;
    }[];
    const selWord = selectCat.find((item) => item.word === wordName);
    if (selWord !== undefined) {
      const formElements = this.drawWord(selWord.word, selWord.translation, selWord.audioSrc, selWord.image);
      formElements[1].innerHTML = 'Change';
      (<HTMLFormElement>formElements[0]).onsubmit = (e) => {
        e.preventDefault();
        localStorage.clear();
        changeWord(<HTMLFormElement>formElements[0], category, wordName);
        this.deleteElements();
        this.loadingCategories();
      };
    }
  }

  drawWords(name: string, translation: string, sound: string, category: string, img: string): void {
    const container = createElement(this.element, 'section', 'wordsContainer');
    container.addEventListener('click', (event) => this.wordHandler(event, category, name));
    const firstStrCont = createElement(container, 'div', 'firstStrCont');
    const wordContainer = createElement(firstStrCont, 'div', 'wordContainer');
    createElement(wordContainer, 'span', 'wordTitle', '', 'Word:');
    createElement(wordContainer, 'span', 'wordName', '', name);
    const spanCont = createElement(firstStrCont, 'div', 'spanCont');
    createElement(spanCont, 'span', 'head_span');
    createElement(spanCont, 'span', 'head_span');
    const translationCont = createElement(container, 'div', 'translationCont');
    createElement(translationCont, 'span', 'translationTitle', '', 'Translation:');
    createElement(translationCont, 'span', 'translationName', '', translation);
    const soundCont = createElement(container, 'div', 'soundCont');
    createElement(soundCont, 'span', 'soundTitle', '', 'Sound file:');
    const findSound = sound.split('/');
    const selectSound = findSound[findSound.length - 1];
    createElement(soundCont, 'span', 'soundName', '', selectSound);
    const soundPlay = createElement(soundCont, 'div', 'soundPlay');
    soundPlay.addEventListener('click', () => AdminPage.play(sound));
    const imageCont = createElement(container, 'div', 'imageCont');
    createElement(imageCont, 'span', 'imageTitle', '', 'Image:');
    const imgAdm = createElement(imageCont, 'div', 'imgAdm');
    imgAdm.style.backgroundImage = `url(${img})`;
    const buttonCont = createElement(imageCont, 'div', 'buttonCont');
    createElement(buttonCont, 'button', 'buttonArt', '', 'Change');
  }

  static selectElem(event: MouseEvent): void {
    shareElements.cardsCategory.forEach((element) => {
      if (element.classList.contains('selectCat')) element.classList.remove('selectCat');
    });
    (<HTMLElement>event.target).closest('section')?.classList.add('selectCat');
    (<HTMLElement>shareElements.adminWords).classList.add('active');
    gameElements.selectCategory = (<HTMLElement>event.target).closest('section')?.children[0].children[0].textContent;
  }

  addCategory(container: HTMLElement): void {
    if (!ProgramSettings.isAddCategory) {
      ProgramSettings.isAddCategory = true;
      const form = this.createNewCategoryFrom(container);
      this.element.insertBefore(form, container);
    }
  }

  createNewCategoryFrom(addForm: HTMLElement): HTMLElement {
    const container = createElement(this.element, 'section', 'catAddCont');
    const createForm = createElement(container, 'form', 'createForm');
    (<HTMLFormElement>createForm).method = 'POST';
    (<HTMLFormElement>createForm).enctype = 'multipart/form-data';
    const bodyCont = createElement(createForm, 'div', 'addBodyCont');
    const categoryTitle = createElement(bodyCont, 'label', 'changeTitle', '', 'Category Name:');
    const inputName = createElement(bodyCont, 'input', 'inputName');
    (<HTMLInputElement>inputName).name = 'myCatName';
    createElement(bodyCont, 'label', 'changeTitle', '', 'Image:');
    const inputSrc = createElement(bodyCont, 'input', 'inputSrc', 'file');
    (<HTMLInputElement>inputSrc).name = 'myImage';
    (<HTMLInputElement>inputSrc).accept = 'image/jpeg,image/jpg,image/svg';
    const buttonContainer = createElement(createForm, 'div', 'buttonCatContainer');
    const buttonCancel = createElement(buttonContainer, 'button', 'buttonCancel', '', 'Cancel');
    const buttonCreate = createElement(buttonContainer, 'button', 'buttonCreate', '', 'Create');
    (<HTMLButtonElement>buttonCreate).type = 'submit';

    (<HTMLFormElement>createForm).onsubmit = (e) => {
      e.preventDefault();
      categoryTitle.classList.remove('errorName');
      categoryTitle.innerHTML = 'Category Name:';
      if ((<HTMLInputElement>inputName).value.length !== 0) {
        addRout((<HTMLInputElement>inputName).value);
        this.createNewCategory(addForm, container, <HTMLFormElement>createForm);
      } else {
        categoryTitle.classList.add('errorName');
        categoryTitle.innerHTML = 'Enter category name';
      }
    };

    buttonCancel.addEventListener('click', () => {
      this.element.removeChild(container);
      ProgramSettings.isAddCategory = false;
    });
    return container;
  }

  createNewCategory(addForm: HTMLElement, newCategoryForm: HTMLElement, form: HTMLFormElement): void {
    ProgramSettings.isAddCategory = false;
    this.element.removeChild(newCategoryForm);
    const newCategory = addNewCategory(form);
    newCategory.then((value) => {
      const id = (<{ index: number; name: string; count: number }>value).index;
      const categoryName = (<{ index: number; name: string; count: number }>value).name;
      const countWords = (<{ index: number; name: string; count: number }>value).count;
      const createdForm = this.drawElement(id, categoryName, countWords);
      this.element.insertBefore(createdForm, addForm);
    });
  }

  addNewWord(categoryTitle: string): void {
    this.deleteElements();
    const formElements = this.drawWord();
    (<HTMLFormElement>formElements[0]).onsubmit = (e) => {
      formElements[2].classList.remove('errorName');
      formElements[2].innerHTML = 'Word:';
      formElements[4].classList.remove('errorName');
      formElements[4].innerHTML = 'Translation:';
      formElements[6].classList.remove('errorFile');
      formElements[6].innerHTML = 'Sound:';
      formElements[8].classList.remove('errorFile');
      formElements[6].innerHTML = 'Image:';
      e.preventDefault();
      const nameInput = formElements[3] as HTMLInputElement;
      const translationInput = formElements[5] as HTMLInputElement;
      const soundChoice = formElements[7] as HTMLInputElement;
      const imageChoice = formElements[9] as HTMLInputElement;
      if (nameInput.value.length !== 0) {
        if (translationInput.value.length !== 0) {
          if (soundChoice.value.length !== 0) {
            if (imageChoice.value.length !== 0) {
              localStorage.clear();
              addNewWord(<HTMLFormElement>formElements[0], categoryTitle);
              this.deleteElements();
              this.loadingCategories();
            } else {
              formElements[8].innerHTML = 'Image is empty';
              formElements[8].classList.add('errorFile');
            }
          } else {
            formElements[6].innerHTML = 'Sound is empty';
            formElements[6].classList.add('errorFile');
          }
        } else {
          formElements[4].innerHTML = 'Enter translation';
          formElements[4].classList.add('errorName');
        }
      } else {
        formElements[2].innerHTML = 'Enter word name';
        formElements[2].classList.add('errorName');
      }
    };
  }

  drawWord(name?: string, translation?: string, sound?: string, image?: string): HTMLElement[] {
    const container = createElement(this.element, 'section', 'newWord');
    const newWordFrom = createElement(container, 'form', 'newWordFrom');
    (<HTMLFormElement>newWordFrom).method = 'POST';
    (<HTMLFormElement>newWordFrom).enctype = 'multipart/form-data';
    const dataContainer = createElement(newWordFrom, 'div', 'dataContainer');
    const nameContainer = createElement(dataContainer, 'div', 'nameCont');
    const nameTitle = createElement(nameContainer, 'label', 'nameTitle', '', 'Word:');
    const nameInput = createElement(nameContainer, 'input', 'nameInput', '', name);
    (<HTMLInputElement>nameInput).name = 'wordName';
    const translationCont = createElement(dataContainer, 'div', 'translationCont');
    const translationTitle = createElement(translationCont, 'label', 'translationWord', '', 'Translation:');
    const translationInput = createElement(translationCont, 'input', 'translationInput', '', translation);
    (<HTMLInputElement>translationInput).name = 'translationName';
    const soundContainer = createElement(dataContainer, 'div', 'soundContainer');
    const soundTitle = createElement(soundContainer, 'label', 'sTitle', '', 'Sound:');
    const soundChoice = createElement(soundContainer, 'input', 'soundChoice', 'file', sound);
    (<HTMLInputElement>soundChoice).accept = 'audio/mpeg';
    (<HTMLInputElement>soundChoice).name = 'soundFile';
    const imageContainer = createElement(dataContainer, 'div', 'imageContainer');
    const imageTitle = createElement(imageContainer, 'label', 'iTitle', '', 'Image:');
    const imageChoice = createElement(imageContainer, 'input', 'imageChoice', 'file', image);
    (<HTMLInputElement>imageChoice).accept = 'image/jpeg, image/jpg';
    (<HTMLInputElement>imageChoice).name = 'imageFile';
    const buttonContainer = createElement(newWordFrom, 'div', 'buttonCont');
    const buttonCancel = createElement(buttonContainer, 'button', 'buttonNewCancel', '', 'Cancel');
    buttonCancel.addEventListener('click', () => {
      this.deleteElements();
      this.loadingCategories();
    });
    const buttonAdd = createElement(buttonContainer, 'button', 'buttonNewAdd', '', 'Add');
    (<HTMLButtonElement>buttonAdd).type = 'submit';
    const elementsArr = [
      newWordFrom,
      buttonAdd,
      nameTitle,
      nameInput,
      translationTitle,
      translationInput,
      soundTitle,
      soundChoice,
      imageTitle,
      imageChoice,
    ];
    return elementsArr;
  }

  static play(src: string): void {
    const audio = new Audio(src);
    audio.play();
  }
}
