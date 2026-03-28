import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';
import { User } from 'src/app/models/users';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-payment-edit',
  
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit {

  title : string;

  public paymentForm: FormGroup;
  public payment: Payment;
  public usuario: User;
  payments: Payment;
  error: string;

  idcurrency:any;
  user: User;

  status:Payment;

  paymentSeleccionado: Payment;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private paymentsService: PaymentService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.activatedRoute.params.subscribe( ({id}) => this.cargarPayment(id));
    this.validarFormulario();
  }

  validarFormulario(){
    this.paymentForm = this.fb.group({
      status: ['',Validators.required],
      validacion: ['',Validators.required],
      user_id: [''],
    })
  }

  cargarPayment(id: any){


    if (id !== null && id !== undefined) {
      this.title = 'Verificando Pago';
      this.paymentsService.getPagoById(id).subscribe(
        res => {
          this.paymentForm.patchValue({
            id: res.id,
            status: res.status,
            validacion: res.validacion,
          });
          this.paymentSeleccionado = res;
          console.log(this.paymentSeleccionado);
        }
      );
    } else {
      this.title = 'Creando Pago';
    }

  }

  updateBlog(){

    const {status, validacion } = this.paymentForm.value;

    if(this.paymentSeleccionado){
      //actualizar
      const data = {
        ...this.paymentForm.value,
        user_id: this.paymentSeleccionado.user_id,
        // payment: this.paymentSeleccionado,
        id: this.paymentSeleccionado.id
      }
      this.paymentsService.update(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', ` actualizado correctamente`, 'success');
          console.log(this.paymentSeleccionado);
          this.router.navigateByUrl(`/dashboard/payments`);
        });

    }else{
      return;
    }

  }

  // cambiarPayment(){debugger
  //   this.paymentsService.update(this.payment).subscribe(
  //     resp =>{ console.log(resp);
  //       Swal.fire('Actualizado', `actualizado correctamente`, 'success');

  //     }
  //   )
  // }

  openAproved(){
    const Toasttest = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // didOpen: (toast) => {
      //   toast.addEventListener('mouseenter', Swal.stopTimer)
      //   toast.addEventListener('mouseleave', Swal.resumeTimer)
      // }
    })

    Toasttest.fire({
      icon: 'success',
      title: 'Pago Aprobado!'
    })
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
