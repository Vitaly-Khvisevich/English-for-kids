import { BaseComponent } from '../../base-component';
import { createElement } from '../../painter';
import './card.scss';

export class Card extends BaseComponent {
  createCard(myObject: { word: string; translation: string; image: string; audioSrc: string }): HTMLElement {
    super.create('div', ['cardContainer']);
    const card = createElement(this.element, 'div', 'SelectCards');
    this.element.addEventListener('mouseleave', () => {
      card.classList.remove('transform');
    });
    const front = createElement(card, 'div', 'front');
    front.style.backgroundImage = `url(${myObject.image})`;
    const cardEnTitle = createElement(front, 'div', 'cardEnTitle');
    cardEnTitle.innerHTML = `${myObject.word}`;
    const back = createElement(card, 'div', 'back');
    back.style.backgroundImage = `url(${myObject.image})`;
    const cardRuTitle = createElement(back, 'div', 'cardRuTitle');
    cardRuTitle.innerHTML = `${myObject.translation}`;
    createElement(card, 'div', 'turnOver');

    return this.element;
  }
}
