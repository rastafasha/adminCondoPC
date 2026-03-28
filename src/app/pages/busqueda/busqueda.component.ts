import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user';
import { BusquedasService } from '../../services/busqueda.service';
import { Local } from '../../models/local';
import { Oficina } from '../../models/oficina';
import { Residencia } from '../../models/residencia';
import { Facturacion } from '../../models/facturacion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda',
  imports:[CommonModule, NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  

  locales!: Local;
  oficinas!: Oficina;
  residencias!: Residencia;
  usuarios!: User[];
  facturaciones!: Facturacion;

  query:string ='';

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private location: Location,
     ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({termino}) => {
        this.busquedaGlobal(termino);
      }
    )
  }


  busquedaGlobal(termino: string){
    this.busquedasService.searchGlobal(termino).subscribe(
      (resp:any) => {
        this.locales = resp.locales;
        this.oficinas = resp.oficinas;
        this.residencias = resp.residencias;
        this.usuarios = resp.usuarios;
        this.facturaciones = resp.facturaciones;
      }
    )
  }

  // search() {

  //   if(!this.query|| this.query === null){
  //     this.ngOnInit();
  //   }else{
  //     return this.busquedasService.searchGlobal(this.query).subscribe(
  //       (resp:any) => {
  //         this.locales = resp.locales;
  //       this.oficinas = resp.oficinas;
  //       this.residencias = resp.residencias;
  //       this.usuarios = resp.usuarios;
  //       this.facturaciones = resp.facturaciones;
      
  //         console.log(resp);
  //       }
  //     )
  //   }   
  // }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
