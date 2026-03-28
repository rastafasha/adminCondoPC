import { Injectable } from '@angular/core';
import { Facturacion } from '../models/facturacion';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  public facturacion!: Facturacion;
  
  
    constructor(private http: HttpClient) { }
  
    get token(): string {
      return localStorage.getItem('token') || '';
    }
  
  
    get headers() {
      return {
        headers: {
          'x-token': this.token
        }
      }
    }

    getFacturaciones() {
        const url = `${baseUrl}/facturacion`;
        return this.http.get<any>(url, this.headers)
          .pipe(
            map((resp: { ok: boolean, facturas: Facturacion }) => resp.facturas)
          )
      }
    
      getFactura(_id: Facturacion) {
        const url = `${baseUrl}/facturacion/${_id}`;
        return this.http.get<any>(url, this.headers)
          .pipe(
            map((resp: { ok: boolean, factura: Facturacion }) => resp.factura)
          );
      }

    facturacionIndividual(facturacion: Facturacion) {
      const url = `${baseUrl}/facturacion/individual`;
      return this.http.post(url, facturacion, this.headers);
    }
  
    facturacionMasiva(facturacion: Facturacion) {
      const url = `${baseUrl}/facturacion/masiva`;
      return this.http.post(url, facturacion, this.headers);
    }
    
  
}
