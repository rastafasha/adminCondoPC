import { Facturacion } from "./facturacion";
import { User } from "./user";

export class Transferencia{
  constructor(

        public user: string,
        public bankName: string,
        public metodo_pago: string,
        public amount: number,
        public tasaBCV: number,
        public referencia: string,
        public factura: string,
        public paymentday: Date,
        public status: 'PENDING'| 'APPROVED'| 'REJECTED',
        public createdAt: Date,
        public updatedAt: Date,
        public _id?: string,
        public img?: string
      
  ){
    this.status = 'PENDING'; // Valor por defecto
  }

   

}
