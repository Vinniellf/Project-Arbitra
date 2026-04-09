import type { Empresa } from '../types/empresa'

export const mockEmpresas: Empresa[] = [
  {
    id: '1',
    nombre: 'Tech Solutions SAC',
    ruc: '20123456789',
    estado: 'ACTIVA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Innova Corp',
    ruc: '20987654321',
    estado: 'INACTIVA',
    createdAt: new Date().toISOString(),
  },
]
