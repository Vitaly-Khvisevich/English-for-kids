import { Footer } from './components/footer/footer';
import './style.scss';
import { authorization, gameElements, OBJECTS, ProgramSettings, shareElements } from './components/base';
import { Header } from './components/Header/Header';
import { Body } from './components/body/body';
import { categoriesGeneral, getAll, getRouts } from './components/api';
import { createElement } from './components/painter';

let appElement: HTMLElement;
let header: Header;
let body: Body;
let footer: Footer;

function createLocalStorage(): void {
  if (localStorage.length === 0) {
    for (let i = 0; i < OBJECTS.categories[0].length; i++) {
      OBJECTS.categories[i + 1].forEach((element: unknown) => {
        const zeroSettings = {
          word: '',
          translation: '',
          category: '',
          clicks: 0,
          correct: 0,
          wrong: 0,
          perCent: 0.0,
        };
        zeroSettings.word = (<{ word: string; translation: string; image: string; audioSrc: string }>element).word;
        zeroSettings.translation = (<{ word: string; translation: string; image: string; audioSrc: string }>(
          element
        )).translation;
        zeroSettings.category = <string>OBJECTS.categories[0][i];
        localStorage.setItem(zeroSettings.word, JSON.stringify(zeroSettings));
      });
    }
  }
}
async function loadingData(): Promise<void> {
  const categories = getAll();
  categories.then((value) => {
    OBJECTS.categories = value;
    createLocalStorage();
  });
}

export function createHeader(): void {
  header = new Header();
  const headerElement = header.create();
  appElement.appendChild(headerElement);
}
function createFooter(): void {
  footer = new Footer();
  const footerElement = footer.create();
  appElement.appendChild(footerElement);
}
function createBody(key = '#'): void {
  body = new Body();
  const bodyElement = key === '#' ? body.createCatagories() : body.createSelectCategory(key);
  appElement.appendChild(bodyElement);
}
function createWinner() {
  body = new Body();
  const bodyElement = body.creteWinner();
  appElement.appendChild(bodyElement);
}
function createRepeatPage() {
  body = new Body();
  const bodyElement = body.createRepeatPage();
  appElement.appendChild(bodyElement);
}
function deleteElements(): void {
  while (appElement.children.length !== 0) {
    appElement.removeChild(appElement.children[appElement.children.length - 1]);
  }
}
function createStatistic() {
  body = new Body();
  const bodyElement = body.creteStatistic();
  appElement.appendChild(bodyElement);
}
function createForm(): void {
  createHeader();
  createBody();
  createFooter();
}
function createAdminPage() {
  body = new Body();
  const bodyElement = body.createAdminPage();
  appElement.appendChild(bodyElement);
}

async function loadingCategories(myFunction: () => void): Promise<void> {
  const categories = categoriesGeneral();
  categories.then((value) => {
    OBJECTS.categoryHistory = value;
    myFunction();
  });
}

function goMain() {
  deleteElements();
  createForm();
}

function createAuthorizationForm() {
  const authorizationForm = createElement(appElement, 'section', 'authorizationForm');
  const authorizationTitleCont = createElement(authorizationForm, 'div', 'authorizationTitleCont');
  const authorizationTitle = createElement(authorizationTitleCont, 'h5', 'authorizationTitle');
  authorizationTitle.innerHTML = 'LOGIN';
  const authorizationInfo = createElement(authorizationForm, 'section', 'authorizationInfo');
  const loginTitle = createElement(authorizationInfo, 'label', 'loginTitle', '', 'Login');
  const loginInput = createElement(authorizationInfo, 'input', 'loginInput');
  const passwordTitle = createElement(authorizationInfo, 'label', 'loginTitle', '', 'Password');
  const passwordInput = createElement(authorizationInfo, 'input', 'passwordInput', 'password');
  const authorizationButtonContainer = createElement(authorizationForm, 'section', 'authorizationBCont');
  const cancelButton = createElement(authorizationButtonContainer, 'button', 'cancelButton');
  cancelButton.innerHTML = 'Cancel';
  cancelButton.addEventListener('click', () => {
    deleteElements();
    createForm();
  });
  const loginButton = createElement(authorizationButtonContainer, 'button', 'loginButton');
  loginButton.innerHTML = 'Login';
  loginButton.addEventListener('click', () => {
    passwordTitle.classList.remove('err');
    passwordTitle.innerHTML = 'Password';
    loginTitle.classList.remove('err');
    loginTitle.innerHTML = 'Login';
    if ((<HTMLInputElement>loginInput).value === authorization.adminLogin) {
      if ((<HTMLInputElement>passwordInput).value === authorization.adminPassword) {
        deleteElements();
        createAdminPage();
      } else {
        passwordTitle.classList.add('err');
        passwordTitle.innerHTML = 'invalid password';
        setTimeout(goMain, 2000);
      }
    } else {
      loginTitle.classList.add('err');
      loginTitle.innerHTML = 'invalid username';
      setTimeout(goMain, 2000);
    }
  });
  createElement(appElement, 'div', 'authorizationCover');
}

async function loadingRouts(): Promise<void> {
  const routs = getRouts();
  routs.then((value) => {
    ProgramSettings.myRouts = value;
  });
}

window.onload = () => {
  localStorage.clear();
  document.addEventListener('click', (event) => {
    if ((<HTMLInputElement>shareElements.checkbox).checked) {
      if (
        !(<HTMLElement>event.target).classList.contains('PopUpMenu') &&
        !(<HTMLElement>event.target).classList.contains('checkbox')
      ) {
        (<HTMLInputElement>shareElements.checkbox).checked = false;
      }
    }
  });
  appElement = document.body;
  if (!appElement) throw Error('App root element not found');
  loadingRouts();
  loadingData();
  loadingCategories(createForm);
};

function findElement(currentRouteName: string, routing: { name: string; component: () => void }[]): void {
  const currentRoute = routing.find((p) => p.name === currentRouteName);
  if (currentRoute !== undefined) {
    Header.resetGameData();
    currentRoute.component();
    gameElements.errors = 0;
  }
}

function createElements(key: string): void {
  deleteElements();
  createHeader();
  if (key === 'main') {
    loadingCategories(createBody);
  } else if (key === 'winner') {
    createWinner();
  } else if (key === 'statistic') {
    createStatistic();
  } else if (key === 'repeat') {
    ProgramSettings.currentPage = 'Difficult words';
    createRepeatPage();
  } else if (key === 'clean') {
    createLocalStorage();
    createStatistic();
  } else if (key === 'AdminStage') {
    createAuthorizationForm();
  } else if (key === 'reload') {
    loadingRouts();
    loadingData();
    deleteElements();
    loadingCategories(createForm);
  } else {
    ProgramSettings.currentPage = key;
    createBody(key);
  }
  createFooter();
}

function router(hash: string): void {
  const currentRouteName = hash.slice(1);
  let routs = [] as string[];
  routs = ProgramSettings.myRouts;
  const routing = routs.map((x) => ({
    name: x,
    component: () => createElements(x),
  }));
  findElement(currentRouteName, routing);
}

window.onpopstate = () => {
  router(window.location.hash);
};
