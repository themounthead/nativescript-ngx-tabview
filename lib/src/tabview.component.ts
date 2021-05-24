import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { StackLayout } from 'tns-core-modules/ui';

import { TabViewStore } from './tabview.store';

type TabStripPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'TabView',
  templateUrl: './tabview.component.html',
  providers: [TabViewStore],
})
export class TabViewComponent implements OnInit, AfterViewInit {

  private _tabStripPosition: TabStripPosition;
  private _tabStripOverlay = false;

  private _isReady = false;

  @Output() tabChange = new EventEmitter<number>();

  constructor(
    public tabViewStore: TabViewStore,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  get tabStripPosition() { return this._tabStripPosition; }
  set tabStripPosition(position) { this._tabStripPosition = position; this._isReady = true; }

  get tabStripOverlay() { return this._tabStripOverlay; }
  set tabStripOverlay(overlay) { this._tabStripOverlay = overlay; this._isReady = true; }

  get isReady() { return this._isReady; }

  get vAlign() {
    if (this._isReady && this._tabStripOverlay) {
      return (['top', 'bottom'].includes(this._tabStripPosition)) ? this._tabStripPosition : 'top';
    }
  }

  get hAlign() {
    if (this._isReady && this._tabStripOverlay) {
      return (['left', 'right'].includes(this._tabStripPosition)) ? this._tabStripPosition : 'center';
    }
  }

}

@Component({
  selector: 'TabStrip',
  template: '<ng-content></ng-content>',
})
export class TabStripComponent implements OnInit, AfterViewInit {

  @Input() position: TabStripPosition = 'top';
  @Input() overlay;

  get _overlay() { return this.overlay === '' || false; }

  constructor(
    private tabView: TabViewComponent,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabView.tabStripPosition = this.position;
      this.tabView.tabStripOverlay = this._overlay;
    }, 100);
  }

}

@Component({
  selector: 'TabLabel',
  template: '<ng-content></ng-content>',
})
export class TabLabelComponent implements OnInit, AfterViewInit {

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  getElementRef() { return this.elementRef; }

}

@Component({
  selector: 'TabGroup',
  template: '<ng-content></ng-content>',
})
export class TabGroupComponent implements OnInit, AfterViewInit {

  ngOnInit() { }

  ngAfterViewInit() { }

}

@Component({
  selector: 'Tab',
  template: '<ng-content></ng-content>',
  styleUrls: ['./tabview.component.scss'],
})
export class TabComponent implements OnInit, AfterViewInit {

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  getElementRef() { return this.elementRef; }

}
