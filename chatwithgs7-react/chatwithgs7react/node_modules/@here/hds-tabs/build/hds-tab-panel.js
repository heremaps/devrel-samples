import { __decorate } from "tslib";
import { customElement } from '@here/hds-base';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './hds-tab-panel.css.js';
/**
 * @slot default Main content related to the corresponding tab
 */
let TabPanel = class TabPanel extends LitElement {
    constructor() {
        super(...arguments);
        this.show = false;
        this.ariaLabelledby = '';
    }
    render() {
        const panelStyles = {
            display: '',
        };
        if (!this.show) {
            panelStyles.display = 'none';
        }
        return html `
      <div
        class="hds-tab-panel-wrapper"
        role="tabpanel"
        aria-labelledby="${ifDefined(this.ariaLabelledby)}"
        style=${styleMap(panelStyles)}
      >
        <slot></slot>
      </div>
    `;
    }
};
TabPanel.styles = styles;
__decorate([
    property({ type: Boolean, reflect: true, attribute: false })
], TabPanel.prototype, "show", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'aria-labelledby' })
], TabPanel.prototype, "ariaLabelledby", void 0);
TabPanel = __decorate([
    customElement('hds-tab-panel')
], TabPanel);
export { TabPanel };
//# sourceMappingURL=hds-tab-panel.js.map