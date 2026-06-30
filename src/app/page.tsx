import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl">WhatsAI</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-all"
              >
                Come\u00e7ar Gr\u00e1tis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            IA em tempo real
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Seu funcion\u00e1rio digital
            <span className="text-green-500"> para WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A IA que vende, negocia, or\u00e7a, atende e fecha pedidos
            automaticamente pelo WhatsApp. Como um funcion\u00e1rio experiente, 24h por dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Testar Gr\u00e1tis por 7 Dias
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Ver Demonstra\u00e7\u00e3o
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">Sem cart\u00e3o de cr\u00e9dito • Cancele quando quiser</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          O que seu neg\u00f3cio ganha
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              emoji: '\u{1F4B0}',
              title: 'Vende 24h por dia',
              desc: 'Enquanto voc\u00ea dorme, a IA atende, negocia e fecha vendas pelos seus clientes.'
            },
            {
              emoji: '\u{1F916}',
              title: 'Intelig\u00eancia de verdade',
              desc: 'N\u00e3o \u00e9 um chatbot burro. A IA entende contexto, negocia pre\u00e7os e cria relacionamento.'
            },
            {
              emoji: '\u{1F4CA}',
              title: 'Dashboard completo',
              desc: 'Veja vendas, clientes, hist\u00f3rico e m\u00e9tricas em tempo real do seu neg\u00f3cio.'
            },
            {
              emoji: '\u{1F4E6}',
              title: 'Cat\u00e1logo inteligente',
              desc: 'Cadastre produtos, pre\u00e7os e categorias. A IA consulta e or\u00e7a automaticamente.'
            },
            {
              emoji: '\u{1F4AC}',
              title: 'Mem\u00f3ria de cliente',
              desc: 'A IA lembra de cada cliente: hist\u00f3rico, prefer\u00eancias, \u00faltimas compras.'
            },
            {
              emoji: '\u{1F504}',
              title: 'P\u00f3s-venda autom\u00e1tico',
              desc: 'Recupera clientes, faz follow-up e mant\u00e9m relacionamento sem voc\u00ea fazer nada.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Planos simples
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Escolha o plano ideal para seu neg\u00f3cio. Cancele quando quiser.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'B\u00e1sico',
              price: 'R$ 97',
              features: ['1 n\u00famero WhatsApp', '500 conversas/m\u00eas', 'Cat\u00e1logo de produtos', 'Dashboard', 'Suporte email']
            },
            {
              name: 'Profissional',
              price: 'R$ 197',
              popular: true,
              features: ['1 n\u00famero WhatsApp', 'Conversas ilimitadas', 'Cat\u00e1logo + estoque', 'Dashboard completo', 'Mem\u00f3ria de clientes', 'P\u00f3s-venda autom\u00e1tico', 'Suporte priorit\u00e1rio']
            },
            {
              name: 'Premium',
              price: 'R$ 297',
              features: ['2 n\u00fameros WhatsApp', 'Conversas ilimitadas', 'Tudo do Profissional', 'Relat\u00f3rios avan\u00e7ados', 'API p\u00fablica', 'Gerente de sucesso', 'SLA 99.9%']
            }
          ].map((plan, i) => (
            <div key={i} className={`relative bg-white p-8 rounded-2xl border-2 transition-all animate-fade-in ${
              plan.popular
                ? 'border-green-500 shadow-xl scale-105'
                : 'border-gray-100 hover:border-gray-300'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {plan.price}
                <span className="text-base font-normal text-gray-500">/m\u00eas</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Come\u00e7ar 
