"""
auto-ocr-chatgpt.py
Automação: envia "siga" no ChatGPT, captura a resposta OCR e appenda no arquivo txt.

PRÉ-REQUISITOS (rodar uma vez):
    pip install playwright
    playwright install chrome

COMO USAR:
    1. Feche o Google Chrome completamente
    2. Configure a URL da conversa abaixo (CONVERSATION_URL)
    3. Clique duas vezes em scripts/abrir-chrome-debug.bat  ← NOVO PASSO
    4. No Chrome que abriu, navegue até a conversa do ChatGPT
    5. Execute: python scripts/auto-ocr-chatgpt.py
    6. A automação envia "siga" e salva cada resposta automaticamente
"""

import asyncio
import time

from playwright.async_api import async_playwright

# =====================================================================
# CONFIGURAÇÕES — edite aqui antes de rodar
# =====================================================================

# URL da conversa do ChatGPT onde estão as imagens carregadas
# Ex: https://chatgpt.com/c/6a12d983-5ee4-83e9-b5bb-a314e8c0610f
CONVERSATION_URL = "https://chatgpt.com/g/g-p-67b46b90b57c8191be744da541b70b32-alvaro/c/6a0fd9fa-9ce4-83e9-b840-d82f3dd913cc"

# Arquivo onde o texto extraído será salvo
OUTPUT_FILE = (
    r"C:\Users\AlvaroSouzaJr\OneDrive - Macher Serviços em Tecnologia LTDA"
    r"\Documentos\Pessoal\Claude-projects\Meu Vade Mecum\data\indice-remissivo-bruto.txt"
)

# Número da última página do livro
ULTIMA_PAGINA = 1445

# =====================================================================


async def enviar_siga(page):
    """Digita 'siga' no campo de texto e envia."""
    seletores = [
        "#prompt-textarea",
        "div[contenteditable='true'][data-lexical-editor]",
        "div[contenteditable='true']",
        "textarea",
    ]
    for seletor in seletores:
        try:
            el = await page.wait_for_selector(seletor, timeout=5000, state="visible")
            if el:
                await el.click()
                await page.keyboard.press("Control+a")
                await page.keyboard.press("Delete")
                await page.keyboard.type("siga")
                await asyncio.sleep(0.5)
                await page.keyboard.press("Enter")
                return
        except Exception:
            continue
    raise Exception("Não encontrei o campo de texto do ChatGPT. Verifique se a página carregou.")


async def esperar_resposta(page, timeout=240):
    """
    Aguarda o ChatGPT terminar de gerar.
    Detecta o marcador [CONTROLE] que o prompt-ocr.md instrui o ChatGPT a incluir
    ao final de cada resposta.
    """
    inicio = time.time()
    while time.time() - inicio < timeout:
        try:
            seletores_mensagem = [
                "div[data-message-author-role='assistant']",
                "article[data-testid*='conversation-turn']:last-child",
                "[data-testid*='bot-message']:last-child",
            ]
            for seletor in seletores_mensagem:
                elementos = await page.query_selector_all(seletor)
                if elementos:
                    ultimo = elementos[-1]
                    texto = await ultimo.inner_text()
                    if "[CONTROLE]" in texto:
                        return texto
        except Exception:
            pass
        await asyncio.sleep(2)

    raise TimeoutError(f"ChatGPT não respondeu em {timeout} segundos.")


async def main():
    if CONVERSATION_URL == "COLE_AQUI_A_URL_DA_CONVERSA":
        print("=" * 60)
        print("ERRO: Configure a CONVERSATION_URL no início do script.")
        print("=" * 60)
        input("Pressione Enter para sair...")
        return

    print("=" * 60)
    print("  Automação OCR — ChatGPT → indice-remissivo-bruto.txt")
    print("=" * 60)
    print(f"Arquivo de saída: {OUTPUT_FILE}")
    print(f"Última página alvo: {ULTIMA_PAGINA}")
    print()

    async with async_playwright() as p:
        print("Conectando ao Chrome aberto via abrir-chrome-debug.bat...")
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        except Exception:
            print()
            print("ERRO: Chrome não encontrado na porta 9222.")
            print("Certifique-se de ter executado 'abrir-chrome-debug.bat' antes.")
            input("Pressione Enter para sair...")
            return

        context = browser.contexts[0]
        pages = context.pages

        # Encontra a aba com o ChatGPT ou abre uma nova
        page = None
        for p_aba in pages:
            if "chatgpt.com" in p_aba.url:
                page = p_aba
                print(f"Aba do ChatGPT encontrada: {p_aba.url}")
                break

        if page is None:
            print("Nenhuma aba do ChatGPT encontrada. Abrindo nova aba...")
            page = await context.new_page()
            await page.goto(CONVERSATION_URL)
            await page.wait_for_load_state("domcontentloaded")
            print("Aguardando carregamento (5s)...")
            await asyncio.sleep(5)
        else:
            # Já está na aba certa — navega para a URL da conversa se necessário
            if CONVERSATION_URL not in page.url:
                print("Navegando para a conversa...")
                await page.goto(CONVERSATION_URL)
                await page.wait_for_load_state("domcontentloaded")
                await asyncio.sleep(5)

        iteracao = 0

        while True:
            iteracao += 1
            print(f"\n[Iteração {iteracao}] Enviando 'siga'...")

            try:
                await enviar_siga(page)
            except Exception as e:
                print(f"ERRO ao enviar mensagem: {e}")
                print("Parando automação.")
                break

            print("Aguardando resposta do ChatGPT (máx. 4 min)...")
            try:
                texto = await esperar_resposta(page)
            except TimeoutError as e:
                print(f"ERRO: {e}")
                print("Parando automação.")
                break

            # Salva no arquivo
            with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
                f.write("\n" + texto + "\n")

            print("Salvo no arquivo.")

            # Log da última página processada
            if "Última página processada:" in texto:
                for linha in texto.splitlines():
                    if "Última página processada:" in linha:
                        print(f"  → {linha.strip()}")
                        break

            # Condição de parada: última página atingida
            if f"PÁGINA {ULTIMA_PAGINA}" in texto:
                print(f"\n✓ Última página ({ULTIMA_PAGINA}) alcançada. Automação concluída!")
                break

            # Condição de parada: ChatGPT diz que acabou
            texto_lower = texto.lower()
            if any(frase in texto_lower for frase in [
                "não há mais páginas",
                "todas as páginas foram",
                "arquivo foi processado por completo",
            ]):
                print("\n✓ ChatGPT indicou que não há mais páginas. Concluído!")
                break

            print("Aguardando 3s antes do próximo 'siga'...")
            await asyncio.sleep(3)

        print(f"\nTotal de iterações: {iteracao}")
        print("Automação encerrada. O Chrome continua aberto.")


asyncio.run(main())
