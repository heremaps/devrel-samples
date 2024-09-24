import { LitElement } from 'lit';
export declare class Tooltip extends LitElement {
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        slotAssignment?: SlotAssignmentMode | undefined;
    };
    position: string;
    interactive: boolean;
    trigger: string;
    private isDisabled;
    private tooltipInstance;
    constructor();
    get disabled(): boolean;
    set disabled(value: boolean);
    get tippyInstance(): any;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    hide(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private createTooltip;
    private destroyTooltip;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-tooltip': Tooltip;
    }
}
