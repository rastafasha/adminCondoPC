import { Component, Input } from '@angular/core';
import { TransferenciaService } from '../../../services/transferencia.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { Transferencia } from '../../../models/transferencia';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { RouterLink } from '@angular/router';
import { ImagenPipe } from '../../../pipes/imagen.pipe';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { ModalinfoTiposPagoComponent } from '../../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { Payment } from '../../../models/payment';
import { BusquedasService } from '../../../services/busqueda.service';
import { ModalFacturaDetalleComponent } from '../../../components/modal-factura-detalle/modal-factura-detalle.component';
import { ModalPagoDetalleComponent } from '../../../components/modal-pago-detalle/modal-pago-detalle.component';

@Component({
  selector: 'app-transferencias',
  imports: [CommonModule, FormsModule,
    RouterLink,
    ImagenPipe,
    // PieChart2Component, BarChartComponent,
    LoadingComponent,
    NgxPaginationModule,
    BackButtnComponent,
    ModalinfoTiposPagoComponent,
    ModalFacturaDetalleComponent,
    ModalPagoDetalleComponent
  ],
  templateUrl: './transferencias.component.html',
  styleUrl: './transferencias.component.css'
})
export class TransferenciasComponent {
  @Input() displaycomponent: string = 'block';
  title = 'Transferencias';

  transferecias!: Transferencia[];
  error!: string;
  p: number = 1;
  count: number = 8;
  isLoading!: boolean
  facturaSeleccionado!: any | null;
  pagoSeleccionado!: any | null;
  public user: any;
  query: string = '';
  status!: string;
  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Ver Todos las Trasnfericias recientes </li>
            <li>Ver a detalle cada Trasnfericia</li>
            <li>Cambiar el estado de las Trasnfericias (Verifica con tu Banco Emisor)</li>
            <li>Encontrar facturas por varias opciones</li>
          </ul>`;

  constructor(
    private trasnsferenciaService: TransferenciaService,
    private busquedasService: BusquedasService,
  ) {
  }

  ngOnInit(): void {
    // this.closeMenu();

    this.getPagos();
    window.scrollTo(0, 0);
    // this.getPagos_list();
  }



  getPagos(): void {
    this.isLoading = true;
    this.trasnsferenciaService.getTransferencias().subscribe((res: any) => {
      this.transferecias = res;
      this.isLoading = false;
      console.log(res)
    });
  }



  search(): void {
    // Case 1: Only selectedType (category) is provided - use category filter
    if (!this.query || this.query === null || this.query === '') {
      if (this.status) {
        this.trasnsferenciaService.getByStatus(this.status).subscribe(
          (resp: any) => {
            this.transferecias = resp;
          }
        );
        return;
      } else {
        // No query and no category - reload all projects
        this.ngOnInit();
        return;
      }
    }
    // Case 2: Query is provided (with or without category)
    else {
      this.busquedasService.searchGlobal(this.query).subscribe(
        (resp: any) => {
          let filteredProjects = resp.transferecias;
          if (this.status) {
            filteredProjects = filteredProjects.filter(
              (payment: Payment) => payment.referencia === this.status
            );
          }
          this.transferecias = filteredProjects;
        }
      );
      return;
    }
  }

  public PageSize(): void {
    this.getPagos();
    this.query = '';
    this.status = '';
  }


  cambiarStatus(data: any) {
    const VALUE = data.status;
    console.log(VALUE);

    this.trasnsferenciaService.updateStatus(data).subscribe(
      resp => {

        console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getPagos();
      }
    )
  }

  openViewModal(factura: any): void {
    this.facturaSeleccionado = factura;
  }

  onCloseModal(): void {
    this.facturaSeleccionado = null;
  }
  openViewModalPago(pago: any): void {
    this.pagoSeleccionado = pago;
  }

  onCloseModalPago(): void {
    this.pagoSeleccionado = null;
  }
}
