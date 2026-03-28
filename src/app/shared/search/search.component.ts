import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BusquedasService } from '../../services/busqueda.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  ServerUrl = environment.apiUrl;
  usuarios:any;
  private http!: HttpClient;

  query:string ='';
    searchForm!:FormGroup;

  constructor(
    private userService: UserService,
    private busquedasService: BusquedasService,
  ) {
  }

  ngOnInit(): void {
  }

 

  public PageSize(): void {
    // this.getDirectories();
    this.query = '';
  }


   search() {
      if(!this.query|| this.query === null){
      this.ngOnInit();
    }else{
      return this.busquedasService.searchGlobal(this.query).subscribe(
        (resp:any) => {
          // this.usuarios = resp.usuarios;
          // this.projects = resp.projects;
          // this.projecttypes = resp.projecttypes;
      
          console.log(resp);
        }
      )
    }
    
  }


}
