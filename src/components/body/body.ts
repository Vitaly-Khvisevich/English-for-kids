import { gameElements, OBJECTS, ProgramSettings, shareElements } from '../base';
import { BaseComponent } from '../base-component';
import { Footer } from '../footer/footer';
import { createElement } from '../painter';
import { AdminHeader } from './adminHeader/adminHeader';
import { AdminPage } from './adminPage/adminPage';
import './body.scss';
import { Card } from './card/card';
import { Statistic } from './statistic/statistic';

export class Body extends BaseComponent {
  catInfo: { index: number; categoryName: string; countWords: number; hash: string; src: string }[] | undefined;

  createCatagories(): HTMLElement {
    super.create('div', ['body']);
    const gameBlock = createElement(this.element, 'div', 'gameBlock');
    this.loadingCategories(gameBlock);
    return this.element;
  }

  loadingCategories(mainBlock: HTMLElement): void {
    this.catInfo = [];
    this.catInfo = OBJECTS.categoryHistory;
    Body.createCatContainers(this.catInfo, mainBlock);
  }

  static createCatContainers(
    categories: { index: number; categoryName: string; countWords: number; hash: string; src: string }[],
    mainBlock: HTMLElement
  ): void {
    categories.forEach((element) => {
      Body.createCardCategory(mainBlock, element.src, `${element.categoryName}`, element.hash);
    });
  }

  static createCardCategory(mainBlock: HTMLElement, src: string, cardName: string, hash: string): void {
    const card = createElement(mainBlock, 'a', 'cardCategory', '', '', hash);
    createElement(card, 'img', 'cardImg', '', 'Card1', '', '', src);
    const cardSpan = createElement(card, 'span', 'card');
    cardSpan.innerHTML = cardName;
    const addClass = (<HTMLInputElement>shareElements.menuSwitchInput).checked ? 'train' : 'play';
    card.classList.add(addClass);
    OBJECTS.cardCategories.push(card);
  }

  static findHistoryElement(selectCategory: string): string {
    let findSelectElement = selectCategory;
    OBJECTS.categoryHistory.forEach((element) => {
      if (element.hash === `#${selectCategory}`) {
        findSelectElement = element.categoryName;
      }
    });
    return findSelectElement;
  }

