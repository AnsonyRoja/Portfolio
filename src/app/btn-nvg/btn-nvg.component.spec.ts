import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnNvgComponent } from './btn-nvg.component';

describe('BtnNvgComponent', () => {
  let component: BtnNvgComponent;
  let fixture: ComponentFixture<BtnNvgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnNvgComponent]
    });
    fixture = TestBed.createComponent(BtnNvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
