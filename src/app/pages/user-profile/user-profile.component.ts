import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { Residencia } from '../../models/residencia';
import { Local } from '../../models/local';
import { Oficina } from '../../models/oficina';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Facturacion } from '../../models/facturacion';
import { ModalInfoFacturaComponent } from '../../components/modal-info-factura/modal-info-factura.component';
import { FacturacionService } from '../../services/facturacion.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalFacturaDetalleComponent } from '../../components/modal-factura-detalle/modal-factura-detalle.component';
import { ResidenciaService } from '../../services/residencia.service';
import { LocalService } from '../../services/local.service';
import { OficinaService } from '../../services/oficina.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterLink, ImagenPipe, BackButtnComponent,
    LoadingComponent, ModalInfoFacturaComponent, NgxPaginationModule, ModalFacturaDetalleComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  title = "Detalles de la cuenta";
  user!: User;
  profile!: Profile | null;
  error!: string;
  uid: any;
  local?: Local[];
  oficina?: Oficina[];
  residencia?: Residencia[];
  usuario?: User;
  isLoading: boolean = false;
  facturaSeleccionado!: Facturacion | null;

  rolesSelected!: number;
  selectedPayment!: Facturacion | null;
  paymentSeleccionado!: any | null;
  tipoSeleccionado: string = '';
  unidadSeleccionada: any = null;
  facturas!: Facturacion[]

  p: number = 1;
  count: number = 4;

  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;
  hasProfile: boolean = true;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private facturacionService: FacturacionService,
    private residenciaService: ResidenciaService,
    private localService: LocalService,
    private oficinaService: OficinaService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.usuario = userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.closeMenu();
    this.activatedRoute.params.subscribe(({ id }) => this.getUserRemoto(id));
    

  }

  closeMenu() {
    var menuLateral = document.getElementsByClassName("sidebar");
    for (var i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");

    }
  }

  getUserRemoto(id: any) {
    this.userService.getUserById(id).subscribe(
      res => {
        this.user = res;
        // console.log(this.usuario);
        this.activatedRoute.params.subscribe(({ id }) => this.getProfile(id));
        this.activatedRoute.params.subscribe(({ id }) => this.getFacturasUsuario(id));
      }
    );

  }
  getProfile(id: string) {
    this.isLoading = true;
    this.hasProfile = true;
    this.profileService.getByUser(id).subscribe({
      next: (res: any) => {
        this.profile = res;
        this.local = Array.isArray(res.local) ? res.local : [res.local];
        this.oficina = Array.isArray(res.oficina) ? res.oficina : [res.oficina];
        this.residencia = Array.isArray(res.residencia) ? res.residencia : [res.residencia];
        this.usuario = res.usuario;
        this.hasProfile = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Profile not found or error:', err);
        this.profile = null;
        this.hasProfile = false;
        this.isLoading = false;
        Swal.fire('Aviso', 'El usuario no tiene perfil asignado (404) o error al cargar.', 'info');
      }
    });
  }

  getFacturasUsuario(id: string) {
    this.facturacionService.obtenerFacturasPorUsuario(id).subscribe((resp: any) => {
      this.facturas = resp;
      console.log(this.facturas)
    })
  }

  openEditModal(unidad: any, tipo: string): void {
    this.paymentSeleccionado = {
      ...unidad,
      tipo: this.tipoSeleccionado = tipo,
      usuarioId: this.usuario?.uid // "69c864171a472a6c0ff761b8"
    };

  }

  onCloseModal(): void {
    this.paymentSeleccionado = null;
    this.ngOnInit();
  }

  openViewModalFactura(factura: Facturacion): void {
    this.facturaSeleccionado = factura;
  }
  onCloseModalFactura(): void {
    this.facturaSeleccionado = null;
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

 
  eliminarPropiedad(unidad: any, tipo: string) {
  this.tipoSeleccionado = tipo;
  console.log('Datos de la unidad:', unidad);
  const idADeliminar = unidad._id;

  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás recuperar este registro!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, ¡borrar!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Definimos qué servicio usar según el tipo
      let servicio;
      if (tipo === 'residencia') servicio = this.residenciaService.deleteResidencia(idADeliminar);
      if (tipo === 'oficina') servicio = this.oficinaService.deleteOficina(idADeliminar);
      if (tipo === 'local') servicio = this.localService.deleteLocal(idADeliminar);

      // Ejecutamos la eliminación
      if (servicio) {
        servicio.subscribe({
          next: () => {
            Swal.fire('¡Borrado!', 'El registro ha sido eliminado.', 'success');
            this.ngOnInit(); // O tu método para refrescar la lista
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
          }
        });
      }
    }
  });
}


}
