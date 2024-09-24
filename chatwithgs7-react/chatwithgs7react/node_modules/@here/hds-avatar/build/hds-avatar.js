import { __decorate } from "tslib";
import { customElement } from '@here/hds-base';
import '@here/hds-icon'; // eslint-disable-line import/no-duplicates
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styles } from './hds-avatar.css.js';
/**
 * @summary An avatar component.
 * @cssprop --hds-avatar-background - Controls the background of the avatar
 * @cssprop --hds-avatar-border-background - Controls the background of the avatar's border
 * @cssprop --hds-avatar-focus-ring-color - Controls the color of the focus ring
 * */
let Avatar = class Avatar extends LitElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.borderless = false;
        this.size = 'medium';
        this.iconCategory = 'core-ui';
        this.iconStyle = 'solid';
    }
    /**
     * @example
     * this.getInitials('Jane Mary Doe'); // returns 'JM'
     * @example
     * this.getInitials('Jane'); // returns 'Ja'
     * @example
     * this.getInitials(' '); // returns ''
     */
    getInitials(name) {
        let initials = '';
        if (name !== undefined) {
            const words = name.trim().split(' ');
            if (words.length === 1) {
                initials = words[0].slice(0, 2);
            }
            else {
                initials = words[0].slice(0, 1) + words[1].slice(0, 1);
            }
        }
        return initials;
    }
    render() {
        const classes = {
            disabled: this.disabled,
            bordered: !this.borderless,
        };
        classes[this.size] = true;
        return html `
      <div
        class="-hds-avatar-wrapper ${classMap(classes)}"
        aria-hidden="true"
        aria-disabled="${ifDefined(this.disabled)}"
      >
        <div class="content">${this.renderContent()}</div>
        <div class="focus-ring"></div>
      </div>
    `;
    }
    getIconSize() {
        switch (this.size) {
            case 'x-large':
                return '24px';
            case 'small':
                return '12px';
            default:
                return '16px';
        }
    }
    renderContent() {
        if (this.imageUrl) {
            return html `<img
        src="${this.imageUrl}"
        alt="${ifDefined(this.name)}"
        class="avatar-image"
        @error="${() => (this.imageUrl = '')}"
      />`;
        }
        // Renders the initials if a name was provided.
        const initials = this.getInitials(this.name);
        if (initials) {
            return html `${initials}`;
        }
        // Otherwise renders the fallback profile icon.
        return html ` <hds-icon
      class="avatar-icon"
      name="${this.icon || 'profile'}"
      category="${this.iconCategory}"
      size="${this.getIconSize()}"
      role="presentation"
      icon-style="${parseInt(this.getIconSize(), 10) > 16 ? this.iconStyle : 'solid'}"
      @error="${() => (this.icon = '')}"
    ></hds-icon>`;
    }
};
Avatar.styles = styles;
__decorate([
    property({ type: Boolean })
], Avatar.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], Avatar.prototype, "borderless", void 0);
__decorate([
    property({ type: String, reflect: true })
], Avatar.prototype, "size", void 0);
__decorate([
    property({ type: String })
], Avatar.prototype, "name", void 0);
__decorate([
    property({ type: String, attribute: 'image-url' })
], Avatar.prototype, "imageUrl", void 0);
__decorate([
    property({ type: String })
], Avatar.prototype, "icon", void 0);
__decorate([
    property({ type: String, attribute: 'icon-category' })
], Avatar.prototype, "iconCategory", void 0);
__decorate([
    property({ type: String, attribute: 'icon-style' })
], Avatar.prototype, "iconStyle", void 0);
Avatar = __decorate([
    customElement('hds-avatar')
], Avatar);
export { Avatar };
//# sourceMappingURL=hds-avatar.js.map