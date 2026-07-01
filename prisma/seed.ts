import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias exemplo
  const categories = [
    { name: 'Bebidas', slug: 'bebidas' },
    { name: 'Alimentos', slug: 'alimentos' },
    { name: 'Serviços', slug: 'servicos' },
    { name: 'Vestuário', slug: 'vestuario' },
    { name: 'Eletrônicos', slug: 'eletronicos' },
  ]

  // Criar produtos exemplo
  const products = [
    { name: 'Café Expresso', description: 'Café espresso tradicional 50ml', price: 5.0, active: true },
    { name: 'Água Mineral 500ml', description: 'Água mineral sem gás', price: 3.0, active: true },
    { name: 'Pão de Queijo (10un)', description: 'Pão de queijo feito na hora', price: 15.0, active: true },
    { name: 'Pastel de Carne', description: 'Pastel frito na hora recheado com carne moída', price: 8.0, active: true },
    { name: 'Suco Natural de Laranja', description: 'Suco de laranja natural 300ml', price: 7.0, active: true },
    { name: 'Camiseta Básica', description: 'Camiseta 100% algodão, diversas cores', price: 39.90, active: true },
    { name: 'Fone de Ouvido Bluetooth', description: 'Fone sem fio com bateria de 8h', price: 89.90, active: true },
  ]

  // Criar um tenant de demonstração
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Loja Demo WhatsAI',
      slug: 'demo',
      phone: '5511999999999',
      status: 'ACTIVE',
      plan: 'PROFISSIONAL',
      settings: {
        create: {
          welcomeMessage: 'Olá! 👋 Bem-vindo à Loja Demo! Como posso ajudar?',
          aiPersonality: 'Você é um atendente virtual simpático e profissional de uma loja. Seja educado, objetivo e ajude o cliente a encontrar o que precisa.',
          autoReply: true,
          workingHours: true,
          businessHours: 'Seg a Sex: 08:00-18:00, Sáb: 08:00-12:00',
        }
      }
    },
  })
  console.log('✅ Tenant demo criado:', tenant.name)

  // Adicionar categorias ao tenant demo
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.name.toLowerCase().replace(/\s+/g, '-') + '-' + tenant.id },
      update: {},
      create: {
        ...cat,
        tenantId: tenant.id,
      },
    })
  }
  console.log('✅ Categorias criadas:', categories.length)

  // Adicionar produtos ao tenant demo
  for (const prod of products) {
    await prisma.product.create({
      data: {
        ...prod,
        tenantId: tenant.id,
      },
    })
  }
  console.log('✅ Produtos criados:', products.length)

  // Adicionar base de conhecimento
  const knowledge = [
    { title: 'Política de Troca', content: 'Trocas podem ser feitas em até 7 dias após o recebimento. O produto deve estar em perfeito estado.', tags: 'troca,devolucao,garantia' },
    { title: 'Formas de Pagamento', content: 'Aceitamos PIX, cartão de crédito (até 12x) e boleto bancário. Pagamentos via PIX são confirmados na hora.', tags: 'pagamento,pix,cartao,credito' },
    { title: 'Prazo de Entrega', content: 'O prazo de entrega é de 3 a 10 dias úteis para todo o Brasil. Entregas expressas para a região Sudeste em até 2 dias úteis.', tags: 'entrega,envio,prazo,frete' },
    { title: 'Horário de Atendimento', content: 'Nosso atendimento funciona de segunda a sexta das 08:00 às 18:00 e sábados das 08:00 às 12:00. Fora do horário, nossa IA está pronta para ajudar!', tags: 'horario,atendimento,funcionamento' },
  ]

  for (const item of knowledge) {
    await prisma.knowledge.create({
      data: {
        ...item,
        tenantId: tenant.id,
      },
    })
  }
  console.log('✅ Base de conhecimento criada:', knowledge.length, 'itens')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('📌 Tenant demo: slug="demo"')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
