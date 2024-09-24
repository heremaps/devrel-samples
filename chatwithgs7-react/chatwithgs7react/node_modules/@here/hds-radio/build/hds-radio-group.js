import { __decorate } from "tslib";
import { customElement } from '@here/hds-base';
import { html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styles } from './hds-radio-group.css.js';
import { Radio } from './hds-radio.js';
let id = 1;
/**
 * @slot default Content for the list of `hds-radio` items
 *
 * @event {CustomEvent<{value: string; name: string; index: number, id: string}>} change Fired when a radio button has been selected
 */
let RadioGroup = class RadioGroup extends LitElement {
    constructor() {
        super(...arguments);
        this.vertical = false;
        this.disabled = false;
        this.name = '';
        this.value = '';
        this.size = 'medium';
        this._setFocusableRadio = () => {
            const selectedRadio = this._getSelectedRadio();
            const currentRadio = selectedRadio || this._getRadios()[0];
            if (currentRadio && !this.disabled && !currentRadio.disabled) {
                currentRadio.tabIndex = 0;
            }
        };
        this._handleSelectNext = (e) => {
            e.stopPropagation();
            this._selectRadioByIndexPredicate(e.detail, (currentRadioIndex, radiosCount) => currentRadioIndex < radiosCount - 1 ? currentRadioIndex + 1 : 0);
        };
        this._handleSelectPrevious = (e) => {
            e.stopPropagation();
            this._selectRadioByIndexPredicate(e.detail, (currentRadioIndex, radiosCount) => currentRadioIndex > 0 ? currentRadioIndex - 1 : radiosCount - 1);
        };
    }
    connectedCallback() {
        super.connectedCallback();
        id++;
        if (this.label) {
            this.labelId = `hds-radio-group-label-${id}`;
        }
        if (this.secondaryLabel) {
            this.secondaryLabelId = `hds-radio-group-secondary-label-${id}`;
        }
    }
    firstUpdated() {
        if (this.value === '' || !this.value) {
            const selectedRadio = this._getSelectedRadio();
            if (selectedRadio)
                this.value = selectedRadio.value;
        }
        else {
            this._setSelectedRadioByValue(this.value);
        }
        if (this.disabled) {
            this._setRadiosDisabled();
        }
        this._setFocusableRadio();
        this._setRadioSize(this.size);
    }
    updated(_changedProperties) {
        if (_changedProperties.has('disabled')) {
            this._setRadiosDisabled();
        }
        if (_changedProperties.has('value')) {
            this._setSelectedRadioByValue(this.value);
        }
    }
    renderLabel() {
        if (this.label || this.secondaryLabel) {
            return html `
        <hds-label id="${this.labelId}">
          ${this.label} <span slot="secondary">${this.secondaryLabel}</span>
        </hds-label>
      `;
        }
        return nothing;
    }
    getAriaLabelledBy() {
        let ariaLabelledBy = '';
        ariaLabelledBy += this.label ? this.labelId : '';
        ariaLabelledBy += this.secondaryLabel ? ` ${this.secondaryLabelId}` : '';
        return ariaLabelledBy;
    }
    render() {
        const classes = {
            wrapper: true,
            '-vertical': this.vertical,
        };
        const _ariaLabelledBy = this.getAriaLabelledBy();
        return html `
      ${this.label || this.secondaryLabel ? this.renderLabel() : nothing}
      <div
        role="radiogroup"
        class="${classMap(classes)}"
        @change="${this._handleSelectedRadio}"
        @selectNext="${this._handleSelectNext}"
        @selectPrevious="${this._handleSelectPrevious}"
        aria-label="${ifDefined(this.getAttribute('aria-label'))}"
        aria-labelledby="${_ariaLabelledBy}"
      >
        <slot></slot>
      </div>
    `;
    }
    /**
     * Captures the event emitted by a hds-radio component and emits a new event with the index of the selected radio instead
     * of the emitted radio id.
     *
     * @param evt
     */
    _handleSelectedRadio(evt) {
        evt.stopPropagation();
        const { detail: { id: radioId, value }, } = evt;
        const currentSelectedRadio = this._getSelectedRadio();
        const newSelectedRadioIndex = this._getRadioIndex(radioId);
        if (newSelectedRadioIndex !== -1) {
            this._setSelectedRadio(radioId);
            this.value = value;
            if (currentSelectedRadio?.id !== radioId) {
                this.dispatchEvent(new CustomEvent('change', {
                    detail: { value: this.value, name: this.name, id: this.id, index: newSelectedRadioIndex },
                    bubbles: true,
                    composed: true,
                }));
            }
        }
    }
    _getRadioIndex(radioId) {
        return this._getRadios().findIndex(radio => radio.id === radioId);
    }
    _getSelectedRadio() {
        return this._getRadios().find(radio => radio.checked);
    }
    _setSelectedRadio(radioId) {
        const radios = this._getRadios();
        radios.forEach(radio => {
            if (radio.id === radioId) {
                radio.checked = true;
                radio.tabIndex = 0;
            }
            else {
                radio.checked = false;
                radio.tabIndex = -1;
            }
        });
    }
    _setSelectedRadioByValue(value) {
        const radios = this._getRadios();
        radios.forEach(radio => {
            if (radio.value === value) {
                radio.checked = true;
                radio.tabIndex = 0;
            }
            else {
                radio.checked = false;
                radio.tabIndex = -1;
            }
        });
    }
    _setRadioSize(size) {
        const radioItems = this._getRadios();
        for (let i = 0; i < radioItems.length; i++) {
            radioItems[i].size = size;
        }
    }
    _setRadiosDisabled() {
        const radioItems = this._getRadios();
        for (let i = 0; i < radioItems.length; i++) {
            radioItems[i].isRadioGroupDisabled = this.disabled;
        }
    }
    _getRadios() {
        return this.radiosSlot
            .assignedNodes({ flatten: true })
            .filter((e) => e instanceof Radio);
    }
    _selectRadioByIndexPredicate(currentRadioId, nextIndexPredicate) {
        const radios = this._getRadios();
        const currentRadioIndex = this._getRadioIndex(currentRadioId);
        if (currentRadioIndex !== -1) {
            const newSelectedRadioIndex = nextIndexPredicate(currentRadioIndex, radios.length);
            const newSelectedRadio = radios[newSelectedRadioIndex];
            if (!this.disabled && !newSelectedRadio.disabled) {
                newSelectedRadio.focus();
                this.value = newSelectedRadio.value;
                this.dispatchEvent(new CustomEvent('change', {
                    detail: {
                        value: newSelectedRadio.value,
                        index: newSelectedRadioIndex,
                        name: this.name,
                        id: this.id,
                    },
                    bubbles: true,
                    composed: true,
                }));
            }
        }
    }
};
RadioGroup.styles = styles;
RadioGroup.formAssociated = true;
RadioGroup.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
__decorate([
    property({ type: Boolean, reflect: true })
], RadioGroup.prototype, "vertical", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], RadioGroup.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], RadioGroup.prototype, "name", void 0);
__decorate([
    property({ type: String, reflect: true })
], RadioGroup.prototype, "value", void 0);
__decorate([
    property({ type: String })
], RadioGroup.prototype, "label", void 0);
__decorate([
    property({ type: String, attribute: 'secondary-label' })
], RadioGroup.prototype, "secondaryLabel", void 0);
__decorate([
    property({ type: String })
], RadioGroup.prototype, "size", void 0);
__decorate([
    query('slot')
], RadioGroup.prototype, "radiosSlot", void 0);
RadioGroup = __decorate([
    customElement('hds-radio-group')
], RadioGroup);
export { RadioGroup };
//# sourceMappingURL=hds-radio-group.js.map