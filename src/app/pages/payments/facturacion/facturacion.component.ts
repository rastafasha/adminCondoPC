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

@Component({
  selector: 'app-facturacion',
  imports: [CommonModule, FormsModule,
    RouterLink,
    // PieChart2Component, BarChartComponent,
    LoadingComponent,
    NgxPaginationModule,
    BackButtnComponent
  ],
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

  constructor(
    private facturacionService: FacturacionService,
    private userService: UserService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    // this.closeMenu();

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


  search() {
    // return this.paymentService.search(this.query).subscribe((res: any) => {
    //   this.payments = res;
    //   if (!this.query) {
    //     this.ngOnInit();
    //   }
    // });
  }

  public PageSize(): void {
    this.getFacturas();
    this.query = '';
  }

}
