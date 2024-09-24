import { IconStyle } from '@here/hds-icon';
import '@here/hds-icon';
import { IconCategory } from '@here/hds-iconlibrary';
import { LitElement } from 'lit';
export declare type AvatarSize = 'small' | 'medium' | 'large' | 'x-large';
/**
 * @summary An avatar component.
 * @cssprop --hds-avatar-background - Controls the background of the avatar
 * @cssprop --hds-avatar-border-background - Controls the background of the avatar's border
 * @cssprop --hds-avatar-focus-ring-color - Controls the color of the focus ring
 * */
export declare class Avatar extends LitElement {
    static styles: import("lit").CSSResultGroup;
    disabled: boolean;
    borderless: boolean;
    size: AvatarSize;
    name: string | undefined;
    imageUrl: string | undefined;
    icon: string | undefined;
    iconCategory: IconCategory;
    iconStyle: IconStyle;
    /**
     * @example
     * this.getInitials('Jane Mary Doe'); // returns 'JM'
     * @example
     * this.getInitials('Jane'); // returns 'Ja'
     * @example
     * this.getInitials(' '); // returns ''
     */
    protected getInitials(name: string | undefined): string;
    protected render(): import("lit-html").TemplateResult<1>;
    private getIconSize;
    private renderContent;
}
declare global {
    interface HTMLElementTagNameMap {
        'hds-avatar': Avatar;
    }
}
