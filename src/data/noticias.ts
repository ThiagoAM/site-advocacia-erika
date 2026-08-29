/**
 * Notícias diárias mantidas por agente de IA no repositório central `agentic-news`
 * (ver docs/noticias-pipeline.md). O JSON é lido em tempo de build: as notícias
 * entram no HTML estático, sem JavaScript no cliente.
 *
 * O feed é opcional por definição — se estiver indisponível, o build segue e as
 * páginas renderizam o estado vazio.
 */

export interface Noticia {
  titulo: string;
  descricao: string;
  /** ISO 8601 com offset de fuso. */
  data_publicacao: string;
  /** Link externo para a matéria original. */
  url: string;
  fonte: string;
}

export interface FeedNoticias {
  /** Data/hora da coleta (ISO 8601 com offset) ou `null` se o feed não veio. */
  dataBusca: string | null;
  noticias: Noticia[];
}

const FEED_URL = 'https://thiagoam.github.io/agentic-news/clients/advocacia-erika/noticias.json';
const FEED_TIMEOUT_MS = 10_000;

/** Promise memoizada: um único fetch por build, compartilhado por todas as páginas. */
let feedPromise: Promise<FeedNoticias> | null = null;

function feedVazio(): FeedNoticias {
  return { dataBusca: null, noticias: [] };
}

function textoValido(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim() !== '';
}

function dataValida(iso: string): boolean {
  return !Number.isNaN(Date.parse(iso));
}

/** Valida e normaliza um item do feed; devolve `null` se estiver malformado. */
function normalizarNoticia(item: unknown): Noticia | null {
  if (typeof item !== 'object' || item === null) return null;

  const bruto = item as Record<string, unknown>;
  const { titulo, descricao, data_publicacao: dataPublicacao, url, fonte } = bruto;

  if (
    !textoValido(titulo) ||
    !textoValido(descricao) ||
    !textoValido(dataPublicacao) ||
    !textoValido(url) ||
    !textoValido(fonte)
  ) {
    return null;
  }
  if (!dataValida(dataPublicacao)) return null;
  // Só aceitamos links externos http(s) — o href vai direto para o HTML.
  if (!/^https?:\/\//i.test(url.trim())) return null;

  return {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    data_publicacao: dataPublicacao.trim(),
    url: url.trim(),
    fonte: fonte.trim(),
  };
}

async function buscarFeed(): Promise<FeedNoticias> {
  try {
    const resposta = await fetch(FEED_URL, { signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });

    if (!resposta.ok) {
      console.warn(`[noticias] feed indisponível (HTTP ${resposta.status}) — renderizando estado vazio.`);
      return feedVazio();
    }

    const dados: unknown = await resposta.json();
    if (typeof dados !== 'object' || dados === null) {
      console.warn('[noticias] feed em formato inesperado — renderizando estado vazio.');
      return feedVazio();
    }

    const raiz = dados as Record<string, unknown>;
    const lista = raiz['noticias'];
    if (!Array.isArray(lista)) {
      console.warn('[noticias] feed sem o array "noticias" — renderizando estado vazio.');
      return feedVazio();
    }

    const noticias = lista
      .map(normalizarNoticia)
      .filter((noticia): noticia is Noticia => noticia !== null)
      .sort((a, b) => Date.parse(b.data_publicacao) - Date.parse(a.data_publicacao));

    if (noticias.length === 0) {
      console.warn('[noticias] feed sem itens válidos — renderizando estado vazio.');
      return feedVazio();
    }

    const dataBuscaBruta = raiz['data-busca'];
    const dataBusca =
      textoValido(dataBuscaBruta) && dataValida(dataBuscaBruta) ? dataBuscaBruta.trim() : null;

    return { dataBusca, noticias };
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.message : String(erro);
    console.warn(`[noticias] falha ao buscar o feed (${motivo}) — renderizando estado vazio.`);
    return feedVazio();
  }
}

/**
 * Notícias do feed, ordenadas da mais recente para a mais antiga.
 * Nunca lança: em qualquer falha devolve `{ dataBusca: null, noticias: [] }`.
 */
export function getNoticias(): Promise<FeedNoticias> {
  feedPromise ??= buscarFeed();
  return feedPromise;
}

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Formata uma data ISO no formato curto do site — ex.: "29 ago 2026". */
export function formatarDataNoticia(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';

  // pt-BR devolve "29 de ago. de 2026" — montamos "29 ago 2026" a partir das partes.
  return formatadorData
    .formatToParts(data)
    .filter((parte) => parte.type !== 'literal')
    .map((parte) => parte.value.replace('.', ''))
    .join(' ');
}
