import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Facturacion } from '../../models/facturacion';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Residencia } from '../../models/residencia';
import { FacturacionService } from '../../services/facturacion.service';
import Swal from 'sweetalert2';
import { TasabcvService } from '../../services/tasabcv.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-modal-info-factura',
  imports: [CommonModule,
    LoadingComponent,
    ReactiveFormsModule],
  templateUrl: './modal-info-factura.component.html',
  styleUrl: './modal-info-factura.component.css'
})
export class ModalInfoFacturaComponent implements OnChanges {

  @Input() paymentSeleccionado: any | null = null;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  facturaForm!: FormGroup;
  title!: string;
  factura!: Facturacion;
  isLoading: boolean = false;
  residencia: Residencia | null = null;
  tipoInmueble!: string;
  tipoSeleccionado!: string;
  tasaBCV!: number;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(private fb: FormBuilder,
    private facturaService: FacturacionService,
    private tasaService: TasabcvService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.validarFormulario(); // Inicializar el formulario al cargar
    this.cargarDatosEnFormulario();
    this.getTasadia();
  }

  getTasadia() {
    this.tasaService.getUltimaTasa().subscribe((rate: any) => {
      this.tasaBCV = rate.precio_dia; // Carga automática para ahorrar tiempo
      this.facturaForm.patchValue({ tasaBCV: this.tasaBCV });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentSeleccionado'] && this.paymentSeleccionado) {
      const data = this.paymentSeleccionado;
      console.log(this.paymentSeleccionado)
      if (this.facturaForm && data) {
        this.facturaForm.patchValue({
          // 1. El ID del Propietario (importante para el modelo Facturacion)
          usuarioId: data.usuarioId || '',
          // 2. El ID de la Propiedad (para el array de detalles)
          propiedadId: data._id,
          montoBase: data.montoMensual,
          descripcion: `Mantenimiento mensual ${data.edificio} - ${data.piso}${data.letra}`,
          origen: data.tipo.toUpperCase()//residencia, local, oficina
        });
      }
    }
  }

  patchFormValues() {
    // Si recibes un array o un objeto único, ajusta la lógica:
    const data = Array.isArray(this.paymentSeleccionado)
      ? this.paymentSeleccionado[0]
      : this.paymentSeleccionado;

    if (this.facturaForm && data) {
      this.facturaForm.patchValue({
        montoBase: data.montoMensual, // El monto de Bs. 500 que vimos en la foto
        edificio: data.edificio,
        piso: data.piso,
        letra: data.letra,
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear()
      });
    }
  }


  validarFormulario() {
    this.facturaForm = this.fb.group({
      usuarioId: ['', Validators.required],
      mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      anio: [new Date().getFullYear(), Validators.required],
      ivaPorcentaje: [16, Validators.required],
      aplicaRetencion: [false],
      montoRetencion: [0],
      otrosCargos: [0],
      estado: ['PENDIENTE'],
      // Campos temporales para el detalle que luego mapearemos al array 'detalles'
      propiedadId: ['', Validators.required],
      montoBase: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      origen: [''], // Lo dejamos vacío inicialmente
      tasaBCV: [0, [Validators.required, Validators.min(0)]] // Lo dejamos vacío inicialmente

    });
  }

  cargarDatosEnFormulario() {
    const data = this.paymentSeleccionado;

    if (this.facturaForm && data) {
      this.facturaForm.patchValue({
        usuario: data.usuarioId, // Ahora viene del objeto combinado del padre
        propiedadId: data._id,      // El ID de la residencia (Tajamar o Catuche)
        montoBase: data.montoMensual,
        // unidad: data.tipoSeleccionado,
        descripcion: `Mantenimiento mensual Edif. ${data.edificio} - Piso ${data.piso}`,
        origen: data.tipo //residencia, local, oficina
      });

      console.log('Formulario de Parque Central Listo:', this.facturaForm.value);
    }
  }

  get totalCalculado(): number {
    const base = this.facturaForm.get('montoBase')?.value || 0;
    const iva = this.facturaForm.get('ivaPorcentaje')?.value || 0;
    const otros = this.facturaForm.get('otrosCargos')?.value || 0;
    const retencion = this.facturaForm.get('montoRetencion')?.value || 0;

    const montoIva = base * (iva / 100);
    return (base + montoIva + otros) - retencion;
  }

  handleSubmit() {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const val = this.facturaForm.value;

    const montoBase = Number(val.montoBase) || 0;
    const porc = Number(val.ivaPorcentaje) || 0;

    // Mapeo al modelo Facturacion 
    const payload: Facturacion = {
      usuario: val.usuarioId,
      mes: val.mes,
      anio: val.anio,
      ivaPorcentaje: val.ivaPorcentaje,
      aplicaRetencion: val.aplicaRetencion,
      montoRetencion: val.montoRetencion,
      otrosCargos: val.otrosCargos,
      estado: val.estado,
      tasaBCV: val.tasaBCV,
      detalles: [{
        origen: val.origen,
        propiedadId: val.propiedadId,
        montoBase: val.montoBase,
        descripcion: val.descripcion,
        ivaPorcentaje: val.ivaPorcentaje,
        montoIva: (montoBase * (porc / 100)) 
      }]
    };

    // console.log('Enviando factura a Parque Central:', payload);

    // 2. Llamamos al servicio (asumiendo que se llama facturaService)
    this.facturaService.facturacionIndividual(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        
        // Creamos una URL segura para Angular
        const safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        // Aquí puedes redirigir o mostrar un mensaje de éxito
        Swal.fire({
          title: '¡Factura Generada!',
          html: `
            <iframe src="${fileURL}" width="100%" height="500px" style="border: none;"></iframe>
            <div class="mt-3">La factura se ha guardado correctamente.</div>
        `,
          width: '80%',
          confirmButtonText: 'Cerrar y Finalizar',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false
        }).then(() => {
          // Limpiamos la memoria del navegador al cerrar
          // Limpieza y reset
          URL.revokeObjectURL(fileURL);
          // Guardamos los valores que NO queremos perder
  const { usuarioId, anio, tasaBCV, ivaPorcentaje, propiedadId, origen } = this.facturaForm.value;
  const mesActual = Number(this.facturaForm.get('mes')?.value) || 0;
const proximoMes = mesActual < 12 ? mesActual + 1 : 1;
          // Reseteamos el formulario pero REINYECTAMOS los valores fijos
          this.facturaForm.reset({
            usuarioId,
            anio,
            tasaBCV,
            ivaPorcentaje,
            propiedadId,
            origen,
            mes: proximoMes, 
            montoRetencion: 0,
            otrosCargos: 0
          });
          
          // Aseguramos que las validaciones visuales de error se quiten
          this.facturaForm.markAsPristine();
          this.facturaForm.markAsUntouched();

          this.refreshProjectList.emit();
        });

      },
      error: (err) => {
        this.isLoading = false; // <--- CRÍTICO: Desbloquea el botón si falla la red
        console.error('Error al generar la factura', err);
        Swal.fire('Error', 'No se pudo conectar con el servidor para generar el PDF', 'error');
      }
    });
  }

  onClose() {
    this.facturaForm.reset();
    this.closeModal.emit();
    // this.ngOnInit();

  }
}

