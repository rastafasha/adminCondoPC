import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagenPipe } from 'src/app/pipes/imagen.pipe';
import { StudentService } from 'src/app/services/student-service.service';
import { ParentService } from 'src/app/services/parent-service.service';
import { Parent } from 'src/app/models/parents';
import { Student } from 'src/app/models/student';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  title = "Detalle Pago";
  payment: Payment;
  error: string;
  student_id:number;
  parent_id:number;
  parent:Parent;
  student:Student;
  isLoading:boolean=false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private studentService: StudentService,
    private parentService: ParentService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.activatedRoute.params.subscribe( ({id}) => this.getPagoById(id));
  }
  getUser(id:number){
    this.paymentService.getPagosbyUser(id).subscribe(
      res =>{
        this.payment = res;
        error => this.error = error
        // console.log(this.payment);
      }
    );
  }

  getPagoById(id:number){
    this.isLoading= true;
    this.paymentService.getPagoById(id).subscribe(
      res=>{
        this.payment = res;
        // console.log(this.payment);
        this.parent_id = res.parent_id;
        this.student_id = res.student_id;
        this.isLoading = false;
        this.getParent();
        this.getStudent();
      }

    )
  }
  getParent(){
    this.parentService.getUserById(this.parent_id).subscribe((resp:any)=>{
      console.log(resp);
      this.parent = resp.representante;

    })
  }
  getStudent(){
    this.studentService.getUserById(this.student_id).subscribe((resp:any)=>{
      console.log(resp);
      this.student = resp.student;
    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  cambiarStatus(data:any){
    const VALUE = data.status;
    console.log(VALUE);
    
    this.paymentService.updateStatus(data, data.id).subscribe(
      resp =>{

        console.log(resp);
        Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Actualizado',
                      showConfirmButton: false,
                      timer: 1500,
                    });
        this.ngOnInit();
      }
    )
  }

}
