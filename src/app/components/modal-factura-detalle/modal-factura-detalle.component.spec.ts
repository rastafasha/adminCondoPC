import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFacturaDetalleComponent } from './modal-factura-detalle.component';

describe('ModalFacturaDetalleComponent', () => {
  let component: ModalFacturaDetalleComponent;
  let fixture: ComponentFixture<ModalFacturaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFacturaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFacturaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
