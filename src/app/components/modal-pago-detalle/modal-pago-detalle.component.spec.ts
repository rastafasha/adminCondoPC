import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoDetalleComponent } from './modal-pago-detalle.component';

describe('ModalPagoDetalleComponent', () => {
  let component: ModalPagoDetalleComponent;
  let fixture: ComponentFixture<ModalPagoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPagoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPagoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
