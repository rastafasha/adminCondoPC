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
  adminId!:string;
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
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.adminId = this.user.uid;
    this.userService.closeMenu();
    this.getPagos();
    window.scrollTo(0, 0);
    // this.getPagos_list();
    this.getStatusFacturas();
  }

  getStatusFacturas(){
      this.facturacionService.getByStatusFaturas().subscribe((resp:any)=>{
        this.stats = resp;
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
    const nuevoEstado = data.status;
    const id = data._id;

    // 1. Caso: RECHAZADO (Pide motivo)
    if (nuevoEstado === 'RECHAZADO') {
      Swal.fire({
        title: 'Motivo del Rechazo',
        input: 'text',
        inputPlaceholder: 'Ej: Capture borroso, monto incompleto...',
        showCancelButton: true,
        confirmButtonText: 'Rechazar y Notificar',
        confirmButtonColor: '#d33', // Rojo para peligro
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) return '¡Debes escribir un motivo para el usuario!';
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.ejecutarUpdateStatus(id, nuevoEstado, result.value);
        } else {
          this.getPagos(); // Revierte el select si cancela
        }
      });

    // 2. Caso: APROBADO (Confirmación de seguridad)
    } else if (nuevoEstado === 'APROBADO') {
      Swal.fire({
        title: '¿Confirmar Pago?',
        text: `¿Estás seguro de marcar como APROBADO el pago de ${data.amount}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Aprobar',
        confirmButtonColor: '#198754', // Verde para éxito
        cancelButtonText: 'No, revisar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ejecutarUpdateStatus(id, nuevoEstado);
        } else {
          this.getPagos(); // Revierte el select si se arrepiente
        }
      });

    } else {
      // 3. Caso: PENDIENTE (Cambio directo)
      this.ejecutarUpdateStatus(id, nuevoEstado);
    }
}


// Función auxiliar para no repetir código del subscribe
private ejecutarUpdateStatus(id: string, nuevoEstado: string, observaciones: string = '') {
    const payload = {
      _id: id,
      nuevoEstado: nuevoEstado,
      usuario_validador: this.adminId,
      observaciones: observaciones // Esto llegará a tu backend para el mensaje del Push/Toastr
    };

    this.paymentService.validarPagoAdmin(payload).subscribe({
      next: (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: nuevoEstado === 'APROBADO' ? '✅ Pago Aprobado' : '❌ Pago Rechazado',
          color: 'gray',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getPagos();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el pago', 'error');
        this.getPagos();
      }
    });
}


  openViewModal(pago: any): void {
    this.pagoSeleccionado = pago;

  }

 onCloseModal(actualizar?: boolean): void {
    this.pagoSeleccionado = null;

    // Si recibimos 'true' desde el formulario hijo, recargamos la lista
    if (actualizar) {
        this.getPagos(); // <--- Sustituye con el nombre de tu función que carga la lista
        console.log('Lista de pagos actualizada tras el registro');
    }
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
