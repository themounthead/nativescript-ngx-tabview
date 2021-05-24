import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { registerElement } from 'nativescript-angular/element-registry';

import { FlexboxLayout, LayoutBase, StackLayout } from 'tns-core-modules/ui';

import { TabComponent, TabGroupComponent, TabLabelComponent, TabStripComponent, TabViewComponent } from './tabview.component';
import { TabComponentDirective, TabGroupComponentDirective, TabLabelComponentDirective, TabStripComponentDirective, TabViewComponentDirective } from './tabview.directives';

const COMPONENTS = [
  TabViewComponent,
  TabStripComponent,
  TabGroupComponent,
  TabLabelComponent,
  TabComponent,
];
const CONTAINERS = [];
const DIRECTIVES = [
  TabViewComponentDirective,
  TabStripComponentDirective,
  TabGroupComponentDirective,
  TabLabelComponentDirective,
  TabComponentDirective,
];

registerElement('TabView', () => StackLayout);
registerElement('TabStrip', () => FlexboxLayout);
registerElement('TabLabel', () => StackLayout);
registerElement('TabGroup', () => StackLayout);
registerElement('Tab', () => StackLayout);

@NgModule({
  imports: [
    CommonModule,
    NativeScriptCommonModule,
  ],
  providers: [],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TabViewModule { }
