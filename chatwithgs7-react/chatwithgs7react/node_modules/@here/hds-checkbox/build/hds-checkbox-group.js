var CheckboxGroup_1;
import { __decorate } from "tslib";
import { customElement, BaseElement } from '@here/hds-base';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styles } from './hds-checkbox-group.css.js';
/**
 *
 * @slot default List of `hds-checkbox` elements
 */
let CheckboxGroup = CheckboxGroup_1 = class CheckboxGroup extends BaseElement {
    constructor() {
        super(...arguments);
        this.ariaLabel = '';
        this.isTabbable = true;
    }
    connectedCallback() {
        super.connectedCallback();
        CheckboxGroup_1.id++;
        if (this.label) {
            this.labelId = `hds-checkbox-group-label-${CheckboxGroup_1.id}`;
        }
        if (this.secondaryLabel) {
            this.secondaryLabelId = `hds-checkbox-group-secondary-label-${CheckboxGroup_1.id}`;
        }
    }
    renderPrimaryLabel() {
        if (this.label) {
            return html ` <label class="label-primary" id="${ifDefined(this.labelId)}">
        <div class="label-text label-text-primary">${this.label}</div>
      </label>`;
        }
        return nothing;
    }
    renderSecondaryLabel() {
        if (this.secondaryLabel) {
            return html ` <label class="label-secondary" id="${ifDefined(this.secondaryLabelId)}">
        <div class="label-text label-text-secondary">${this.secondaryLabel}</div>
      </label>`;
        }
        return nothing;
    }
    renderLabels() {
        if (this.label || this.secondaryLabel) {
            return html ` <div class="label-container clearfix">
        ${this.renderPrimaryLabel()} ${this.renderSecondaryLabel()}
      </div>`;
        }
        return nothing;
    }
    render() {
        const ariaLabelledBy = `${this.label ? this.labelId : ''} ${this.secondaryLabel ? this.secondaryLabelId : ''}`;
        return html ` ${this.renderLabels()}
      <div
        class="-hds-checkbox-group-wrapper"
        role="group"
        .ariaLabel="${ifDefined(this.ariaLabel.trim())}"
        aria-labelledby="${ifDefined(ariaLabelledBy.trim())}"
      >
        <slot></slot>
      </div>`;
    }
};
CheckboxGroup.styles = styles;
CheckboxGroup.id = 0;
__decorate([
    property({ type: String })
], CheckboxGroup.prototype, "label", void 0);
__decorate([
    property({ type: String, attribute: 'secondary-label' })
], CheckboxGroup.prototype, "secondaryLabel", void 0);
__decorate([
    property({ type: String, attribute: 'aria-label' })
], CheckboxGroup.prototype, "ariaLabel", void 0);
CheckboxGroup = CheckboxGroup_1 = __decorate([
    customElement('hds-checkbox-group')
], CheckboxGroup);
export { CheckboxGroup };
//# sourceMappingURL=hds-checkbox-group.js.map