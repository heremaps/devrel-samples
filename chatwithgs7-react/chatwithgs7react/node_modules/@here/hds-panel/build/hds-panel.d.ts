import { LitElement, PropertyValues, TemplateResult } from 'lit';
export declare type PanelVariant = 'vertical' | 'horizontal';
export declare type PanelPosition = 'top' | 'right' | 'bottom' | 'left';
export declare type PanelInteraction = 'none' | 'toggle' | 'drag';
export declare type PanelExpansion = 'open' | 'closed' | 'partial';
export declare type PanelChangePayload = {
    expanded: PanelExpansion;
    resized: boolean;
};
/**
 * @slot default Main content for panel container
 *
 * @event {CustomEvent<{expanded: PanelExpansion; resized: boolean}>} change Fired when there is change in element's state: expanded / collapsed / resized `PanelChangePayload`
 */
export declare class Panel extends LitElement {
    static styles: import("lit").CSSResultGroup;
    static panelCounter: number;
    variant: PanelVariant;
    panelPosition: PanelPosition;
    panelInteraction: PanelInteraction;
    partialSize: number;
    expanded: PanelExpansion;
    overlay: boolean;
    protected containerComputedStyle: any;
    protected resizing: boolean;
    protected slotElement: HTMLSlotElement;
    protected contentElement: HTMLElement;
    protected handleElement: HTMLElement;
    protected wrapperElement: HTMLElement;
    private _left;
    private _top;
    private _right;
    private _bottom;
    private _showPeek;
    private _handleWidth;
    private _handleHeight;
    firstUpdated(): void;
    toggle(): void;
    open(): void;
    close(): void;
    protected updated(_changedProperties: PropertyValues): void;
    protected renderPanel(template?: any): TemplateResult<1>;
    protected render(): TemplateResult<1>;
    private _handleResize;
    private _dragStart;
    private _dragEnd;
    private _handleToggle;
    private _resetWrapperStyles;
    private _renderHandle;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-panel': Panel;
    }
}
