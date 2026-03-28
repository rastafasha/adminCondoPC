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

@Component({
  selector: 'app-payments',
  imports:[CommonModule, FormsModule, 
    RouterLink,
    // ImagenPipe, 
    // PieChart2Component, BarChartComponent,
    LoadingComponent,
    NgxPaginationModule, 
    BackButtnComponent
   ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  title = 'Pagos';

  payments!: Payment[];
  error!: string;
  p: number = 1;
  count: number = 8;
  isLoading!:boolean

  public user:any;
  query: string = '';

  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private userService: UserService,
    private http: HttpClient
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
    this.paymentService.getPayments().subscribe((res: any) => {
      this.payments = res;
      this.isLoading = false;
      console.log(this.payments);
    });
  }
  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
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

  cambiarStatus(data:any){
    const VALUE = data.status;
    console.log(VALUE);
    
    this.paymentService.updatePaymentStatus(data).subscribe(
      resp =>{

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
