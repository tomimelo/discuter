import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumPassComponent } from './num-pass.component';

describe('NumPassComponent', () => {
  let component: NumPassComponent;
  let fixture: ComponentFixture<NumPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
