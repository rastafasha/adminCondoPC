import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-clientitem',
  imports:[CommonModule,  NgxPaginationModule,
    ReactiveFormsModule, FormsModule,
  ],
  templateUrl: './clientitem.component.html',
  styleUrls: ['./clientitem.component.css']
})
export class ClientitemComponent implements OnInit {

  @Input() cliente!: User;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<User>();
  @Output() onEditCliente = new EventEmitter<User>();



  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.cliente.uid);
  }

  editCliente() {
    this.onEdit.emit(this.cliente.uid);
  }

  deleteCliente() {
    this.onDelete.emit(this.cliente);

  }

  openEditModal(cliente: User): void {
    this.onEditCliente.emit(cliente);
  }

  

}
