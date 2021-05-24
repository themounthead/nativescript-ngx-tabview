import { Input } from '@angular/core';

import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

export class TabView extends DockLayout {

  @Input() debug;

  get isDebug() { return this.debug || this.debug === ''; }
  get debugClass() { return this.isDebug ? 'debug' : ''; }

  constructor() {
    super();
    console.log('loaded...');
  }

  onLoaded() {
    super.onLoaded();
    if (this.isDebug) { this.className = this.debugClass; }
  }

}
