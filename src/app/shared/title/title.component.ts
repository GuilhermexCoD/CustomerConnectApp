import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Input() title : string ='';
  @Input() iconClass = 'fa fa-user';
  @Input() subTitle = '';
  @Input() showButtonList = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  list(): void {
    this.router.navigate([`/${this.title.toLocaleLowerCase()}/list`]);
  }
}
