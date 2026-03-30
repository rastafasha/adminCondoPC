import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart2',
   imports:[CommonModule,   ],
  templateUrl: './pie-chart2.component.html',
  styleUrls: ['./pie-chart2.component.css']
})
export class PieChart2Component implements OnChanges {
  public chart!: Chart;
  @Input() stats!: any; // Cambiamos 'payments' por 'stats' que trae {labels, data}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stats'] && this.stats) {
      this.updateChart();
    }
  }

  

  updateChart() {
    const chartData = {
      labels: this.stats.labels, // ['Pagado', 'Pendiente', 'Anulado']
      datasets: [{
        label: 'Cantidad de Facturas',
        data: this.stats.data,     // [5, 4, 0]
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Pagado
          'rgba(255, 159, 64, 0.6)',  // Pendiente (Naranja)
          'rgba(255, 99, 132, 0.6)'   // Anulado
        ],
        borderWidth: 1
      }]
    };

    if (this.chart) {
      this.chart.data = chartData;
      this.chart.update();
    } else {
      this.chart = new Chart('pieChart', {
        type: 'doughnut', // Mantengo el doughnut que se ve genial
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Estado de Facturación' }
          }
        }
      });
    }
  }

}
