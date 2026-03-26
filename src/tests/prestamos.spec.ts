import {test,request,expect} from "@playwright/test";
import { PrestamosService } from "../services/prestamosService";
import { ClientesService } from "../services/clientesService";
import { AuthService } from "../services/authService";


test('dar de alta PRESTAMO',  async({request})=>{
        // 1. Obtener token
        const authService = new AuthService(request);
        const token = await authService.getToken("usuario@test.com", "password123");

        // 2. Usar el token en los servicios
        const clienteService = new ClientesService(request);
        const response = await clienteService.obtenerDatosCliente(token);
        expect(response.status()).toBe(200)
        const body = await response.json();
        const idCuenta = await body.data.accounts[0].id
        console.log(idCuenta)

    const prestamosService = new PrestamosService(request);
    const responsePrestamo = await prestamosService.altaPrestamo(token, idCuenta, 12, 1)

     //expect(await responsePrestamo.status()).toBe(200)

     const bodyPrestamo= await responsePrestamo.json()
     console.log('Status:', responsePrestamo.status())
     console.log('Headers:', responsePrestamo.headers())
     console.log('Body:', JSON.stringify(bodyPrestamo, null, 2))


})

 