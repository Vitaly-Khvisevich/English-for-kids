import { OBJECTS, shareElements } from '../../base';
import { BaseComponent } from '../../base-component';
import { createElement } from '../../painter';
import './statistic.scss';

export class Statistic extends BaseComponent {
  create(): HTMLElement {
    super.create('div', ['statistic']);
    this.element.addEventListener('click', (event) => {
      Statistic.statisticActions(event);
    });
    const statButtonsContainer = createElement(this.element, 'div', 'statButtonsContainer');
    const statButtonsWrapper = createElement(statButtonsContainer, 'div', 'statButtonsWrapper');
    shareElements.staticButtonRepeat = createElement(statButtonsWrapper, 'button', 'statButtonRepeat');
    shareElements.staticButtonRepeat.innerHTML = 'Repeat difficult words';
    Statistic.selectStartColor(shareElements.staticButtonRepeat);
    shareElements.staticButtonReset = createElement(statButtonsWrapper, 'button', 'statButtonReset');
    shareElements.staticButtonReset.innerHTML = 'Reset';
    Statistic.selectStartColor(shareElements.staticButtonReset);
    const tableStatistic = createElement(this.element, 'table', 'tableStatistic');
    shareElements.table = tableStatistic;
    const trTable = createElement(tableStatistic, 'tr', 'trTable');
    Statistic.createTh(trTable, 'Word');
    Statistic.createTh(trTable, 'Translation');
    Statistic.createTh(trTable, 'Category');
    Statistic.createTh(trTable, 'Clicks');
    Statistic.createTh(trTable, 'Correct');
    Statistic.createTh(trTable, 'Wrong');
    Statistic.createTh(trTable, '% correct');
    Statistic.getLocalStorageElement();
    return this.element;
  }

  static statisticActions(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('thTable')) {
      if ((<HTMLElement>event.target).children[0].innerHTML === '↓') {
        let thName = '';
        if ((<HTMLElement>event.target).textContent === '↓% correct') {
          thName = 'perCent';
        } else {
          thName = <string>(<HTMLElement>event.target).textContent?.split('↓')[1].toLowerCase();
        }
        Statistic.sortStatistic(<string>thName, 'return');
        (<HTMLElement>event.target).children[0].innerHTML = '↑';
      } else if ((<HTMLElement>event.target).children[0].innerHTML === '↑') {
        let thName = '';
        if ((<HTMLElement>event.target).textContent === '↑% correct') {
          thName = 'perCent';
        } else {
          thName = <string>(<HTMLElement>event.target).textContent?.split('↑')[1].toLowerCase();
        }
        Statistic.sortStatistic(<string>thName, 'straight');
        (<HTMLElement>event.target).children[0].innerHTML = '↓';
      } else {
        shareElements.thTable.forEach((element) => {
          element.children[0].innerHTML = '';
        });
        let thName = '';
        if ((<HTMLElement>event.target).textContent === '% correct') {
          thName = 'perCent';
        } else {
          thName = <string>(<HTMLElement>event.target).textContent?.toLowerCase();
        }
        Statistic.sortStatistic(<string>thName, 'straight');
        (<HTMLElement>event.target).children[0].innerHTML = '↓';
      }
    }
    if ((<HTMLElement>event.target).tagName === 'BUTTON') {
      if ((<HTMLElement>event.target).classList.contains('statButtonRepeat')) {
        Statistic.statButtonRepeatClick();
      } else if ((<HTMLElement>event.target).classList.contains('statButtonReset')) Statistic.statButtonResetClick();
    }
  }

  static createTh(mainElement: HTMLElement, name: string): void {
    const th = createElement(mainElement, 'th', 'thTable');
    th.innerHTML = name;
    const sort = createElement(th, 'span', 'sort');
    th.prepend(sort);
    Statistic.selectStartColor(th);
    shareElements.thTable.push(th);
  }

  static statButtonResetClick(): void {
    localStorage.clear();
    window.location.hash = 'clean';
    Statistic.clearTable();
    Statistic.getLocalStorageElement();
  }

  static statButtonRepeatClick(): void {
    Statistic.sortStatistic('wrong', 'straight');
    OBJECTS.moreErrorElements = [];
    for (let i = 0; i < 9; i++) {
      if (OBJECTS.difArr[i].wrong > 0) OBJECTS.moreErrorElements.push(OBJECTS.difArr[i]);
    }
    window.location.hash = 'repeat';
  }

  static getLocalStorageElement(): void {
    OBJECTS.difArr = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const selectElement = localStorage.getItem(<string>key);
      const selectWord = JSON.parse(<string>selectElement);
      OBJECTS.difArr.push(selectWord);
      const percentCorrect = Number(((selectWord.correct / (selectWord.wrong + selectWord.correct)) * 100).toFixed(2));
      if (percentCorrect > 0) selectWord.perCent = percentCorrect;
    }
    Statistic.createTD();
  }

  static sortStatistic(key: string, order: string): void {
    if (key === 'word' || key === 'translation' || key === 'translation' || key === 'category') {
      if (order === 'straight') {
        OBJECTS.difArr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
      } else {
        OBJECTS.difArr.sort((a, b) => (b[key] > a[key] ? 1 : -1));
      }
      Statistic.clearTable();
      Statistic.createTD();
    } else if (key === 'clicks' || key === 'correct' || key === 'wrong' || key === 'perCent') {
      if (order === 'straight') {
        OBJECTS.difArr.sort((a, b) => <number>b[key] - <number>a[key]);
      } else {
        OBJECTS.difArr.sort((a, b) => <number>a[key] - <number>b[key]);
      }
      Statistic.clearTable();
      Statistic.createTD();
    }
  }

  static createTD(): void {
    shareElements.tdTable = [];
    OBJECTS.difArr.forEach((element) => {
      this.renderingTd(
        <HTMLElement>shareElements.table,
        element.word,
        element.translation,
        element.category,
        element.clicks,
        element.correct,
        element.wrong,
        element.perCent
      );
    });
  }

  static renderingTd(
    mainElement: HTMLElement,
    word: string,
    translation: string,
    category: string,
    clicks: number,
    correct: number,
    wrong: number,
    perCent: number
  ): void {
    const trTable = createElement(mainElement, 'tr', 'trTable');
    const tdWord = createElement(trTable, 'td', 'tdTable');
    tdWord.innerHTML = word;
    const tdTranslation = createElement(trTable, 'td', 'tdTable');
    tdTranslation.innerHTML = translation;
    const tdCategory = createElement(trTable, 'td', 'tdTable');
    tdCategory.innerHTML = category;
    const tdClicks = createElement(trTable, 'td', 'tdTable');
    tdClicks.innerHTML = String(clicks);
    const tdCorrect = createElement(trTable, 'td', 'tdTable');
    tdCorrect.innerHTML = String(correct);
    const tdWrong = createElement(trTable, 'td', 'tdTable');
    tdWrong.innerHTML = String(wrong);
    const tdPerCent = createElement(trTable, 'td', 'tdTable');
    tdPerCent.innerHTML = String(perCent);
    shareElements.tdTable.push(trTable);
  }

  static clearTable(): void {
    shareElements.tdTable.forEach((element) => {
      (<HTMLElement>shareElements.table).removeChild(element);
    });
  }

  static selectStartColor(element: HTMLElement): void {
    const addClass = (<HTMLInputElement>shareElements.menuSwitchInput).checked ? 'tableTrain' : 'tableGame';
    element.classList.add(addClass);
  }
}
