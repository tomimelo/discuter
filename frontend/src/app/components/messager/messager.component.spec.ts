import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerComponent } from './messager.component';

describe('MessagerComponent', () => {
  let component: MessagerComponent;
  let fixture: ComponentFixture<MessagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
