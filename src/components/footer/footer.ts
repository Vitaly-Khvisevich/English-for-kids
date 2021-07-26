import { shareElements } from '../base';
import { BaseComponent } from '../base-component';
import { createElement } from '../painter';
import './footer.scss';

export class Footer extends BaseComponent {
  create(): HTMLElement {
    super.create('footer', ['footer']);
    shareElements.footer = this.element;
    const addClass = (<HTMLInputElement>shareElements.menuSwitchInput).checked ? 'menuTrain' : 'menuPlay';
    this.element.classList.add(addClass);
    const footerContainer = createElement(this.element, 'div', 'wrapper');
    createElement(footerContainer, 'a', 'github', '', '', 'https://github.com/Vitaly-Khvisevich', '_blank');
    const rss = createElement(footerContainer, 'a', 'rss', '', '', 'https://rs.school/js/', '_blank');
    const rssYear = createElement(rss, 'span', 'rss-year');
    rssYear.innerHTML = '21';

    return this.element;
  }
}
