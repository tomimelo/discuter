import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonMessageComponent } from './skeleton-message.component';

describe('SkeletonMessageComponent', () => {
  let component: SkeletonMessageComponent;
  let fixture: ComponentFixture<SkeletonMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
