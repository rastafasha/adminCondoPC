import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PieChart2Component } from '../../components/charts/pie-chart2/pie-chart2.component';
import { BarChartComponent } from '../../components/charts/bar-chart/bar-chart.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { ModalPagoDetalleComponent } from "../../components/modal-pago-detalle/modal-pago-detalle.component";
import { ModalinfoTiposPagoComponent } from '../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { BusquedasService } from '../../services/busqueda.service';
import { ReportarPagoComponent } from "./reportar-pago/reportar-pago.component";
import { FacturacionService } from '../../services/facturacion.service';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, FormsModule,
    // ImagenPipe, 
     PieChart2Component,
     BarChartComponent,
    LoadingComponent,
    NgxPaginationModule,
    BackButtnComponent, ModalPagoDetalleComponent, ModalinfoTiposPagoComponent, NgFor, ReportarPagoComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  title = 'Pagos';

  payments!: Payment[];
  error!: string;
  p: number = 1;
  count: number = 8;
  isLoading!: boolean

  public user: any;
  query: string = '';
  pagoSeleccionado!: any | null;
  option_selectedd: number = 1;
    solicitud_selectedd: any = 1;
    stats:any;

  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Ver Todos los Pagos recientes </li>
            <li>Ver a detalle cada Pago</li>
            <li>Encontrar facturas por varias opciones</li>
            <li>Ver el comportamiento general mediante los gráficos</li>
            <li>Cambiar el estado del Pago (Verifica con tu Banco Emisor)</li>
            <li>Si Eres Cajero / Administrador puedes Cargar Pagos</li>
          </ul>`;
  status!:string;
  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private userService: UserService,
    private http: HttpClient,
    private busquedasService: BusquedasService,
    private facturacionService: FacturacionService,

  ) {
  }

  ngOnInit(): void {
    // this.closeMenu();

    this.getPagos();
    window.scrollTo(0, 0);
    // this.getPagos_list();
    this.getStatusFacturas();
  }

  getStatusFacturas(){
      this.facturacionService.getByStatusFaturas().subscribe((resp:any)=>{
        this.stats = resp;
        console.log(resp)
      })
  
      
    }

  getPagos(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe((res: any) => {
      this.payments = res;
      this.isLoading = false;
    });
  }
  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  search(): void {
      // Case 1: Only selectedType (category) is provided - use category filter
      if (!this.query || this.query === null || this.query === '') {
        if (this.status) {
          this.paymentService.getByStatus(this.status).subscribe(
            (resp: any) => {
              this.payments = resp;
              this.paymentService.emitFilteredProjects(resp);
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
            let filteredProjects = resp.payments;
            if (this.status) {
              filteredProjects = filteredProjects.filter(
                (payment: Payment) => payment.referencia === this.status
              );
            }
            this.payments = filteredProjects;
            this.paymentService.emitFilteredProjects(filteredProjects);
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

    const payload ={
      data: data.status,
      usuario_validador: this.userService.usuario.uid
    }

    this.paymentService.validarPagoAdmin(payload).subscribe(
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


  openViewModal(pago: any): void {
    this.pagoSeleccionado = pago;

  }

  onCloseModal(): void {
    this.pagoSeleccionado = null;
  }

  abrirModalPago(): void {
    // Aquí puedes agregar lógica para abrir el modal de pago masivo
    // Por ejemplo, podrías usar un servicio de modal o simplemente mostrar un componente específico
    console.log('Abrir modal de pago masivo');
  }

   optionSelected(value: number) {
      this.option_selectedd = value;
      if (this.option_selectedd === 1) {
  
        // this.ngOnInit();
      }
      if (this.option_selectedd === 2) {
        this.solicitud_selectedd = null;
      }
    }

}
