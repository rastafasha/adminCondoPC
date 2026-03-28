import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Payment } from '../../../models/payment';
import { User } from '../../../models/user';
import { BusquedasService } from '../../../services/busqueda.service';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { ProjectitemComponent } from '../../../components/projectitem/projectitem.component';

@Component({
  selector: 'app-project-list',
  imports:[CommonModule, BackButtnComponent, NgxPaginationModule,
    ReactiveFormsModule, FormsModule, LoadingComponent, 
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';

  title: string = 'Pagos';
  projects!: Payment[];
  query: string = '';
  p: number = 1;
  count: number = 5;
  loading: boolean = false;
  selectedProject!: Payment | null;
  usuario: any;
  usuario_id: any;

  constructor(
    private paymentService: PaymentService,
    private busquedasService: BusquedasService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,

  ) {
    let USER = localStorage.getItem('user');
    this.usuario = JSON.parse(USER ? USER : '');
  }



  ngOnInit(): void {
    // this.getCategories();
    this.activatedRoute.params.subscribe((resp: any) => {
      this.usuario_id = resp.id;
      // this.cargarPresupuesto();
      if (this.usuario_id) {
        this.getProjectsByUser(this.usuario_id);
      }
    })


    if (this.usuario.role === 'PARTNER') {
      // this.usuario.uid = this.usuario_id;
      this.getProjectsByUser(this.usuario.uid);

    } else {
      this.getProjects();
    }

  }

  getProjects() {
    this.loading = true;
    this.paymentService.getPayments().subscribe((resp: any) => {
      this.projects = resp;
      this.loading = false;
    })
  }

  getProjectsByUser(id: string) {
    this.loading = true;
    this.paymentService.getByUser(id).subscribe((resp: any) => {
      this.projects = resp;
      this.loading = false;
    })
  }

  // getCategories() {
  //   this.categoriaService.getCategories().subscribe((resp: any) => {
  //     this.categories = resp;
  //   })

  // }

  onEditProject(payment: Payment) {
    this.selectedProject = payment;
  }

  onDeleteProject(payment: Payment) {
    this.selectedProject = payment;

    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.deletePayment(payment._id).subscribe((resp: any) => {
          this.getProjects();
        })
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }

  search() {
    // Case 1: Only selectedType (category) is provided - use category filter
    // if (!this.query || this.query === null || this.query === '') {
    //   if (this.selectedType) {
    //     return this.paymentService.getProjectsByCategory(this.selectedType).subscribe(
    //       (resp: any) => {
    //         this.projects = resp;
    //         this.paymentService.emitFilteredProjects(resp);
    //       }
    //     );
    //   } else {
    //     // No query and no category - reload all projects
    //     this.ngOnInit();
    //   }
    // } 
    // Case 2: Query is provided (with or without category)
    // else {
    //   return this.busquedasService.searchGlobal(this.query).subscribe(
    //     (resp: any) => {
    //       let filteredProjects = resp.projects;
    //       if (this.selectedType) {
    //         filteredProjects = filteredProjects.filter(
    //           (project: Project) => project.category.nombre === this.selectedType
    //         );
    //       }
    //       this.projects = filteredProjects;
    //       this.paymentService.emitFilteredProjects(filteredProjects);
    //     }
    //   );
    // }
  }

  

  PageSize() {
    this.query = '';
    this.selectedType = '';
    this.ngOnInit();

  }
  openEditModal(): void {
    this.selectedProject = null;
  }

  onCloseModal(): void {
    this.selectedProject = null;
  }

}

