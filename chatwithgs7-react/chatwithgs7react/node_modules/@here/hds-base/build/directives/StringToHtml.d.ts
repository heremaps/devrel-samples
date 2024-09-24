import { Directive } from 'lit/directive.js';
declare class StringToHTMLDirective extends Directive {
    render(str: string): import("lit-html").TemplateResult<1>;
}
declare const stringToHtml: (str: string) => import("lit-html/directive.js").DirectiveResult<typeof StringToHTMLDirective>;
export default stringToHtml;
