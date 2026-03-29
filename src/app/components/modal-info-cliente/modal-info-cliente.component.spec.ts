import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoClienteComponent } from './modal-info-cliente.component';

describe('ModalInfoClienteComponent', () => {
  let component: ModalInfoClienteComponent;
  let fixture: ComponentFixture<ModalInfoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInfoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInfoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
