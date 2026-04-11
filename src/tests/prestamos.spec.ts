import {test, expect, APIRequestContext} from "@playwright/test";
import { PrestamosService } from "../services/prestamosService";
import { ClientesService } from "../services/clientesService";
import { SistemasService } from "../services/sistemaService";
import { AuthService } from "../services/authService";

let authenticatedRequest: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
    const baseURL = process.env.BASE_URL!;
    const tempRequest = await playwright.request.newContext();
    const authService = new AuthService(tempRequest, baseURL);
    const token = await authService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!);

    authenticatedRequest = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: {
            'Authorization': `Bearer ${token}`
        }
    });
});

test.describe('Validar ALTA de PRESTAMOS',()=>{

      test.beforeAll(async () => {
        const sistemasService = new SistemasService(authenticatedRequest);
        await sistemasService.resetearValores();
    });

    test('validar prestamo en cuenta corriente',  async()=>{

        //obtener datos clientes 
        //sacar el numero de cuenta
        //dar de alta un prestamo
        //validacion de contrato
        const clienteService = new ClientesService(authenticatedRequest);
        const response = await clienteService.obtenerDatosCliente();
        //verificamos que sea un 200
        expect(response.status()).toBe(200)
        const body = await response.json();  

        /*Si el cliente tiene Cuenta Corriente en cualquier posición del array → la encuentra y sigue
        Si no tiene → el test falla con 'El cliente no tiene Cuenta Corriente'*/
        const cuentaCorriente = body.data.accounts.find(
            (account: any) => account.type === 'Cuenta Corriente'
        );

    expect(cuentaCorriente, 'El cliente no tiene Cuenta Corriente').toBeDefined();
    const idCuenta = cuentaCorriente.id;
    const cuentaBalance = cuentaCorriente.balance


    console.log(idCuenta,'balance ',cuentaBalance)
    
    const prestamosService = new PrestamosService(authenticatedRequest);
    const responsePrestamo = await prestamosService.altaPrestamo(idCuenta, 12, 5000)

    expect(await responsePrestamo.status()).toBe(200)

    const bodyPrestamo= await responsePrestamo.json()
     
     expect(typeof bodyPrestamo.exito).toBe('boolean');
     expect(typeof bodyPrestamo.mensaje).toBe('string')
     expect(typeof bodyPrestamo.prestamo.id).toBe('string')
     expect(typeof bodyPrestamo.prestamo.amount).toBe('number')
     expect(typeof bodyPrestamo.prestamo.installments).toBe('number')
     expect(typeof bodyPrestamo.prestamo.installmentAmount).toBe('number')
     expect(typeof bodyPrestamo.prestamo.totalToPay).toBe('number')
      /*a regex /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/ valida:
     2026-03-26 — fecha con 4-2-2 dígitos T — separador 23:01:55 — hora con 2-2-2 dígitos 
    .280189 — fracción de segundos (microsegundos en este caso)*/
     expect(bodyPrestamo.prestamo.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/)
     expect(typeof bodyPrestamo.prestamo.status).toBe('string')
     expect(typeof bodyPrestamo.prestamo.cuenta_destino).toBe('string')

     expect(bodyPrestamo.mensaje).toBe('Préstamo acreditado exitosamente')
    
     const responseValidarBalance = await clienteService.obtenerDatosCliente();
     expect(responseValidarBalance.status()).toBe(200)
     const bodyClientesBalance = await responseValidarBalance.json();        

    expect(bodyClientesBalance.data.accounts[0].balance).toBe(505000)
})
})

test.describe('Validar Errores',()=>{

    test("Validar mensaje de error cuando la cuenta no existe ",  async()=>{
    let cuentaInexistente="ACC231"
     
    const prestamosService = new PrestamosService(authenticatedRequest);
    const responsePrestamo = await prestamosService.altaPrestamo(cuentaInexistente, 12, 5000)

    expect(await responsePrestamo.status()).toBe(404)

    const bodyPrestamo= await responsePrestamo.json()
    expect(bodyPrestamo.exito).toBe(false)
    expect(bodyPrestamo.mensaje).toBe("La cuenta destino 'ACC231' no existe")
    expect(bodyPrestamo.prestamo).toBe(null)

})
})

test.describe('Validar DESISTIR de PRESTAMO', () => {
    
    test('El usuario puede desistir de un préstamo', async () => {
        const clienteService = new ClientesService(authenticatedRequest);
        const prestamosService = new PrestamosService(authenticatedRequest);

        // 1. Obtener datos del cliente para conseguir un ID de cuenta
        const responseCliente = await clienteService.obtenerDatosCliente();
        expect(responseCliente.status()).toBe(200);
        const bodyCliente = await responseCliente.json();
        const idCuenta = bodyCliente.data.accounts[0].id;

        // 2. Crear el préstamo
        const responsePrestamo = await prestamosService.altaPrestamo(idCuenta, 12, 10000);
        expect(responsePrestamo.status()).toBe(200);
        const bodyPrestamo = await responsePrestamo.json();

        // 3. Obtener el ID del préstamo recién creado
        const idPrestamo = bodyPrestamo.prestamo.id;
        console.log(`ID del préstamo creado: ${idPrestamo}`);

        // 4. Desistir del préstamo
        const responseDesistir = await prestamosService.desistirPrestamo(idPrestamo);
        expect(responseDesistir.status()).toBe(200);
        const bodyDesistir = await responseDesistir.json();
        expect(bodyDesistir.exito).toBe(true);
        expect(bodyDesistir.mensaje).toBe('Préstamo desistido exitosamente');

        // 5. Validar que el préstamo tenga el status 'rejected'
        const responsePrestamos = await prestamosService.obtenerPrestamos();
        expect(responsePrestamos.status()).toBe(200);
        const bodyPrestamosList = await responsePrestamos.json();

        const prestamoDesistido = bodyPrestamosList.prestamos.find(
             (p: any) => p.id === idPrestamo
            );

        expect(prestamoDesistido).toBeDefined();
        expect(prestamoDesistido.status).toBe('retracted');
        });
});


//mejoras agregar after y before 

