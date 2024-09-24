var Label_1;
import { __decorate } from "tslib";
import { customElement, isSlotEmpty } from '@here/hds-base';
import { html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './hds-label.css.js';
/**
 * @slot default Content for the primary label
 * @slot secondary Content for the secondary label, on the right
 * @slot form-element Form element to reference for accessibility
 *
 */
let Label = Label_1 = class Label extends LitElement {
    constructor() {
        super(...arguments);
        this.type = 'default';
        this.variant = 'default';
    }
    firstUpdated() {
        this.id = this.id || `hds-label-${Label_1.idCounter++}`;
        this.assignAriaLabelledBy();
    }
    updated(_changedProperties) {
        if (_changedProperties.has('id') || _changedProperties.has('for')) {
            this.assignAriaLabelledBy();
        }
        if (isSlotEmpty(this.secondaryLabelSlot)) {
            this.secondaryLabel?.remove();
        }
    }
    render() {
        const cssClasses = {};
        cssClasses[this.type] = true;
        return html `
      <div class="-hds-label-wrapper ${classMap(cssClasses)}">
        <div class="label-container">
          ${this.renderPrimaryLabel()} ${this.renderSecondaryLabel()}
        </div>
        ${this.renderFormElement()}
      </div>
    `;
    }
    renderPrimaryLabel() {
        const cssClasses = {};
        cssClasses[this.variant] = true;
        return html `
      <div class="label-primary ${classMap(cssClasses)}" @click="${this.labelClick}">
        <slot></slot>
      </div>
    `;
    }
    renderSecondaryLabel() {
        return html `
      <div class="label-secondary">
        <slot name="secondary"></slot>
      </div>
    `;
    }
    renderFormElement() {
        return html ` <slot name="form-element"></slot> `;
    }
    labelClick(e) {
        e.stopPropagation();
        if (!this.currentLabelTarget)
            return;
        this.currentLabelTarget.focus();
        this.currentLabelTarget.click();
    }
    findLabelTarget() {
        if (this.for) {
            const scope = this.getRootNode();
            const target = scope.querySelector(`#${this.for}`);
            if (target) {
                return target;
            }
        }
        const slotNodes = this.formElement?.assignedElements({ flatten: true });
        if (slotNodes.length > 0) {
            return slotNodes[0];
        }
        return undefined;
    }
    assignAriaLabelledBy() {
        const target = this.findLabelTarget();
        if (target !== this.currentLabelTarget) {
            if (this.currentLabelTarget) {
                this.currentLabelTarget.removeAttribute('aria-labelledby');
            }
            this.currentLabelTarget = target;
            this.currentLabelTarget?.setAttribute('aria-labelledby', this.id);
        }
    }
};
Label.styles = styles;
Label.idCounter = 0;
__decorate([
    property({ type: String })
], Label.prototype, "for", void 0);
__decorate([
    property({ type: String })
], Label.prototype, "type", void 0);
__decorate([
    property({ type: String })
], Label.prototype, "variant", void 0);
__decorate([
    query('slot[name="form-element"]', true)
], Label.prototype, "formElement", void 0);
__decorate([
    query('.label-secondary', true)
], Label.prototype, "secondaryLabel", void 0);
__decorate([
    query('slot[name="secondary"]')
], Label.prototype, "secondaryLabelSlot", void 0);
__decorate([
    state()
], Label.prototype, "currentLabelTarget", void 0);
Label = Label_1 = __decorate([
    customElement('hds-label')
], Label);
export { Label };
//# sourceMappingURL=hds-label.js.map