import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFacturaMasivaComponent } from './modal-factura-masiva.component';

describe('ModalFacturaMasivaComponent', () => {
  let component: ModalFacturaMasivaComponent;
  let fixture: ComponentFixture<ModalFacturaMasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFacturaMasivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFacturaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
