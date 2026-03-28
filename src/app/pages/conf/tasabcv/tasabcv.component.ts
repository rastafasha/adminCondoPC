import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { Tasabcv } from '../../../models/tasabcba';
import { TasabcvService } from '../../../services/tasabcv.service';
import { UserService } from '../../../services/user.service';
import { CommonModule, NgFor } from '@angular/common';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasabcv',
  imports: [CommonModule, BackButtnComponent, LoadingComponent,
    FormsModule, NgFor
  ],
  templateUrl: './tasabcv.component.html',
  styleUrls: ['./tasabcv.component.css'],
})
export class TasabcvComponent {
  @Input() displaycomponent: string = 'block';
  public tasasbcv!: Tasabcv[];
  error!: string;
  uploadError!: string;
  precio_dia!: number;
  tipoSeleccionado: boolean = false;
  title = 'Tasa de cambio BCV';
  isLoading: boolean = false;

  constructor(
    private tasaBcvService: TasabcvService,
    private accountService: UserService
  ) { }

  ngOnInit(): void {
    this.getTiposdePago();
    this.accountService.closeMenu();
  }


  getTiposdePago() {
    this.isLoading = true;
    this.tasaBcvService.getTasas().subscribe((resp: any) => {
      this.tasasbcv = resp;
      this.isLoading = false;
    });
  }


  save() {
    const data = {
      precio_dia: this.precio_dia,
    };
    this.tasaBcvService
      .createTasaBcv(data)
      .subscribe((resp: any) => {
        // console.log(resp);
        this.precio_dia;
        // this.tipo ='';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getTiposdePago();
      });
  }

  deleteTipoPago(tiposdepago: any) {
    this.tasaBcvService
      .deleteTasaBcv(tiposdepago.id)
      .subscribe((resp: any) => {
        this.getTiposdePago();
      });
  }
}
