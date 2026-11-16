import axios from 'axios'

// Cliente HTTP puro: sem respostas fictícias nem caminhos alternativos.
// Quem responde é a rede (em dev/teste, os handlers do MSW).
export const cliente = axios.create({ baseURL: '/api/compra' })
