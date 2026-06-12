import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReporteService } from '../../services/reporte.service';
import { Venta } from '../../models/venta.model';
import { Producto } from '../../models/producto.model';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent, BottomBarComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Eliminamos username, rol, dropdownOpen (los maneja TopBarComponent)

  fechaInicio = '';
  fechaFin = '';
  ventas: Venta[] = [];
  cargandoVentas = false;

  stockBajo: Producto[] = [];
  proximosVencer: Producto[] = [];

  ngOnInit(): void {
    this.cargarStockBajo();
    this.cargarProximosVencer();
  }

  cargarVentas() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Seleccione ambas fechas');
      return;
    }
    this.cargandoVentas = true;
    this.reporteService.obtenerVentasPorFecha(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.ventas = data;
        this.cargandoVentas = false;
      },
      error: () => {
        alert('Error al cargar ventas');
        this.cargandoVentas = false;
      }
    });
  }

  cargarStockBajo() {
    this.reporteService.obtenerStockBajo().subscribe(data => this.stockBajo = data);
  }

  cargarProximosVencer() {
    this.reporteService.obtenerProximosVencer(30).subscribe(data => this.proximosVencer = data);
  }

  // ==================== REPORTE DE VENTAS ====================
  exportarVentasExcel() {
    if (this.ventas.length === 0) return alert('No hay datos para exportar');
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';
    const periodo = `${this.fechaInicio} - ${this.fechaFin}`;

    const headerRows = [
      ['Reporte de Ventas - Farmacias Curarte'],
      [`Período: ${periodo}`],
      [`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`],
      []
    ];
    const dataRows = this.ventas.map(v => ({
      ID: v.id,
      Fecha: v.fecha,
      Total: v.total,
      'Usuario ID': v.usuarioId
    }));
    const wsData = [...headerRows, ...dataRows.map(row => [row.ID, row.Fecha, row.Total, row['Usuario ID']])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `ventas_${this.fechaInicio}_a_${this.fechaFin}.xlsx`);
  }

  exportarVentasPDF() {
    if (this.ventas.length === 0) return alert('No hay datos para exportar');
    const doc = new jsPDF();
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';
    const periodo = `${this.fechaInicio} - ${this.fechaFin}`;

    doc.setFontSize(16);
    doc.text('Farmacias Curarte', 14, 15);
    doc.setFontSize(12);
    doc.text('Reporte de Ventas', 14, 25);
    doc.setFontSize(10);
    doc.text(`Período: ${periodo}`, 14, 35);
    doc.text(`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`, 14, 42);
    
    autoTable(doc, {
      head: [['ID', 'Fecha', 'Total', 'Usuario ID']],
      body: this.ventas.map(v => [v.id, v.fecha, `$${v.total}`, v.usuarioId]),
      startY: 50,
      theme: 'striped'
    });
    doc.save(`ventas_${this.fechaInicio}_a_${this.fechaFin}.pdf`);
  }

  // ==================== STOCK BAJO ====================
  exportarStockBajoExcel() {
    if (this.stockBajo.length === 0) return alert('No hay productos con stock bajo');
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';

    const headerRows = [
      ['Reporte de Productos con Stock Bajo - Farmacias Curarte'],
      [`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`],
      []
    ];
    const dataRows = this.stockBajo.map(p => ({
      Nombre: p.nombre,
      Stock: p.stock,
      'Stock Mínimo': p.stockMinimo,
      Categoría: p.categoria
    }));
    const wsData = [...headerRows, ...dataRows.map(row => [row.Nombre, row.Stock, row['Stock Mínimo'], row.Categoría])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock_Bajo');
    XLSX.writeFile(wb, 'stock_bajo.xlsx');
  }

  exportarStockBajoPDF() {
    if (this.stockBajo.length === 0) return alert('No hay productos con stock bajo');
    const doc = new jsPDF();
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';

    doc.setFontSize(16);
    doc.text('Farmacias Curarte', 14, 15);
    doc.setFontSize(12);
    doc.text('Productos con Stock Bajo', 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`, 14, 35);

    autoTable(doc, {
      head: [['Nombre', 'Stock', 'Stock Mínimo', 'Categoría']],
      body: this.stockBajo.map(p => [p.nombre, p.stock, p.stockMinimo, p.categoria]),
      startY: 45,
      theme: 'striped'
    });
    doc.save('stock_bajo.pdf');
  }

  // ==================== PRÓXIMOS A VENCER ====================
  exportarProximosVencerExcel() {
    if (this.proximosVencer.length === 0) return alert('No hay productos próximos a vencer');
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';

    const headerRows = [
      ['Reporte de Productos Próximos a Vencer (30 días) - Farmacias Curarte'],
      [`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`],
      []
    ];
    const dataRows = this.proximosVencer.map(p => ({
      Nombre: p.nombre,
      'Fecha Vencimiento': p.fechaVencimiento,
      Stock: p.stock,
      Categoría: p.categoria
    }));
    const wsData = [...headerRows, ...dataRows.map(row => [row.Nombre, row['Fecha Vencimiento'], row.Stock, row.Categoría])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Proximos_Vencer');
    XLSX.writeFile(wb, 'proximos_vencer.xlsx');
  }

  exportarProximosVencerPDF() {
    if (this.proximosVencer.length === 0) return alert('No hay productos próximos a vencer');
    const doc = new jsPDF();
    const now = new Date();
    const fechaConsulta = now.toLocaleString();
    const usuario = localStorage.getItem('username') || '';

    doc.setFontSize(16);
    doc.text('Farmacias Curarte', 14, 15);
    doc.setFontSize(12);
    doc.text('Productos Próximos a Vencer (30 días)', 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha consulta: ${fechaConsulta} | Usuario: ${usuario}`, 14, 35);

    autoTable(doc, {
      head: [['Nombre', 'Fecha Vencimiento', 'Stock', 'Categoría']],
      body: this.proximosVencer.map(p => [p.nombre, p.fechaVencimiento, p.stock, p.categoria]),
      startY: 45,
      theme: 'striped'
    });
    doc.save('proximos_vencer.pdf');
  }

  // Ya no necesitamos toggleDropdown ni logout
}