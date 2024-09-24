import { html } from 'lit';
import { Directive, directive } from 'lit/directive.js';
class StringToHTMLDirective extends Directive {
    render(str) {
        const arr = [`${str}`];
        const stringArray = arr;
        stringArray.raw = arr;
        return html(stringArray);
    }
}
const stringToHtml = directive(StringToHTMLDirective);
export default stringToHtml;
//# sourceMappingURL=StringToHtml.js.map