  static bodyAct(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('turnOver')) {
      (<HTMLElement>event.target).closest('.SelectCards')?.classList.add('transform');
    }
    if ((<HTMLElement>event.target).classList.contains('front')) {
      if ((<HTMLInputElement>shareElements.menuSwitchInput).checked) {
        const selectCard = (<HTMLDivElement>(<HTMLElement>event.target).children[0]).innerHTML;
        const findCategoryStr = localStorage.getItem(selectCard);
        const findCategory = JSON.parse(<string>findCategoryStr);
        let selectCategory = findCategory.category;
        Body.setLocalStorage(selectCard, 'clicks');
        selectCategory = Body.findHistoryElement(selectCategory);
        const findSelectElement = (<string[]>OBJECTS.categories[0]).indexOf(selectCategory);
        if (findSelectElement !== -1) {
          const mainElement = OBJECTS.categories[findSelectElement + 1];
          const selectObject = mainElement.slice();
          const promise = new Promise((resolve) => {
            selectObject.forEach((element: unknown): void => {
              if (
                (<{ word: string; translation: string; image: string; audioSrc: string }>element).word === selectCard
              ) {
                resolve((<{ word: string; translation: string; image: string; audioSrc: string }>element).audioSrc);
              }
            });
          });
          promise.then((value) => {
            const audioSrc = `${value}`;
            Body.play(audioSrc);
          });
        }
      } else if ((<HTMLElement>shareElements.button).classList.contains('repeater')) {
        Body.repeatSelectWord(event);
      }
    }
  }

  static repeatSelectWord(event: MouseEvent): void {
    const selectCard = (<HTMLDivElement>(<HTMLElement>event.target).children[0]).innerHTML;
    if (!(<HTMLElement>event.target).classList.contains('inactive')) {
      if (ProgramSettings.standardGame) {
        Body.playStandard(selectCard, event);
      } else {
        Body.playCardError(selectCard, event);
      }
    }
  }

  static playCardError(selectCard: string, event: MouseEvent): void {
    if (selectCard === gameElements.randomErrCard.word) {
      OBJECTS.moreErrorElements.splice(gameElements.elementIndex, 1);
      Body.play('right.mp3');
      (<HTMLElement>event.target).classList.add('inactive');
      createElement(<HTMLElement>shareElements.result, 'img', 'resultImg', '', '', '', '', 'right.svg');
      Body.setLocalStorage(selectCard, 'correct');
      if (OBJECTS.moreErrorElements.length !== 0) {
        setTimeout(Body.nextRandomCar, 2000);
      } else {
        window.location.hash = '#winner';
      }
    } else {
      gameElements.errors += 1;
      createElement(<HTMLElement>shareElements.result, 'img', 'resultImg', '', '', '', '', 'error.svg');
      Body.setLocalStorage(gameElements.randomErrCard.word, 'wrong');
      Body.play('error.mp3');
    }
  }

  static playStandard(selectCard: string, event: MouseEvent): void {
    if (
      selectCard ===
      (<{ word: string; translation: string; image: string; audioSrc: string }>gameElements.randomCard).word
    ) {
      gameElements.selectGroupCards.splice(gameElements.elementIndex, 1);
      Body.play('right.mp3');
      (<HTMLElement>event.target).classList.add('inactive');
      createElement(<HTMLElement>shareElements.result, 'img', 'resultImg', '', '', '', '', 'right.svg');
      Body.setLocalStorage(selectCard, 'correct');
      if (gameElements.selectGroupCards.length !== 0) {
        setTimeout(Body.nextRandomCar, 2000);
      } else {
        window.location.hash = '#winner';
      }
    } else {
      gameElements.errors += 1;
      createElement(<HTMLElement>shareElements.result, 'img', 'resultImg', '', '', '', '', 'error.svg');
      Body.setLocalStorage(
        (<{ word: string; translation: string; image: string; audioSrc: string }>gameElements.randomCard).word,
        'wrong'
      );
      Body.play('error.mp3');
    }
  }

  createSelectCategory(hash: string): HTMLElement {
    let catName = hash;
    super.create('div', ['body']);
    this.element.addEventListener('click', (event) => {
      Body.bodyAct(event);
    });
    catName = Body.findHistoryElement(hash);
    const findObjects = (<string[]>OBJECTS.categories[0]).indexOf(catName);
    if (findObjects !== -1) {
      const mainElement = OBJECTS.categories[findObjects + 1];
      let selectObject = mainElement.slice();
      selectObject = selectObject.sort(() => Math.random() - 0.5);
      OBJECTS.cards = [];
      this.createHeadBody();
      const gameBlock = createElement(this.element, 'div', 'gameBlock');
      selectObject.forEach((element: unknown): void => {
        const card = new Card();
        const cardElement = card.createCard(
          <{ word: string; translation: string; image: string; audioSrc: string }>element
        );
        OBJECTS.cards.push(cardElement);
        gameBlock.appendChild(cardElement);
      });
      this.createFooterBody();
    }
    return this.element;
  }

  static setLocalStorage(card: string, type: string): void {
    const selectElement = localStorage.getItem(card);
    const selectWord = JSON.parse(<string>selectElement);
    const d = type;
    selectWord[d] += 1;
    localStorage.setItem(card, JSON.stringify(selectWord));
  }

  static startGameButtonDown(button: HTMLElement): void {
    if (ProgramSettings.standardGame) {
      if (!button.classList.contains('repeater')) {
        button.classList.add('repeater');
        const history = Body.findHistoryElement(ProgramSettings.currentPage);
        const currentPage = history === ProgramSettings.currentPage ? ProgramSettings.currentPage : history;
        const findObjects = (<string[]>OBJECTS.categories[0]).indexOf(currentPage);
        if (findObjects !== -1) {
          const mainElement = OBJECTS.categories[findObjects + 1];
          const selectObject = mainElement.slice();
          gameElements.selectGroupCards = selectObject;
          Body.nextRandomCar();
        }
      } else {
        const audioSrc = `${
          (<{ word: string; translation: string; image: string; audioSrc: string }>gameElements.randomCard).audioSrc
        }`;
        Body.play(audioSrc);
      }
    } else if (!button.classList.contains('repeater')) {
      button.classList.add('repeater');
      Body.nextRandomCar();
    } else {
      const audioSrc = Body.findWordSound(gameElements.randomErrCard.word, gameElements.randomErrCard.category);
      if (audioSrc !== undefined) {
        Body.play(audioSrc);
      }
    }
  }

  static findWordSound(selectWord: string, category: string): string | undefined {
    const findObjects = (<string[]>OBJECTS.categories[0]).indexOf(category);
    const selectCat = OBJECTS.categories[findObjects + 1] as {
      word: string;
      translation: string;
      image: string;
      audioSrc: string;
    }[];
    const selWord = selectCat.find((item) => item.word === selectWord);
    return selWord?.audioSrc;
  }

  static nextRandomCar(): void {
    if (ProgramSettings.standardGame) {
      gameElements.elementIndex = Math.floor(Math.random() * gameElements.selectGroupCards.length);
      const currentElement = gameElements.selectGroupCards[gameElements.elementIndex];
      gameElements.randomCard = currentElement;
      const audioSrc = `${
        (<{ word: string; translation: string; image: string; audioSrc: string }>gameElements.randomCard).audioSrc
      }`;
      Body.play(audioSrc);
    } else {
      gameElements.elementIndex = Math.floor(Math.random() * OBJECTS.moreErrorElements.length);
      const currentElement = OBJECTS.moreErrorElements[gameElements.elementIndex];
      gameElements.randomErrCard = currentElement;
      const audioSrc = Body.findWordSound(gameElements.randomErrCard.word, gameElements.randomErrCard.category);
      if (audioSrc !== undefined) {
        Body.play(audioSrc);
      }
    }
  }

  static changeHash(): void {
    window.location.hash = '#main';
  }

  creteWinner(): HTMLElement {
    super.create('div', ['body']);
    const winnerImgContainer = createElement(this.element, 'div', 'winnerImgContainer');
    ProgramSettings.standardGame = true;
    (<HTMLInputElement>shareElements.menuSwitchInput).checked = true;
    if (gameElements.errors !== 0) {
      const imgSrc = 'wrong.jpg';
      createElement(winnerImgContainer, 'img', 'imgWinner', '', '', '', '', imgSrc);
      const spanWinner = createElement(winnerImgContainer, 'h2', 'spanWinner');
      const could = gameElements.errors === 1 ? 'mistake' : 'mistakes';
      spanWinner.innerHTML = `You have ${gameElements.errors} ${could}, try again`;
      Body.play('fail.mp3');
    } else {
      const imgSrc = 'success.jpg';
      createElement(winnerImgContainer, 'img', 'imgWinner', '', '', '', '', imgSrc);
      const spanWinner = createElement(winnerImgContainer, 'h2', 'spanWinner');
      spanWinner.innerHTML = `Congratulations! You're doing fine`;
      Body.play('fanfare.mp3');
    }
    setTimeout(Body.changeHash, 4000);
    return this.element;
  }

  creteStatistic(): HTMLElement {
    super.create('div', ['body']);
    const statistic = new Statistic();
    const statisticElement = statistic.create();
    this.element.appendChild(statisticElement);
    return this.element;
  }

  static goMain(): void {
    window.location.hash = 'main';
  }

  createHeadBody(): void {
    const titleContainer = createElement(this.element, 'div', 'titleContainer');
    const title = createElement(titleContainer, 'h2', 'title');
    title.innerHTML = ProgramSettings.currentPage.toUpperCase();
    const result = createElement(this.element, 'div', 'result');
    shareElements.result = result;
    if ((<HTMLInputElement>shareElements.menuSwitchInput).checked) {
      result.classList.add('invisible');
    }
  }

  createFooterBody(): void {
    const buttonContainer = createElement(this.element, 'div', 'buttonContainer');
    const button = createElement(buttonContainer, 'button', 'button');
    shareElements.button = button;
    button.innerHTML = 'Start game';
    button.addEventListener('mousedown', () => Body.startGameButtonDown(button));
    if ((<HTMLInputElement>shareElements.menuSwitchInput).checked) {
      button.classList.add('invisible');
    }
  }

  createRepeatPage(): HTMLElement {
    super.create('div', ['body']);
    this.element.addEventListener('click', (event) => {
      Body.bodyAct(event);
    });
    if (OBJECTS.moreErrorElements.length === 0) {
      const winnerImgContainer = createElement(this.element, 'div', 'winnerImgContainer');
      const imgSrc = 'nothing.jpg';
      createElement(winnerImgContainer, 'img', 'imgWinner', '', '', '', '', imgSrc);
      const spanWinner = createElement(winnerImgContainer, 'h2', 'spanWinner');
      spanWinner.innerHTML = `There are no misspelled words in the learning process`;
      setTimeout(Body.goMain, 2000);
    } else {
      this.createHeadBody();
      const gameBlock = createElement(this.element, 'div', 'gameBlock');
      shareElements.errorCards = [];
      OBJECTS.moreErrorElements.forEach((element) => {
        const tempObj = {} as { word: string; translation: string; image: string; audioSrc: string };
        tempObj.word = element.word;
        tempObj.translation = element.translation;

        for (let i = 1; i < OBJECTS.categories.length; i++) {
          OBJECTS.categories[i].forEach((el: unknown) => {
            if ((<
                {
                  word: string;
                  translation: string;
                  image: string;
                  audioSrc: string;
                }
              >el).word === tempObj.word) {
              tempObj.image = (<{ word: string; translation: string; image: string; audioSrc: string }>el).image;
              tempObj.audioSrc = (<{ word: string; translation: string; image: string; audioSrc: string }>el).audioSrc;
            }
          });
        }
        const card = new Card();
        ProgramSettings.standardGame = false;
        const cardElement = card.createCard(
          <{ word: string; translation: string; image: string; audioSrc: string }>tempObj
        );
        shareElements.errorCards.push(cardElement);
        gameBlock.appendChild(cardElement);
      });
      this.createFooterBody();
    }
    return this.element;
  }

  static play(src: string): void {
    const audio = new Audio(src);
    audio.play();
  }

  createAdminPage(): HTMLElement {
    super.create('div', ['body']);
    const adminHeader = new AdminHeader();
    const adminHeadElement = adminHeader.createHeader();
    this.element.appendChild(adminHeadElement);
    const adminPage = new AdminPage();
    const adminElement = adminPage.createPage();
    this.element.appendChild(adminElement);
    const footer = new Footer();
    const footerElement = footer.create();
    this.element.appendChild(footerElement);
    return this.element;
  }
}
