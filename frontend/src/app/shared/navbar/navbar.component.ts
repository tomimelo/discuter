import { Component, HostBinding, Input, OnInit } from '@angular/core';

type NavbarFixedPositions = 'top';
type NavbarAlignPositions = 'left' | 'center' | 'right';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  @Input() fixed: NavbarFixedPositions | boolean = false;
  @HostBinding('class.fixed-top')
  public get isFixedTop(): boolean {
    return this.fixed === 'top' || this.fixed === true;
  }

  @Input() align!: NavbarAlignPositions;
  @HostBinding('class.align-left')
  public get isLeftAlign(): boolean {
    return this.align === 'left';
  }

  @HostBinding('class.align-center')
  public get isCenterAlign(): boolean {
    return this.align === 'center';
  }

  @HostBinding('class.align-right')
  public get isRightAlign(): boolean {
    return this.align === 'right';
  }

  ngOnInit(): void {
  }

}
