import { AfterViewInit, ChangeDetectorRef, ContentChild, ContentChildren, Directive, ElementRef, Inject, OnInit, QueryList, ViewChildren, forwardRef } from '@angular/core';

import { screen } from 'tns-core-modules/platform';
import { FlexboxLayout, LayoutBase } from 'tns-core-modules/ui';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { SwipeDirection, SwipeGestureEventData } from 'tns-core-modules/ui/gestures';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, throttleTime, withLatestFrom } from 'rxjs/operators';

import { TabComponent, TabLabelComponent, TabViewComponent } from './tabview.component';
import { TabViewStore } from './tabview.store';

@Directive({
  selector: 'TabView',
})
export class TabViewComponentDirective { }

@Directive({
  selector: 'TabStrip',
})
export class TabStripComponentDirective implements OnInit, AfterViewInit {

  private tabStripLayout: FlexboxLayout;

  @ContentChildren(TabLabelComponent) tabList: QueryList<TabLabelComponent>;

  constructor(
    @Inject(forwardRef(() => ElementRef)) private elementRef: ElementRef,
    private tabView: TabViewComponent,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.tabStripLayout = this.elementRef.nativeElement;
    this.tabStripLayout.on('loaded', (e) => this.setupTabs());
  }

  private setupTabs() {
    if (['right', 'left'].includes(this.tabView.tabStripPosition.trim())) { this.tabStripLayout.flexDirection = 'column'; }
    const tabList = this.tabList.toArray();
    if (tabList.length === 0) { return; }
    this.tabList.toArray()
      .map((tab, index) => {
        const tabElement = <LayoutBase>tab.getElementRef().nativeElement;
        tabElement.set('tabIndex', index);
      });
  }

}

@Directive({
  selector: 'TabLabel',
})
export class TabLabelComponentDirective implements OnInit, AfterViewInit {

  private tabLabelElement: LayoutBase;
  private tabViewStore: TabViewStore;

  constructor(
    @Inject(forwardRef(() => TabViewComponent)) private tabViewComponent: TabViewComponent,
    @Inject(forwardRef(() => ElementRef)) private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.tabLabelElement = this.elementRef.nativeElement;
    this.tabViewStore = this.tabViewComponent.tabViewStore;
  }

  ngAfterViewInit() {
    this.tabLabelElement.on('tap', (e) => this.tabViewStore.setTargetIndex(e.object.get('tabIndex')));
    this.watchTabChange();
    this.tabViewStore.isViewReady$
      .pipe()
      .subscribe(() => this.markActiveTab());
  }

  private watchTabChange() {
    this.tabViewStore.getTargetIndex$
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(targetIndex => targetIndex >= 0),
      )
      .subscribe(async targetIndex => {
        const tabIndex = this.tabLabelElement.get('tabIndex');
        if (tabIndex === targetIndex) {
          this.tabLabelElement.cssClasses.add('active');
          this.tabLabelElement._onCssStateChange();
        } else {
          this.tabLabelElement.cssClasses.delete('active');
          this.tabLabelElement._onCssStateChange();
        }
      });
  }

  private markActiveTab() {
    if (this.tabLabelElement.get('tabIndex') === 0) {
      this.tabLabelElement.cssClasses.add('active');
      this.tabLabelElement._onCssStateChange();
    }
  }

}

@Directive({
  selector: 'TabGroup',
})
export class TabGroupComponentDirective implements OnInit, AfterViewInit {

  private tabGroupLayout: LayoutBase;
  private tabGroupWidth;

  @ContentChildren(TabComponent) tabList: QueryList<TabComponent>;

  constructor(
    @Inject(forwardRef(() => ElementRef)) private elementRef: ElementRef,
    @Inject(forwardRef(() => TabViewStore)) private tabViewStore: TabViewStore,
  ) {
    this.tabGroupLayout = <LayoutBase>this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.tabGroupLayout.translateX = 1000; // prevent screen flash
    this.tabGroupLayout.on('loaded', (e) => { setTimeout(() => this.setupTabs(), 100); });
  }

  ngAfterViewInit() { }

  public getTabGroupWidth() { return this.tabGroupWidth; }

  private setupTabs() {
    this.tabViewStore.setViewReady(true);
    this.tabGroupWidth = this.tabGroupLayout.getActualSize().width;
    const tabList = this.tabList.toArray();
    if (tabList.length === 0) { return; }
    this.tabList.toArray()
      .map((tab, index) => {
        const tabElement = <LayoutBase>tab.getElementRef().nativeElement;
        tabElement.set('tabIndex', index);
        tabElement.translateX = index * this.tabGroupWidth;
      });
    this.tabGroupLayout.translateX = 0;
    this.watchTabSwipe();
  }

  private watchTabSwipe() {

    const swipeEvent$: Observable<SwipeGestureEventData> = Observable.create(subscriber => {
      this.tabGroupLayout.on('swipe', (e: SwipeGestureEventData) => subscriber.next(e));
    });

    swipeEvent$
      .pipe(
        throttleTime(300),
        withLatestFrom(this.tabViewStore.getActiveIndex$),
        map(([e, index]) => e.direction === SwipeDirection.right ? --index : ++index),
        filter(index => index >= 0 && index < this.tabList.length),
      )
      .subscribe(index => {
        this.tabViewStore.setTargetIndex(index);
      });

  }

}

@Directive({
  selector: 'Tab',
})
export class TabComponentDirective implements OnInit, AfterViewInit {

  private tab: LayoutBase;
  // private tabIndex: number;
  private tabViewStore: TabViewStore;

  constructor(
    @Inject(forwardRef(() => TabViewComponent)) private tabViewComponent: TabViewComponent,
    @Inject(forwardRef(() => TabGroupComponentDirective)) private tabGroupComponentDirective: TabGroupComponentDirective,
    @Inject(forwardRef(() => ElementRef)) private elementRef: ElementRef,
  ) {
    this.tabViewStore = this.tabViewComponent.tabViewStore;
    this.tab = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.watchTabChange();
  }

  ngAfterViewInit() { }

  private watchTabChange() {
    this.tabViewStore.getTargetIndex$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(targetIndex => targetIndex >= 0),
      )
      .subscribe(async targetIndex => {
        const tabGroupWidth = this.tabGroupComponentDirective.getTabGroupWidth();
        const tabIndex = this.tab.get('tabIndex');
        const delta = tabIndex - targetIndex;
        await this.tab.animate({
          translate: { x: delta * tabGroupWidth, y: 0 },
          curve: AnimationCurve.easeInOut,
          duration: 350,
        });
        if (tabIndex === targetIndex) {
          this.tab.cssClasses.add('active');
          this.tabViewStore.setActiveIndex(targetIndex);
          this.tabViewComponent.tabChange.emit(targetIndex);
        } else {
          this.tab.cssClasses.delete('active');
        }

      });
  }

}
