import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseListComponent } from './response-list.component';

describe('ResponseListComponent', () => {
  let component: ResponseListComponent;
  let fixture: ComponentFixture<ResponseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
