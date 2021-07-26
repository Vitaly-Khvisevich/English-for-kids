import { OBJECTS, shareElements, gameElements } from '../base';
import { BaseComponent } from '../base-component';
import { createElement } from '../painter';
import './header.scss';

export class Header extends BaseComponent {
  create(): HTMLElement {
    super.create('header', ['header']);
    const headerContainer = createElement(this.element, 'div', 'wrapper');
    const navigation = createElement(headerContainer, 'nav', 'navigation');
    const menu = createElement(navigation, 'div', 'menu');
    const checkbox = createElement(menu, 'input', 'checkbox', 'checkbox');
    shareElements.checkbox = checkbox;
    createElement(menu, 'span', 'menu_span');
    createElement(menu, 'span', 'menu_span');
    createElement(menu, 'span', 'menu_span');
    const PopUpMenu = createElement(menu, 'ul', 'PopUpMenu');
    shareElements.popUpMenu = PopUpMenu;
    const PopUpMenuCategory = createElement(PopUpMenu, 'ul', 'PopUpMenuCategory');
    Header.createPopUpMenuItem(PopUpMenuCategory, 'Categories', '#main', 'categories.svg');
    OBJECTS.categoryHistory.forEach((element) => {
      const newStr = element.categoryName[0].toUpperCase() + element.categoryName.slice(1);
      Header.createPopUpMenuItem(PopUpMenuCategory, newStr, element.hash, element.src);
    });
    Header.createPopUpMenuItem(PopUpMenuCategory, 'Statistic', '#statistic', 'statistic.svg');
    const PopUpMenuAdminStage = createElement(PopUpMenu, 'ul', 'PopUpMenuAdminStage');
    Header.createPopUpMenuItem(PopUpMenuAdminStage, 'Login', '#AdminStage', 'admin.svg');
    const switchContainer = createElement(headerContainer, 'div', 'switch-container');
    const menuSwitch = createElement(switchContainer, 'label', 'switch');
    const menuSwitchInput = createElement(menuSwitch, 'input', 'menuSwitchInput', 'checkbox');
    (<HTMLInputElement>menuSwitchInput).checked = true;
    shareElements.menuSwitchInput = menuSwitchInput;
    menuSwitchInput.addEventListener('change', () => Header.menuSwitchInputChange(menuSwitchInput));
    const menuSwitchSpan = createElement(menuSwitch, 'span', 'menuSwitchSpan');
    menuSwitchSpan.dataset.on = 'Train';
    menuSwitchSpan.dataset.off = 'Play';
    createElement(menuSwitch, 'span', 'SpanHandle');
    const addClass = (<HTMLInputElement>shareElements.menuSwitchInput).checked ? 'menuTrain' : 'menuPlay';
    PopUpMenu.classList.add(addClass);
    return this.element;
  }

  static createPopUpMenuItem(mainElement: HTMLElement, itemName: string, hash: string, src: string): void {
    const PopUpMenuItem = createElement(mainElement, 'a', 'PopUpMenuContainer', '', '', hash);
    createElement(PopUpMenuItem, 'img', 'PopUpMenu-img', '', '', '', '', src);
    const span = createElement(PopUpMenuItem, 'span', 'PopUpMenu-item');
    span.innerHTML = itemName;
  }

  static menuSwitchInputChange(menuSwitchInput: HTMLElement): void {
    if ((<HTMLInputElement>menuSwitchInput).checked) {
      Header.trainMode();
    } else Header.playMode();
  }

