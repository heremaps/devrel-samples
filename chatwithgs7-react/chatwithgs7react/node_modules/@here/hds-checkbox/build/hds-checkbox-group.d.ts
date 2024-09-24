import { BaseElement } from '@here/hds-base';
import { nothing } from 'lit';
/**
 *
 * @slot default List of `hds-checkbox` elements
 */
export declare class CheckboxGroup extends BaseElement {
    static styles: import("lit").CSSResultGroup;
    protected static id: number;
    label: string | undefined;
    secondaryLabel: string | undefined;
    ariaLabel: string;
    protected isTabbable: boolean;
    private labelId;
    private secondaryLabelId;
    connectedCallback(): void;
    protected renderPrimaryLabel(): typeof nothing | import("lit-html").TemplateResult<1>;
    protected renderSecondaryLabel(): typeof nothing | import("lit-html").TemplateResult<1>;
    protected renderLabels(): typeof nothing | import("lit-html").TemplateResult<1>;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-checkbox-group': CheckboxGroup;
    }
}
