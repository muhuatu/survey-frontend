import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavTestComponent } from './sidenav-test.component';

describe('SidenavTestComponent', () => {
  let component: SidenavTestComponent;
  let fixture: ComponentFixture<SidenavTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
