import { Component, Input } from '@angular/core';
import { Facturacion } from '../../../models/facturacion';
import { FacturacionService } from '../../../services/facturacion.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { ModalFacturaDetalleComponent } from "../../../components/modal-factura-detalle/modal-factura-detalle.component";
import { ModalinfoTiposPagoComponent } from '../../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { BusquedasService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-facturacion',
  imports: [CommonModule, FormsModule, ModalinfoTiposPagoComponent,
    // PieChart2Component, BarChartComponent,
    LoadingComponent,
    NgxPaginationModule,
    BackButtnComponent, ModalFacturaDetalleComponent],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent {
  @Input() displaycomponent: string = 'block';
  title = 'Facturación';
  facturas!: Facturacion[];
  error!: string;
  p: number = 1;
  count: number = 8;
  isLoading!: boolean

  public user: any;
  query: string = '';
  facturaSeleccionado!: Facturacion | null;

  estado!: string
  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Ver las Facturas recientes </li>
            <li>Ver a detalle cada factura</li>
            <li>Encontrar facturas por varias opciones</li>
          </ul>`;

  constructor(
    private facturacionService: FacturacionService,
    private userService: UserService,
    private busquedasService: BusquedasService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.userService.closeMenu();

    this.getFacturas();
    window.scrollTo(0, 0);
  }

  getFacturas(): void {
    this.isLoading = true;
    this.facturacionService.getFacturaciones().subscribe((res: any) => {
      this.facturas = res;
      this.isLoading = false;
    });
  }

  search(): void {
    // Case 1: No query - use estado filter or all
    if (!this.query || this.query === null || this.query === '') {
      if (this.estado) {
        this.facturacionService.getByStatus(this.estado).subscribe(
            (resp: any) => {
              this.facturas = resp;
              // this.facturacionService.emitFilteredProjects(resp);
            }
          );
          return;
      } else {
        // No query and no estado - reload all
        this.ngOnInit();
        return;
      }
    }
    // Case 2: Query provided - global search + optional estado filter
    this.busquedasService.buscar('facturaciones',this.query).subscribe(
      (resp: any) => {
        let filteredProjects = resp;
        if (this.estado) {
          filteredProjects = filteredProjects.filter(
            (factura: Facturacion) => factura.estado === this.estado
          );
        }
        this.facturas = filteredProjects;
        // this.facturacionService.emitFilteredProjects(filteredProjects);
      }
    );
  }

  public PageSize(): void {
    this.getFacturas();
    this.query = '';
  }

  openViewModal(factura: Facturacion): void {
    this.facturaSeleccionado = factura;
  }

  onCloseModal(): void {
    this.facturaSeleccionado = null;
  }
}

