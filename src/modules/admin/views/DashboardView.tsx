import {
  Building2,
  Bot,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'

export default function DashboardView() {
  // 📊 DATA FICTICIA SEGURA
  const empresasUso = [
    { name: 'Empresa A', chats: 52 },
    { name: 'Empresa B', chats: 34 },
    { name: 'Empresa C', chats: 21 },
    { name: 'Empresa D', chats: 18 },
  ]

  const usoIA = [
    { name: 'Resueltos por IA', value: 68 },
    { name: 'Escalados a soporte', value: 32 },
  ]

  const chatsPorDia = [
    { dia: 'Lun', chats: 14 },
    { dia: 'Mar', chats: 22 },
    { dia: 'Mié', chats: 19 },
    { dia: 'Jue', chats: 28 },
    { dia: 'Vie', chats: 24 },
  ]

  const COLORS = ['#22c55e', '#ef4444']

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-md min-h-full space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Bot className="text-purple-600" size={22} />
          Dashboard Pepe IA
        </h2>
        <p className="text-sm text-gray-500">
          Métricas de uso e inteligencia del sistema
        </p>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Chats Totales</p>
            <MessageSquare className="text-blue-600" size={18} />
          </div>
          <p className="text-2xl font-semibold mt-2">125</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Interacciones IA</p>
            <Bot className="text-purple-600" size={18} />
          </div>
          <p className="text-2xl font-semibold mt-2">98</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Empresas activas</p>
            <Building2 className="text-yellow-600" size={18} />
          </div>
          <p className="text-2xl font-semibold mt-2">16</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Eficiencia IA</p>
            <TrendingUp className="text-green-600" size={18} />
          </div>
          <p className="text-2xl font-semibold text-green-600 mt-2">
            68%
          </p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EMPRESAS */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Uso del chat por empresa
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={empresasUso}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="chats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* IA VS SOPORTE */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Resolución Pepe IA
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={usoIA} dataKey="value" outerRadius={80} label>
                {usoIA.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVIDAD */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Actividad del chat (Pepe IA)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chatsPorDia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="chats" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
