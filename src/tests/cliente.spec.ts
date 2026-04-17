import {test,request,expect} from "@playwright/test";
import { ClientesService } from "../services/clientesService";
import { AuthService } from "../services/authService";

test.beforeAll(async ({ request }) => {
    const authService = new AuthService(request);
    const token = await authService.getToken();
    process.env.TEST_TOKEN = token;
});

test("Obtener datos cliente exitosamente", async({request})=>{
    const clientesService= new ClientesService(request);
    const responseService = await clientesService.obtenerDatosCliente();

    const body = await responseService.json()
    console.log(body)
})

test("validar personalInfo", async({request})=>{
    const clienteService = new ClientesService(request);
    const response = await clienteService.obtenerDatosCliente();
    
    expect(response.status()).toBe(200)


    const body = await response.json();
    console.log(body)
    //validaciones
    expect(body.data.personalInfo.name).toBe("Juan Pérez");
    // Validamos que el ID tenga el formato esperado, ya que parece ser dinámico
    expect(body.data.accounts[0].id).toMatch(/^ACC-[A-Z0-9]+$/);
    //expect(body.data.cards[0].id).toBe("CARD001")

    expect(body.data.personalInfo.address).not.toBe(null)
})
//tipos de pruebas, validacion de contrato, validacion de tipos 
// de datos por campos. validar status code
//flujo completo por ej: crear cliente, agregar cuenta, dar de alta un prestamo

