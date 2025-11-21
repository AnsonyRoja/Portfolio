import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSphereComponent } from './skills-sphere.component';

describe('SkillsSphereComponent', () => {
  let component: SkillsSphereComponent;
  let fixture: ComponentFixture<SkillsSphereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsSphereComponent]
    });
    fixture = TestBed.createComponent(SkillsSphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
