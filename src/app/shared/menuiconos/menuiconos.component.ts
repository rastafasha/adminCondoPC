import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menuiconos',
  standalone: true,
    imports: [CommonModule, RouterLink],
  templateUrl: './menuiconos.component.html',
  styleUrls: ['./menuiconos.component.css']
})
export class MenuiconosComponent implements OnInit {

  public user!: User;
  public profile!: User;

  error!: string;
  roleid!:number;
  uid!:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.user = this.userService.usuario;
  }


  ngOnInit(): void {
    // this.getUserProfile();
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.uid = this.user.uid;
  }


}
