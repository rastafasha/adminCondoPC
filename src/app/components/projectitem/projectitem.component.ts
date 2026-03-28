import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Payment } from '../../models/payment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-projectitem',
  imports:[CommonModule,  NgxPaginationModule,
    ReactiveFormsModule, FormsModule
  ],
  templateUrl: './projectitem.component.html',
  styleUrls: ['./projectitem.component.css']
})
export class ProjectitemComponent implements OnInit {

  @Input() payment!: Payment;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Payment>();
  @Output() onEditProject = new EventEmitter<Payment>();
  @Output() selectedPayment!: Payment;

 
  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.payment._id);
  }

  editProject() {
    this.onEdit.emit(this.payment._id);
  }

  deleteProject() {
    this.onDelete.emit(this.payment);

  }

  openEditModal(payment: Payment): void {
    this.onEditProject.emit(payment);
  }

  openPaymentsModal(payment: Payment): void {
    this.selectedPayment = payment;
    // console.log(project);
  }
}
