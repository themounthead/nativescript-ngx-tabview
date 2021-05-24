import { Injectable } from '@angular/core';

import { ComponentStore } from '@ngrx/component-store';

export interface ITabViewState {
  activeIndex: number;
  targetIndex: number;
  isViewReady: boolean;
}

export const DEFAULT_STATE: ITabViewState = {
  activeIndex: 0,
  targetIndex: undefined,
  isViewReady: false,
};

@Injectable()
export class TabViewStore extends ComponentStore<ITabViewState> {

  constructor() {
    super(DEFAULT_STATE);
  }

  readonly getActiveIndex$ = this.select(state => state.activeIndex);
  readonly setActiveIndex = this.updater((state: ITabViewState, activeIndex: number) => ({ ...state, activeIndex }));

  readonly getTargetIndex$ = this.select(state => state.activeIndex);
  readonly setTargetIndex = this.updater((state: ITabViewState, activeIndex: number) => ({ ...state, activeIndex }));

  readonly isViewReady$ = this.select(state => state.isViewReady);
  readonly setViewReady = this.updater((state: ITabViewState, isViewReady: boolean) => ({ ...state, isViewReady }));

}
