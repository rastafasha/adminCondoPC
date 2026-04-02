import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { RouterLink } from '@angular/router';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { ModalinfoTiposPagoComponent } from '../../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';


@Component({
  selector: 'app-configuraciones',
  imports:[CommonModule, RouterLink, BackButtnComponent, ModalinfoTiposPagoComponent],
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit, DoCheck {
  @Input() displaycomponent: string = 'block';
  title = "Configuraciones";
  error!: string;

  user!: User;
   info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Adinistrar El ROL de los usuarios Administrativos</li>
            <li>Adinistrar Los Metodos de pago Usados</li>
            <li>Actualizar La tasa del Dólar del Banco Central de Venezuela</li>
          </ul>`;

  constructor(
    private location: Location,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.closeMenu();
    window.scrollTo(0,0);
  }

  ngDoCheck(): void {
    this.user = this.userService.usuario;
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }


}
