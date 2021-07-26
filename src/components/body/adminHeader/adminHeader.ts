import { shareElements } from '../../base';
import { BaseComponent } from '../../base-component';
import { createElement } from '../../painter';
import './adminHeader.scss';

export class AdminHeader extends BaseComponent {
  createHeader(): HTMLElement {
    super.create('div', ['adminHeader']);
    const typeChoice = createElement(this.element, 'div', 'choiceContainer');
    const adminCategories = createElement(typeChoice, 'label', 'adminCategories', '', 'Categories');
    adminCategories.classList.add('hActive');
    shareElements.adminCategories = adminCategories;
    const adminWords = createElement(typeChoice, 'label', 'adminWords', '', 'Words');
    shareElements.adminWords = adminWords;
    createElement(this.element, 'a', 'logOut', '', 'Log out', '#reload');
    return this.element;
  }
}
