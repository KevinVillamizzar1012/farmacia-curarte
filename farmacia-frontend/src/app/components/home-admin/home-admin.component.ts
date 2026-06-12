import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReporteService } from '../../services/reporte.service';
import { ProductoService } from '../../services/producto.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Producto } from '../../models/producto.model';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importamos los componentes reutilizables
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

Chart.register(...registerables);

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    BaseChartDirective,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {
  // Eliminamos username, rol, dropdownOpen, y los métodos toggleDropdown/logout
  // porque ahora los maneja TopBarComponent

  private auth = inject(AuthService);
  private router = inject(Router);
  private reporteService = inject(ReporteService);
  private productoService = inject(ProductoService);

  // Métricas
  ventasHoy = 0;
  stockBajoCount = 0;
  proximosVencerCount = 0;
  productosMasVendidos: any[] = [];

  // Listas detalle
  stockBajoLista: Producto[] = [];
  proximosVencerLista: Producto[] = [];

  // Estado de flip cards
  flipStock = false;
  flipVencimiento = false;

  // Últimas ventas y gráfico
  ultimasVentas: any[] = [];
  chartLabels: string[] = [];
  chartData: any = { datasets: [] };
  chartOptions: any = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Ventas (COP)' } } }
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Búsqueda rápida (sugerencias)
  terminoBusqueda = '';
  suggestions: any[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  ngOnInit() {
    this.cargarMetricas();
    this.cargarUltimasVentas();
    this.cargarVentasPorDia();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.productoService.consultarProductos({ nombre: term }) : [])
    ).subscribe(data => {
      this.suggestions = data;
      this.showSuggestions = data.length > 0;
    });
  }

  cargarMetricas() {
    this.reporteService.obtenerVentasHoy().subscribe(total => this.ventasHoy = total);
    this.productoService.getStockBajo().subscribe(data => {
      this.stockBajoLista = data;
      this.stockBajoCount = data.length;
    });
    this.productoService.getProximosVencer(30).subscribe(data => {
      this.proximosVencerLista = data;
      this.proximosVencerCount = data.length;
    });
    this.reporteService.obtenerProductosMasVendidos().subscribe(data => {
      this.productosMasVendidos = data;
    });
  }

  cargarUltimasVentas() {
    this.reporteService.obtenerUltimasVentas(5).subscribe(data => this.ultimasVentas = data);
  }

  cargarVentasPorDia() {
    this.reporteService.obtenerVentasPorDia().subscribe(res => {
      const ventasPorDia = res.ventasPorDia;
      this.chartLabels = ventasPorDia.map((d: any) => d.fecha);
      const totales = ventasPorDia.map((d: any) => d.total);
      this.chartData = {
        labels: this.chartLabels,
        datasets: [{ label: 'Ventas (COP)', data: totales, backgroundColor: '#0FB7CF' }]
      };
      if (this.chart) this.chart.update();
    });
  }

  // Exportaciones
  exportarExcel() {
    const metricas = [
      ['Métrica', 'Valor'],
      ['Ventas de hoy', this.ventasHoy],
      ['Stock bajo', this.stockBajoCount],
      ['Próximos a vencer', this.proximosVencerCount]
    ];
    const ultimasVentasSheet = this.ultimasVentas.map(v => [v.id, v.fecha, v.total, v.usuario]);
    const topProductosSheet = this.productosMasVendidos.map(p => [p.nombre, p.cantidadVendida]);

    const wb = XLSX.utils.book_new();
    const wsMetricas = XLSX.utils.aoa_to_sheet(metricas);
    const wsVentas = XLSX.utils.aoa_to_sheet([['ID', 'Fecha', 'Total', 'Usuario'], ...ultimasVentasSheet]);
    const wsTop = XLSX.utils.aoa_to_sheet([['Producto', 'Cantidad'], ...topProductosSheet]);

    XLSX.utils.book_append_sheet(wb, wsMetricas, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsVentas, 'Últimas Ventas');
    XLSX.utils.book_append_sheet(wb, wsTop, 'Top Productos');
    XLSX.writeFile(wb, `reporte_admin_${new Date().toISOString().slice(0,19)}.xlsx`);
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Administración', 14, 10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 20);
    doc.text(`Ventas de hoy: $${this.ventasHoy}`, 14, 30);
    doc.text(`Stock bajo: ${this.stockBajoCount} productos`, 14, 37);
    doc.text(`Próximos a vencer: ${this.proximosVencerCount} productos`, 14, 44);

    autoTable(doc, {
      startY: 55,
      head: [['ID', 'Fecha', 'Total', 'Usuario']],
      body: this.ultimasVentas.map(v => [v.id, v.fecha, `$${v.total}`, v.usuario]),
      theme: 'striped'
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Producto', 'Cantidad vendida']],
      body: this.productosMasVendidos.map(p => [p.nombre, p.cantidadVendida]),
      theme: 'striped'
    });

    doc.save('reporte_admin.pdf');
  }

  // Flip cards
  toggleFlipStock() { this.flipStock = !this.flipStock; }
  toggleFlipVencimiento() { this.flipVencimiento = !this.flipVencimiento; }
  toggleFlip(prod: any) { prod.flipped = !prod.flipped; }

  // Búsqueda rápida
  onSearchInput() { this.searchTerms.next(this.terminoBusqueda); }
  selectSuggestion(prod: any) {
    this.terminoBusqueda = prod.nombre;
    this.showSuggestions = false;
    this.buscar();
  }
  closeSuggestions() { setTimeout(() => this.showSuggestions = false, 200); }
  buscar() {
    if (this.terminoBusqueda.trim()) this.router.navigate(['/catalogo'], { queryParams: { nombre: this.terminoBusqueda } });
  }

  irACatalogo(id: number) { this.router.navigate(['/catalogo'], { queryParams: { id: id.toString() } }); }
}