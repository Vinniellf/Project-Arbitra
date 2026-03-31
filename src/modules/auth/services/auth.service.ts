import type { User } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@test.com',
    password: 'Protecso123',
    empresa: "Misión Tecnológica",
    role: 'ADMIN',
    estado: 'ACTIVO',
  },
  {
    id: 2,
    name: 'Fabiano',
    lastName: 'Guerrero',
    email: 'fabiano.guerrero@protecso.com.pe',
    password: 'Protecso123',
    empresa: 'Protecso',
    role: 'USER',
    estado: 'ACTIVO',
  },
]

export const loginService = (email: string, password: string): User | null => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
};
