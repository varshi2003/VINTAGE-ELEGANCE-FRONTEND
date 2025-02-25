import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonLocatorComponent } from './salon-locator.component';

describe('SalonLocatorComponent', () => {
  let component: SalonLocatorComponent;
  let fixture: ComponentFixture<SalonLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonLocatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