  static trainMode(): void {
    OBJECTS.cardCategories.forEach((element) => {
      element.classList.remove('play');
      element.classList.add('train');
    });
    if (OBJECTS.cards) Header.removeInvisible(OBJECTS.cards);
    if (shareElements.errorCards.length !== 0) Header.removeInvisible(shareElements.errorCards);
    (<HTMLElement>shareElements.popUpMenu).classList.remove('menuPlay');
    (<HTMLElement>shareElements.popUpMenu).classList.add('menuTrain');
    (<HTMLElement>shareElements.footer).classList.remove('menuPlay');
    (<HTMLElement>shareElements.footer).classList.add('menuTrain');
    if (shareElements.thTable.length !== 0) {
      shareElements.thTable.forEach((element) => {
        element.classList.remove('tableGame');
        element.classList.add('tableTrain');
      });
    }
    if (shareElements.button) shareElements.button.classList.add('invisible');
    if (shareElements.result) shareElements.result.classList.add('invisible');
    if (shareElements.button) shareElements.button.classList.remove('repeater');
    if (shareElements.staticButtonReset) shareElements.staticButtonReset.classList.remove('tableGame');
    if (shareElements.staticButtonReset) shareElements.staticButtonReset.classList.add('tableTrain');
    if (shareElements.staticButtonRepeat) shareElements.staticButtonRepeat.classList.remove('tableGame');
    if (shareElements.staticButtonRepeat) shareElements.staticButtonRepeat.classList.add('tableTrain');
    gameElements.errors = 0;
    Header.resetGameData();
    Header.clearResult();
  }

  static playMode(): void {
    OBJECTS.cardCategories.forEach((element) => {
      element.classList.remove('train');
      element.classList.add('play');
    });
    (<HTMLElement>shareElements.popUpMenu).classList.remove('menuTrain');
    (<HTMLElement>shareElements.popUpMenu).classList.add('menuPlay');
    (<HTMLElement>shareElements.footer).classList.remove('menuTrain');
    (<HTMLElement>shareElements.footer).classList.add('menuPlay');
    if (shareElements.staticButtonReset) shareElements.staticButtonReset.classList.remove('tableTrain');
    if (shareElements.staticButtonReset) shareElements.staticButtonReset.classList.add('tableGame');
    if (shareElements.staticButtonRepeat) shareElements.staticButtonRepeat.classList.remove('tableTrain');
    if (shareElements.staticButtonRepeat) shareElements.staticButtonRepeat.classList.add('tableGame');
    if (shareElements.thTable.length !== 0) {
      shareElements.thTable.forEach((element) => {
        element.classList.remove('tableTrain');
        element.classList.add('tableGame');
      });
    }
    if (shareElements.button) shareElements.button.classList.remove('invisible');
    if (shareElements.result) shareElements.result.classList.remove('invisible');
    gameElements.errors = 0;
    Header.resetGameData();
    Header.clearResult();
    if (shareElements.errorCards.length !== 0) Header.addInvisible(shareElements.errorCards);
    if (OBJECTS.cards) Header.addInvisible(OBJECTS.cards);
  }

  static resetGameData(): void {
    gameElements.elementIndex = -1;
    gameElements.randomCard = {} as string | { word: string; translation: string; image: string; audioSrc: string };
    gameElements.selectGroupCards = [] as
      | string[]
      | { word: string; translation: string; image: string; audioSrc: string }[];
  }

  static clearResult(): void {
    while ((<HTMLElement>shareElements.result).firstChild) {
      (<HTMLElement>shareElements.result).removeChild(<ChildNode>(<HTMLElement>shareElements.result).firstChild);
    }
  }

  static addInvisible(selectCard: Array<HTMLElement>): void {
    selectCard.forEach((element) => {
      const turnOver = element.children[0].children[2];
      const cardEnTitle = element.children[0].children[0].children[0];
      turnOver.classList.add('invisible');
      cardEnTitle.classList.add('invisible');
    });
  }

  static removeInvisible(selectCard: Array<HTMLElement>): void {
    selectCard.forEach((element) => {
      const turnOver = element.children[0].children[2];
      const cardEnTitle = element.children[0].children[0].children[0];
      const cardFront = element.children[0].children[0];
      turnOver.classList.remove('invisible');
      cardEnTitle.classList.remove('invisible');
      cardFront.classList.remove('inactive');
    });
  }
}
