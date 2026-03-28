import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.apiUrlMedia;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'profiles'|'payments',
    id: string
  ){
    try {
      const url = `${base_url}/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if(data.ok) {
        console.log(data);
        return data.nombreArchivo;
      } else {
        console.log(data);
        console.log(data.msg);
        return false;
      }
    } catch(error) {
      console.log(error);
      return false;
    }
  }
}
