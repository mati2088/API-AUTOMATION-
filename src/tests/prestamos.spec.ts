import {test,request,expect} from "@playwright/test";
import { PrestamosService } from "../services/prestamosService";
import { ClientesService } from "../services/clientesService";
import { AuthService } from "../services/authService";


test('dar de alta PRESTAMO',  async({request})=>{
        const clienteService = new ClientesService(request);
        const response = await clienteService.obtenerDatosCliente();
        expect(response.status()).toBe(200)
        const body = await response.json();
        const idCuenta = await body.data.accounts[0].id
        console.log(idCuenta)

    const prestamosService = new PrestamosService(request);
    const responsePrestamo = await prestamosService.altaPrestamo(idCuenta, 12, 3000)

     //expect(await responsePrestamo.status()).toBe(200)

     const bodyPrestamo= await responsePrestamo.json()
})

