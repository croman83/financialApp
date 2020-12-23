import { CustomAttributes } from "../models/custom-attrs";

export class myFramework {

  constructor(obj: { [key: string]: any }) {
    this.el = obj.el;
    this.data = obj?.data;
    this.methods = obj?.methods;
    this.values = obj?.values;
    this.init();
  }

  el: HTMLElement;
  data: () => {};
  methods: {}
  values: {};
  init() {
    this.render();
  };
  render(nodes: HTMLCollection = null) {
    const elems = nodes || this.el.children;

    for (let i = 0; i < elems.length; i++) {
      const element: Element = elems[i];
      const attrs = Array.from(element.attributes);

      attrs.map((attribute: Attr) => {
        const attrName: string = attribute.name;
        if (element.attributes.hasOwnProperty(attrName)) {

          switch (attrName) {
            case CustomAttributes.vhtml:
              const customHtml = element.getAttribute(attrName);
              element.textContent = customHtml;
              break;

            case CustomAttributes.vif:
              const customAttr = element.getAttribute(attrName);
              const splitted = customAttr.split(' ');
              if (this.values) {
                Object.values(this.values).forEach((value) => {
                  if (value === splitted[2]) {
                    if (element instanceof HTMLElement) {
                      element.style.display = 'none'
                    }
                  }
                })
              }
              break;

            case CustomAttributes.vclick:
            case CustomAttributes.vchange:
              let customEventName: string = element.getAttributeNode(attrName).name;
              let eventCallbackName: string = element.getAttributeNode(attrName).value;
              const prefix: string = 'v-';
              const leftBracket: string = '(';
              const bracketIndex = eventCallbackName.indexOf(leftBracket);
              eventCallbackName = eventCallbackName.slice(0, bracketIndex);

              if (customEventName.startsWith(prefix)) {
                customEventName = customEventName.slice(2);
              }
              if (typeof (this as any).methods[eventCallbackName] === 'function') {
                element.addEventListener(customEventName, (this as any).methods[eventCallbackName])
              }
              break;
          }
        }
      });
      if (elems[i].children) {
        this.render(elems[i].children);
      }
    }
  }
}