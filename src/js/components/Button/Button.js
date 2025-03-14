export default class Button {
  constructor(text, type = 'default', dataAction = '') {
    this.text = text;
    this.type = type;
    this.dataAction = dataAction;
    this.element = this.createButton();
  }

  createButton() {
    const button = document.createElement('button');
    button.classList.add('button', this.type);
    button.textContent = this.text;

    if (this.dataAction) {
      button.setAttribute('data-action', this.dataAction);
    }
    return button;
  }

  clone() {
    return new Button(this.text, this.type, this.dataAction);
  }
  
  setPadding(padding) {
    this.element.style.padding = padding;
  }

  setBackgroundColor(color) {
    this.element.style.backgroundColor = color;
  }
  
  render() {
    return this.element.outerHTML;
  }
}
