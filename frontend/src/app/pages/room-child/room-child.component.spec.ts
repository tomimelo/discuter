import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChildComponent } from './room-child.component';

describe('RoomChildComponent', () => {
  let component: RoomChildComponent;
  let fixture: ComponentFixture<RoomChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
