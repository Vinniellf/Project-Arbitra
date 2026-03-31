export type User = {
  id: number
  name: string
  lastName?: string
  email: string
  password: string
  empresa?: string
  role: 'ADMIN' | 'USER'
  estado: "ACTIVO" | "INACTIVO"
}
