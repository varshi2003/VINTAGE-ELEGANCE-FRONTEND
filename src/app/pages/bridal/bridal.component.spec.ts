import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridalComponent } from './bridal.component';

describe('BridalComponent', () => {
  let component: BridalComponent;
  let fixture: ComponentFixture<BridalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BridalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BridalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
