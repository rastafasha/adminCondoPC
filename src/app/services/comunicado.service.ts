import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Comunicado } from '../models/comunicado';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comunicados`;
comunicado!: Comunicado
  constructor() { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  // Crear un nuevo comunicado
  crearComunicado(comunicado: Comunicado) {
    const url = `${this.apiUrl}/enviar-global`;
    return this.http.post(url, comunicado, this.headers);
  }

  // Opcional: Obtener historial si lo necesitas luego
  listarComunicados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerMisComunicados(pagina: number = 1) {
    const url = `${this.apiUrl}/mis-comunicados?page=${pagina}`;
    // Definimos la interfaz de la respuesta aquí:
    // return this.http.get<{ ok: boolean, comunicados: Comunicado[], proximo: number | null }>(url, this.headers);
    return this.http.get<any>(url,  this.headers); 
  }


  
}
