import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComunicadoService } from '../../services/comunicado.service';
import Swal from 'sweetalert2';
import { Comunicado } from '../../models/comunicado';


@Component({
  selector: 'app-modal-notificaciones',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-notificaciones.component.html',
  styleUrl: './modal-notificaciones.component.css'
})
export class ModalNotificacionesComponent implements OnChanges {

  @Input() notificacionSeleccionado: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() comunicadoCreado = new EventEmitter<void>();

  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;
  comunicados: any[] = [];
  historial: any[] = [];
  totalComunicados: number = 0;

  private fb = inject(FormBuilder);
  private comunicadoService = inject(ComunicadoService);

  notificacionForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required]],
    mensaje: ['', [Validators.required]],
    tipo: [''],
    alcance_residencia: [''],
    alcance_torre: [''],
    notificado_push: [false]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificacionSeleccionado'] && this.notificacionSeleccionado) {
      this.notificacionForm.patchValue(this.notificacionSeleccionado);
    } else {
      this.notificacionForm.reset();
    }
    this.actualizarHistorial();
  }

  guardar() {
    if (this.notificacionForm.invalid) return;
    Swal.fire({
      title: 'Publicando comunicado...',
      didOpen: () => { Swal.showLoading(); }
    });

    // Usamos el servicio que apunta a /enviar-global
    this.comunicadoService.crearComunicado(this.notificacionForm.value).subscribe({
      next: (resp) => {
        // 1. Cerramos el cargando y mostramos éxito
        Swal.fire({
          icon: 'success',
          title: '¡Publicado!',
          text: 'El comunicado se ha guardado en la cartelera de Parque Central.',
          timer: 2000,
          showConfirmButton: false
        });

        // 2. Limpiamos y cerramos el modal
        this.notificacionForm.reset();
        this.comunicadoCreado.emit();
        this.cerrar();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al publicar',
          text: 'No se pudo enviar el comunicado. Revisa la conexión.'
        });
      }
    });
  }

  cerrar() {
    this.closeModal.emit();
    this.notificacionForm.reset();
    this.solicitud_selectedd = null;
    this.option_selectedd === 1;
    document.getElementById('btnCloseModal')?.click();
  }

  

 actualizarHistorial() {
  this.comunicadoService.obtenerMisComunicados(1).subscribe((resp: any) => {
    // Si tu backend devuelve { ok: true, comunicados: [] }
    this.historial = resp.comunicados || resp; 
    this.totalComunicados = resp.total;
  });
}

  onComunicadoCreado() {
    this.actualizarHistorial();
  }

  optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 3) {
      this.solicitud_selectedd = null;
    }
  }

  

  eliminarComunicado(item: Comunicado) {
     
      Swal.fire({
        title: 'Estas Seguro?',
        text: "No podras recuperarlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.comunicadoService.deleteComunicado(item._id).subscribe(
            response => {
              this.actualizarHistorial();
            }
          );
          Swal.fire(
            'Borrado!',
            'El Archivo fue borrado.',
            'success'
          )
          this.actualizarHistorial();
        }
      });
    }

}
