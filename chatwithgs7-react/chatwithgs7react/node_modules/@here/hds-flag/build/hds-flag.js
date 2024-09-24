var Flag_1;
import { __decorate } from "tslib";
import { customElement, isSlotEmpty } from '@here/hds-base';
import '@here/hds-icon';
import '@here/hds-tooltip';
import { html, LitElement, nothing } from 'lit';
import { property, query, queryAssignedNodes, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './hds-flag.css.js';
/**
 * @slot default Content for the Flag label
 *
 * @cssprop --hds-flag-custom-accent-color Accent color value
 * @cssprop --hds-flag-custom-font-color Font color value
 * @cssprop --hds-icon-color Icon color value
 */
let Flag = Flag_1 = class Flag extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = 'subtle';
        this.size = 'small';
        this.iconCategory = 'core-ui';
        this.iconOnly = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this.id = this.id || `hds-flag-${++Flag_1.flagIdCounter}`;
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (this.icon) {
            this.iconOnly = isSlotEmpty(this.slotItemsList);
        }
    }
    renderIcon() {
        if (!this.icon) {
            return nothing;
        }
        const iconSize = this.size === 'small' ? '8px' : '16px';
        return html ` <hds-icon
      name="${this.icon}"
      category="${this.iconCategory}"
      size="${iconSize}"
    ></hds-icon>`;
    }
    render() {
        const classes = {
            [`--size-${this.size}`]: true,
            [`--variant-${this.variant}`]: true,
            '--icon-only': this.iconOnly,
        };
        return html ` <div class="hds-flag-wrapper ${classMap(classes)}">
      ${this.renderIcon()}
      <div class="hds-flag-label-wrapper">
        <slot></slot>
      </div>
    </div>`;
    }
};
Flag.flagIdCounter = 0;
Flag.styles = styles;
__decorate([
    property({ type: String })
], Flag.prototype, "variant", void 0);
__decorate([
    property({ type: String })
], Flag.prototype, "size", void 0);
__decorate([
    property({ type: String })
], Flag.prototype, "icon", void 0);
__decorate([
    property({ type: String, attribute: 'icon-category' })
], Flag.prototype, "iconCategory", void 0);
__decorate([
    query('slot')
], Flag.prototype, "slotElement", void 0);
__decorate([
    query('.hds-flag-label-wrapper')
], Flag.prototype, "labelEl", void 0);
__decorate([
    queryAssignedNodes('', true)
], Flag.prototype, "slotItemsList", void 0);
__decorate([
    state()
], Flag.prototype, "iconOnly", void 0);
Flag = Flag_1 = __decorate([
    customElement('hds-flag')
], Flag);
export { Flag };
//# sourceMappingURL=hds-flag.js.map