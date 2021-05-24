import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'TabViewItem',
  templateUrl: './tabview-item.component.html',
  styleUrls: ['./tabview-item.component.scss'],
})
export class TabViewItemComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() input;

  @Output() output = new EventEmitter();

  ngOnInit() {
    console.log('loading TabViewItem');
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }

}
