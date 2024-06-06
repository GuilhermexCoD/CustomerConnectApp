import { Phone } from "./Phone";

export interface Client {
    id: string;
    name: string;
    age: number;
    cpf: string;
    rg: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phones: Phone[];
}