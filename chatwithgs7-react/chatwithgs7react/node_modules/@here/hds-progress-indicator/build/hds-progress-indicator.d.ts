import { LitElement, PropertyValues } from 'lit';
export declare type ProgressIndicatorColor = 'accent' | 'action' | 'on-light' | 'on-light-subtle' | 'on-dark';
export declare type ProgressIndicatorSize = 'small' | 'large';
export declare type ProgressIndicatorType = 'linear' | 'circular';
export declare type ProgressIndicatorVariant = 'indeterminate' | 'determinate';
export declare class ProgressIndicator extends LitElement {
    static styles: import("lit").CSSResultGroup;
    color: ProgressIndicatorColor;
    size: ProgressIndicatorSize;
    indicatorType: ProgressIndicatorType;
    variant: ProgressIndicatorVariant;
    progress: number;
    ariaLabel: any;
    protected circularDeterminateVariant: HTMLElement;
    private _circularProgressLength;
    firstUpdated(): void;
    updated(): void;
    protected update(changedProperties: PropertyValues): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private _renderLinearVariant;
    private _renderCircularVariant;
    private getCircularDimensions;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-progress-indicator': ProgressIndicator;
    }
}
