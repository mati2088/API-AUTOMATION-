import { test, request, expect } from "@playwright/test";
import { PrestamosService } from "../services/prestamosService";
import { ClientesService } from "../services/clientesService";
import { SistemasService } from "../services/sistemaService";
import { AuthService } from "../services/authService";

test.beforeAll(async ({ request }) => {
    const authService = new AuthService(request);
    const token = await authService.getToken();
    process.env.TEST_TOKEN = token;
});

test.describe('Validar ALTA de PRESTAMOS', () => {

    test.beforeAll(async ({ request }) => {
        const sistemasService = new SistemasService(request);
        await sistemasService.resetearValores();
    });

    test('validar prestamo en cuenta corriente', async ({ request }) => {

        //obtener datos clientes 
        //sacar el numero de cuenta
        //dar de alta un prestamo
        //validacion de contrato
        const clienteService = new ClientesService(request);
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


        console.log(idCuenta, 'balance ', cuentaBalance)

        const prestamosService = new PrestamosService(request);
        const responsePrestamo = await prestamosService.altaPrestamo(idCuenta, 12, 5000)

        expect(await responsePrestamo.status()).toBe(200)

        const bodyPrestamo = await responsePrestamo.json()

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

test.describe('Validar Errores', () => {

    test("Validar mensaje de error cuando la cuenta no existe ", async ({ request }) => {
        let cuentaInexistente = "ACC231"

        const prestamosService = new PrestamosService(request);
        const responsePrestamo = await prestamosService.altaPrestamo(cuentaInexistente, 12, 5000)

        expect(await responsePrestamo.status()).toBe(404)

        const bodyPrestamo = await responsePrestamo.json()
        expect(bodyPrestamo.exito).toBe(false)
        expect(bodyPrestamo.mensaje).toBe("La cuenta destino 'ACC231' no existe")
        expect(bodyPrestamo.prestamo).toBe(null)

    })
})




test.describe('Validar CONSULTA de PRESTAMOS', () => {

    test.beforeAll(async ({ request }) => {
        // Obtenemos una cuenta válida de forma dinámica
        const clienteService = new ClientesService(request);
        const responseCliente = await clienteService.obtenerDatosCliente();
        const bodyCliente = await responseCliente.json();
        const idCuenta = bodyCliente.data.accounts[0].id;

        // Garantizar que exista al menos un préstamo para poder validar la estructura de la respuesta
        const prestamosService = new PrestamosService(request);
        await prestamosService.altaPrestamo(idCuenta, 12, 5000);
    });

    test('validar respuesta al consultar los prestamos', async ({ request }) => {
        const prestamosService = new PrestamosService(request);
        const response = await prestamosService.obtenerPrestamos();

        expect(response.status(), 'El status code debe ser 200').toBe(200);

        const body = await response.json();

        // Asumiendo que dependiendo de la API devuelva una lista directa o un wrapper
        const prestamosList = Array.isArray(body) ? body : (body.prestamos || body.data || []);

        expect(prestamosList.length).toBeGreaterThan(0);

        // Validamos que todos los campos tengan los mismos tipos de datos en la lista de préstamos
        for (const prestamo of prestamosList) {
            expect(typeof prestamo.id).toBe('string');
            expect(typeof prestamo.amount).toBe('number');
            expect(typeof prestamo.installments).toBe('number');
            expect(typeof prestamo.installmentAmount).toBe('number');
            expect(typeof prestamo.totalToPay).toBe('number');
            expect(prestamo.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/);
            expect(typeof prestamo.status).toBe('string');
            expect(typeof prestamo.cuenta_destino).toBe('string');
        }
    })
})

//mejoras agregar after y before 
