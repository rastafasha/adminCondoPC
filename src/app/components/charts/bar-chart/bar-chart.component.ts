import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PaymentService } from '../../../services/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule, FormsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  public chart!: Chart;
  monthlyData: any[] = [];
  selectedYear: number;
  selectedMonth: number = 1; // Default Enero (1-based)
  years: number[] = [];
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  isLoading = false;

  // Crea una variable para el reporte
  reportData: any = null;

  constructor(private paymentService: PaymentService) {
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.generateYears();
    this.loadData();
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear - 4; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  loadData(): void {
  this.isLoading = true;
  this.paymentService.getMontlyReport(this.selectedMonth, this.selectedYear).subscribe({
    next: (resp: any) => {
      // Validamos que existan datos en alguna de las dos partes del reporte
      if (resp.ok && (resp.recaudado || resp.pendiente)) {
        this.reportData = resp; 
      } else {
        this.reportData = null;
      }
      
      this.createChart(); // Esto dibujará las barras con 610 y 1198
      this.isLoading = false;
    },
    error: (error) => {
      console.error("Error en reporte:", error);
      this.reportData = null;
      this.isLoading = false;
    }
  });
}

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadData();
  }

  onMonthChange(month: number): void {
    this.selectedMonth = month;
    this.loadData();
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    // Verificamos si existe data de recaudación o morosidad
    if (!this.reportData || (!this.reportData.recaudado && !this.reportData.pendiente)) {
      return;
    }
    
    setTimeout(() => {
      const el = document.getElementById('barChart') as HTMLCanvasElement;
      if (!el) return;

      const rec = this.reportData.recaudado;
      const pen = this.reportData.pendiente;

      this.chart = new Chart(el, {
        type: 'bar',
        data: {
          labels: ['Residencias', 'IVA', 'Otros', 'TOTAL RECAUDADO', 'POR COBRAR'],
          datasets: [{
            label: 'Montos en Bs.',
            data: [
              this.reportData.recaudado?.totalResidencias || 0, // 500
              this.reportData.recaudado?.totalIVA || 0,         // 80
              this.reportData.recaudado?.totalOtros || 0,       // 30
              this.reportData.recaudado?.recaudacionNeta || 0,  // 610 (Total Pagado)
              this.reportData.pendiente?.montoPendiente || 0    // 1198 (Por Cobrar)
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)', // Residencias
              'rgba(153, 102, 255, 0.6)', // IVA
              'rgba(255, 206, 86, 0.6)',  // Otros
              'rgba(54, 162, 235, 0.8)',  // Total Recaudado (Azul)
              'rgba(255, 99, 132, 0.8)'   // Por Cobrar (Rojo)
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false } // Ocultamos leyenda para que se vea más limpio
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (value) => 'Bs ' + value } // Formato moneda
            }
          }
        }
      });
    }, 50);
  }

}
