import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'nativescript-ngx-tabview';
  private counter = 42;

  constructor() { }

  public getMessage() {
    return this.counter > 0 ?
      `${this.counter} taps left` :
      'Hoorraaay! You unlocked the NativeScript clicker achievement!';
  }

  public watchTabChange(index) {
    // console.log(index);
  }
}
