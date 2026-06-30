export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vis\u00e3o Geral</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Atendimentos hoje', value: '0', color: 'bg-blue-500' },
          { label: 'Clientes', value: '0', color: 'bg-green-500' },
          { label: 'Vendas do m\u00eas', value: 'R$ 0', color: 'bg-purple-500' },
          { label: 'Conversas ativas', value: '0', color: 'bg-orange-500' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold">{i + 1}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">\u00daltimas conversas</h2>
        <p className="text-gray-400 text-center py-8">Conecte seu WhatsApp para come\u00e7ar a atender</p>
      </div>
    </div>
  )
}
