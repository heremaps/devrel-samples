import { LitElement } from 'lit';
/**
 * @slot default Main content related to the corresponding tab
 */
export declare class TabPanel extends LitElement {
    static styles: import("lit").CSSResultGroup;
    show: boolean;
    ariaLabelledby: string;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-tab-panel': TabPanel;
    }
}
