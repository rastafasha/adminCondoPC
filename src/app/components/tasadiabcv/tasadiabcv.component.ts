import { Component } from '@angular/core';
import { TasabcvService } from '../../services/tasabcv.service';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../shared/loading/loading.component";

@Component({
  selector: 'app-tasadiabcv',
  imports: [CommonModule, RouterLink, NgIf, LoadingComponent],
  templateUrl: './tasadiabcv.component.html',
  styleUrls: ['./tasadiabcv.component.css']
})
export class TasadiabcvComponent {

  isLoading:boolean = false;
  isProfile:boolean = false;
  precio_dia!:number;
  precio_fecha!:Date;
  user:any;

  constructor(
    private tasaBcvService: TasabcvService,
  ) {
  }
  ngOnInit() {
    this.getTasaDBcvdelDia();
    // console.log(this.user);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
  }
  getTasaDBcvdelDia() {
    this.isLoading = true;
    this.tasaBcvService.getTasas().subscribe((resp:any)=>{
      this.precio_dia = resp[0].precio_dia
      this.precio_fecha = resp[0].createdAt
      this.isLoading = false;
      // console.log(resp);
    })
  }
}
