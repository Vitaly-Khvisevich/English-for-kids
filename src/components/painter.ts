export const createElement = (
  mainElement: HTMLElement,
  tag: string,
  elementClass: string,
  type = '',
  value = '',
  href = '',
  target = '',
  src = ''
): HTMLElement => {
  const elem = document.createElement(tag) as HTMLElement;
  if (tag === 'a') {
    (<HTMLLinkElement>elem).href = href;
    (<HTMLLinkElement>elem).target = target;
    (<HTMLLinkElement>elem).innerHTML = value;
  }
  if (tag === 'input') {
    (<HTMLInputElement>elem).value = value;
    (<HTMLInputElement>elem).type = type;
  }
  if (tag === 'img') {
    (<HTMLImageElement>elem).src = src;
    (<HTMLImageElement>elem).alt = value;
  }
  if (tag === 'label' || tag === 'span' || tag === 'button') {
    elem.innerHTML = value;
  }

  elem.className = elementClass;
  mainElement.appendChild(elem);
  return elem;
};
