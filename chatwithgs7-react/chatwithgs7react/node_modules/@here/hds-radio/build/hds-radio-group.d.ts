import { LitElement, nothing, PropertyValues } from 'lit';
export declare type RadioSize = 'small' | 'medium';
export declare type RadioGroupChangePayload = {
    value: string;
    name: string;
    index: number;
    id: string;
};
/**
 * @slot default Content for the list of `hds-radio` items
 *
 * @event {CustomEvent<{value: string; name: string; index: number, id: string}>} change Fired when a radio button has been selected
 */
export declare class RadioGroup extends LitElement {
    static styles: import("lit").CSSResultGroup;
    static formAssociated: boolean;
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        slotAssignment?: SlotAssignmentMode | undefined;
    };
    vertical: boolean;
    disabled: boolean;
    name: string;
    value: string;
    label: string | undefined;
    secondaryLabel: string | undefined;
    size: RadioSize;
    protected radiosSlot: HTMLElement;
    private labelId;
    private secondaryLabelId;
    connectedCallback(): void;
    protected firstUpdated(): void;
    protected updated(_changedProperties: PropertyValues): void;
    protected renderLabel(): typeof nothing | import("lit-html").TemplateResult<1>;
    protected getAriaLabelledBy(): string;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Captures the event emitted by a hds-radio component and emits a new event with the index of the selected radio instead
     * of the emitted radio id.
     *
     * @param evt
     */
    private _handleSelectedRadio;
    private _getRadioIndex;
    private _getSelectedRadio;
    private _setSelectedRadio;
    private _setSelectedRadioByValue;
    private _setRadioSize;
    private _setRadiosDisabled;
    private _getRadios;
    private _setFocusableRadio;
    private _handleSelectNext;
    private _handleSelectPrevious;
    private _selectRadioByIndexPredicate;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-radio-group': RadioGroup;
    }
}
