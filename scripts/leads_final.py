"""
WhatsAI Lead Generator - Google Places API (New)
Extrai comercios com telefone e salva em TXT
"""
import requests, json, re, time, os

API_KEY = "AIzaSyAJXZ66Xd89-9AQ8RrSAtJivFUcunq6xHQ"
ARQUIVO = "C:/Users/Admin/whats-ai-saas/scripts/leads_whatsai.txt"
MAX = 5000
DELAY = 0.5  # segundos entre requisicoes

# Categorias de comercio
CATEGORIAS = [
    "padaria", "restaurante", "mercado", "pizzaria", "salão de beleza",
    "barbearia", "oficina mecanica", "pet shop", "farmácia", "lanchonete",
    "sorveteria", "acougue", "mercearia", "hortifruti", "academia",
    "loja de roupa", "papelaria", "loja de conveniencia",
    "loja de calcados", "clinica de estetica", "borracharia",
    "marmitaria", "casa de carnes", "loja de moveis",
]

# Cidades do Brasil (foco PR e SP)
CIDADES = [
    "Foz do Iguaçu", "Cascavel", "Toledo", "Maringá", "Londrina",
    "Curitiba", "Ponta Grossa", "Guarapuava", "Campo Mourão",
    "Umuarama", "Francisco Beltrão", "Pato Branco", "Apucarana",
    "Arapongas", "São José dos Pinhais", "Colombo", "Paranaguá",
    "São Paulo", "Campinas", "São Bernardo do Campo", "Santo André",
    "Osasco", "Guarulhos", "Ribeirão Preto", "Sorocaba",
    "Rio de Janeiro", "Belo Horizonte", "Uberlândia", "Juiz de Fora",
    "Porto Alegre", "Florianópolis", "Blumenau", "Joinville",
    "Salvador", "Fortaleza", "Recife", "Brasília", "Goiânia",
    "Cuiabá", "Campo Grande", "Manaus", "Belém",
]

HEADERS = {
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.internationalPhoneNumber,places.formattedAddress,places.types",
    "Content-Type": "application/json",
}

def carregar_existentes():
    leads = []
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, 'r', encoding='utf-8') as f:
            for linha in f:
                m = re.search(r'(55\d{10,13})', linha)
                if m:
                    leads.append({'tel': m.group(1)})
    return leads

def salvar(leads):
    seen = set()
    with open(ARQUIVO, 'w', encoding='utf-8') as f:
        f.write("LEADS WHATSAI - COMERCIOS LOCAIS\n")
        f.write(f"GERADO: {time.strftime('%d/%m/%Y %H:%M')} | TOTAL: {len(leads)}\n")
        f.write("Fonte: Google Places API (New)\n")
        f.write("="*90 + "\n\n")
        i = 0
        for l in leads:
            if l['tel'] not in seen:
                seen.add(l['tel'])
                i += 1
                f.write(f"{i:04d}. {l['nome'][:50]} | {l['tel']} | {l['cidade']} | {l.get('endereco','')[:40]}\n")
    print(f"💾 {i} leads salvos em {ARQUIVO}")

def buscar(categoria, cidade):
    """Busca comercios pela Places API (New)"""
    url = "https://places.googleapis.com/v1/places:searchText"
    body = {
        "textQuery": f"{categoria} em {cidade}",
        "languageCode": "pt-BR",
        "maxResultCount": 20,
    }
    try:
        r = requests.post(url, headers=HEADERS, json=body, timeout=15)
        if r.status_code != 200:
            print(f"  ERRO {r.status_code}: {r.text[:100]}")
            return []
        data = r.json()
        places = data.get('places', [])
        leads = []
        for p in places:
            nome = p.get('displayName', {}).get('text', '').strip()
            tel = p.get('internationalPhoneNumber', '')
            end = p.get('formattedAddress', '')
            if nome and tel:
                nums = re.sub(r'\D', '', tel)
                if 10 <= len(nums) <= 13:
                    if not nums.startswith('55'): nums = f"55{nums}"
                    leads.append({'nome': nome, 'tel': nums, 'cidade': cidade, 'endereco': end})
        return leads
    except Exception as e:
        print(f"  EXCEPTION: {e}")
        return []

def main():
    existentes = carregar_existentes()
    seen = set(l['tel'] for l in existentes)
    all_leads = existentes.copy()
    total = len(all_leads)
    
    print(f"🔍 Leads existentes: {total}")
    print(f"🎯 Alvo: {MAX} leads\n")
    
    for cat in CATEGORIAS:
        if total >= MAX: break
        for cidade in CIDADES:
            if total >= MAX: break
            
            print(f"  {cat} em {cidade}...", end=' ', flush=True)
            leads = buscar(cat, cidade)
            
            added = 0
            for l in leads:
                if l['tel'] not in seen:
                    seen.add(l['tel'])
                    all_leads.append(l)
                    added += 1
                    total += 1
            
            print(f"+{added} (total {total})")
            time.sleep(DELAY)
        
        # Salvar checkpoint a cada categoria
        salvar(all_leads)
        if total >= MAX: break
    
    salvar(all_leads)
    print(f"\n✅ FINALIZADO! Total: {total} leads")
    print(f"📁 {ARQUIVO}")
    return all_leads

if __name__ == '__main__':
    main()
