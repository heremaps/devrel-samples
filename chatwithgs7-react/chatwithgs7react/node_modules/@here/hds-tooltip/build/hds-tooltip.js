import { __decorate } from "tslib";
import { customElement, closestElement } from '@here/hds-base';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import tippy from 'tippy.js';
let Tooltip = class Tooltip extends LitElement {
    constructor() {
        super();
        this.position = 'bottom';
        this.interactive = false;
        this.trigger = 'mouseenter focus';
        this.isDisabled = false;
        this.hide = this.hide.bind(this);
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(value) {
        const oldVal = this.isDisabled;
        this.isDisabled = value;
        if (this.tooltipInstance?.length) {
            if (this.isDisabled) {
                this.tooltipInstance[0].disable();
            }
            else {
                this.tooltipInstance[0].enable();
            }
        }
        this.requestUpdate('disable', oldVal);
    }
    get tippyInstance() {
        return this.tooltipInstance;
    }
    connectedCallback() {
        super.connectedCallback();
        this.hide();
    }
    firstUpdated() {
        this.createTooltip();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.destroyTooltip();
    }
    hide() {
        this.destroyTooltip();
    }
    render() {
        return html `<span>
      <slot></slot>
    </span>`;
    }
    createTooltip() {
        if (!this.id) {
            return;
        }
        const parent = closestElement("[data-theme^='hds-']", this) || this.parentElement;
        // @ts-ignore
        this.tooltipInstance = tippy(`[data-hds-tooltip=${this.id}]`, {
            content: this.children[0],
            placement: this.position,
            allowHTML: true,
            interactive: this.interactive,
            maxWidth: 256,
            theme: 'hds',
            appendTo: () => parent,
            trigger: this.trigger,
            offset: [0, 15],
        });
        if (this.disabled) {
            if (this.tooltipInstance?.length) {
                this.tooltipInstance[0].disable();
            }
        }
    }
    destroyTooltip() {
        if (this.tooltipInstance) {
            this.tooltipInstance.forEach(instance => instance.destroy());
            this.tooltipInstance = null;
        }
    }
};
Tooltip.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
__decorate([
    property({ type: String })
], Tooltip.prototype, "position", void 0);
__decorate([
    property({ type: Boolean })
], Tooltip.prototype, "interactive", void 0);
__decorate([
    property({ type: String })
], Tooltip.prototype, "trigger", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], Tooltip.prototype, "disabled", null);
Tooltip = __decorate([
    customElement('hds-tooltip')
], Tooltip);
export { Tooltip };
//# sourceMappingURL=hds-tooltip.js.map