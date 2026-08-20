import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpagegymComponent } from './lpagegym.component';

describe('LpagegymComponent', () => {
  let component: LpagegymComponent;
  let fixture: ComponentFixture<LpagegymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LpagegymComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LpagegymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
