import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';


import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { Payment } from 'src/app/models/payment';
import { User } from 'src/app/models/users';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/users.service';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-reportar-pago',
  standalone: true,
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './reportar-pago.component.html',
  styleUrls: ['./reportar-pago.component.css']
})
export class ReportarPagoComponent implements OnInit {

  public PaymentRegisterForm: FormGroup;

  title= 'Realizar un Pago';


  cartItems: any[] = [];
  Item: any[] = [];
  total= 0;

  public usuario;
  visible :boolean = false;

  metodo:string;
  error: string;
  pagoSeleccionado: Payment;
  pagoS: Payment;

  uploadError: boolean;
  imagePath: string;
  paymentSeleccionado:Payment;

  user:User;

  public storage = environment.url_media

  

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private paymentService: PaymentService,
    private usuarioService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
  ) {
    this.user = this.usuarioService.user;
  }


  ngOnInit(): void {
    window.scrollTo(0,0);
    this.visible= false;
    this.getUser();
    this.closeCart();
    this.validarFormulario();
    this.total = this.getTotal();

  }

  getUser(): void {
    this.usuario = JSON.parse(localStorage.getItem('user'));
  }


  getTotal():number{
    let total =  0;
    this.cartItems.forEach(item => {
      total += item.quantity * item.productPrice;
    });
    return +total.toFixed(2);
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  validarFormulario(){
    this.PaymentRegisterForm = this.fb.group({
      id: [''],
      metodo: ['',Validators.required],
      bank_name: [''],
      monto: ['',Validators.required],
      currency_id: [''],
      referencia: [''],
      email: [''],
      nombre: [''],
      plan_id: [''],
      // status: ['PENDING'],
      // validacion: ['PENDING'],
      metodo_id: ['1'],
      user_id: [''],
      image: [''],
    })
  }



  get image() {
    return this.PaymentRegisterForm.get('image');
  }

  avatarUpload(datos) {
    const data = JSON.parse(datos.response);
    this.PaymentRegisterForm.controls['image'].setValue(data.image);//almaceno el nombre de la imagen
  }


  updateForm(){

    const formData = new FormData();
    formData.append('metodo', this.PaymentRegisterForm.get('metodo').value);
    formData.append('bank_name', this.PaymentRegisterForm.get('bank_name').value);
    formData.append('monto', this.PaymentRegisterForm.get('monto').value);
    formData.append('currency_id', this.PaymentRegisterForm.get('currency_id').value);
    formData.append('referencia', this.PaymentRegisterForm.get('referencia').value);
    formData.append('nombre', this.PaymentRegisterForm.get('nombre').value);
    formData.append('email', this.PaymentRegisterForm.get('email').value);
    formData.append('plan_id', this.PaymentRegisterForm.get('plan_id').value);
    formData.append('metodo_id', '1');
    // formData.append('status', 'PENDING');
    // formData.append('validacion', 'PENDING');
    formData.append('image', this.PaymentRegisterForm.get('image').value);


    //crear
    const data = {
      ...this.PaymentRegisterForm.value,
      user_id: this.usuario.id
    }
    this.paymentService.create(data)
    .subscribe( (resp: any) =>{
      this.router.navigateByUrl(`/dashboard/historial-pagos`);
      this.pagoSeleccionado = resp;
      console.log(this.pagoSeleccionado);
      this.emptyCart();
    })

  }


  closeCart(){
    var cartNotification = document.getElementsByClassName("cart-modal");
      for (var i = 0; i<cartNotification.length; i++) {
        cartNotification[i].classList.remove("cart-modal--active");

      }
  }



  verpaypal(){
    var verPaypalpay = document.getElementsByClassName("vibiblepayp");
      for (var i = 0; i<verPaypalpay.length; i++) {
        verPaypalpay[i].classList.toggle("vibiblepaypblok");

      }
  }
  hidepaypal(){
    var verPaypalpay = document.getElementsByClassName("vibiblepayp");
      for (var i = 0; i<verPaypalpay.length; i++) {
        verPaypalpay[i].classList.remove("vibiblepaypblok");

      }
  }



  emptyCart():void{
    this.cartItems = [];
    this.total = 0;
  }


}
