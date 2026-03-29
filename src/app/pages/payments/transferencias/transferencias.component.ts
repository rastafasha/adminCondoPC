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

@Component({
  selector: 'app-transferencias',
  imports: [CommonModule, FormsModule,
    RouterLink,
    ImagenPipe, 
    // PieChart2Component, BarChartComponent,
    LoadingComponent,
    NgxPaginationModule,
    BackButtnComponent,
    ModalinfoTiposPagoComponent
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

  public user: any;
  query: string = '';

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
    });
  }


  search() {
    // return this.paymentService.search(this.query).subscribe((res: any) => {
    //   this.payments = res;
    //   if (!this.query) {
    //     this.ngOnInit();
    //   }
    // });
  }

  public PageSize(): void {
    this.getPagos();
    this.query = '';
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
}
