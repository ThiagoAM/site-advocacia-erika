/**
 * Lançamento da coletânea "Direito Imobiliário" no SEBRAMI 2026 — pedido da cliente
 * em 21/10/2026 (ver docs/lancamento-livro-sebrami.md).
 *
 * Fonte única do aviso de abertura, da seção da home, da página /livro e do
 * arquivo de agenda (/sebrami-2026.ics). Horários e endereço conferidos em
 * sebrami.com em 22/10/2026. O Brasil não tem horário de verão desde 2019,
 * então o fuso de São Paulo é sempre -03:00.
 */

export const LIVRO = {
  titulo: 'Direito Imobiliário',
  colecao: 'Coletânea Imobiliária 2026',
  capitulo: 'Reflexos dos regimes de bens nos negócios imobiliários',
  capituloSubtitulo: 'repercussões notariais e registrais na circulação da propriedade',
};

export const EVENTO = {
  sigla: 'SEBRAMI 2026',
  nome: 'Seminário Brasileiro do Mercado Imobiliário',
  datas: '11 e 12 de novembro de 2026',
  datasCurtas: '11 e 12 de novembro',
  diasSemana: 'quarta e quinta-feira',
  horario: 'das 8h20 às 19h30',
  local: 'Teatro APCD',
  endereco: 'R. Voluntários da Pátria, 547 — Santana',
  cidade: 'São Paulo/SP',
  cep: '02011-000',
  url: 'https://sebrami.com',
  cupom: 'SAQUETTI',
  dias: [
    { inicio: '2026-11-11T08:20:00-03:00', fim: '2026-11-11T19:30:00-03:00' },
    { inicio: '2026-11-12T08:30:00-03:00', fim: '2026-11-12T19:30:00-03:00' },
  ],
};

/** Caminho do arquivo .ics gerado por `src/pages/sebrami-2026.ics.ts`. */
export const ICS_PATH = '/sebrami-2026.ics';

export const MAPA_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${EVENTO.local}, ${EVENTO.endereco.replace(' — ', ', ')}, São Paulo - SP, ${EVENTO.cep}`,
)}`;

/** Fim do último dia, em ISO — o aviso some sozinho depois disso. */
export const FIM_DO_EVENTO = EVENTO.dias[EVENTO.dias.length - 1].fim;

/**
 * Avaliado no build. O site é reconstruído todo dia (deploy.yml), então no dia
 * seguinte ao evento as chamadas de inscrição, cupom e agenda saem sozinhas.
 */
export function eventoEncerrado(agora = new Date()): boolean {
  return agora.getTime() > Date.parse(FIM_DO_EVENTO);
}

const LOCAL_COMPLETO = `${EVENTO.local} — ${EVENTO.endereco}, São Paulo - SP, ${EVENTO.cep}`;

const DESCRICAO = [
  `Lançamento da coletânea "${LIVRO.titulo} — ${LIVRO.colecao}", com o capítulo da Dra. Érika Saquetti Martins: "${LIVRO.capitulo}: ${LIVRO.capituloSubtitulo}".`,
  '',
  'Dia 11: 8h20 às 19h30 · Dia 12: 8h30 às 19h30.',
  `Inscrições em ${EVENTO.url} — use o cupom ${EVENTO.cupom}.`,
  '',
  'Mais informações: https://saquettimartins.adv.br/livro',
].join('\n');

/** 2026-11-11T08:20:00-03:00 → 20261111T112000Z */
function utcCompacto(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Google Agenda: um evento por link, então os dois dias entram como recorrência
 * diária (8h20–19h30; no segundo dia a programação começa 10 min depois).
 */
export function googleAgendaUrl(): string {
  const [dia1] = EVENTO.dias;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${EVENTO.sigla} — lançamento do livro ${LIVRO.titulo}`,
    dates: `${utcCompacto(dia1.inicio)}/${utcCompacto(dia1.fim)}`,
    ctz: 'America/Sao_Paulo',
    recur: `RRULE:FREQ=DAILY;COUNT=${EVENTO.dias.length}`,
    details: DESCRICAO,
    location: LOCAL_COMPLETO,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Escapa texto conforme a RFC 5545 (3.3.11). */
function icsTexto(valor: string): string {
  return valor.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** Dobra linhas em 75 octetos (RFC 5545, 3.1) sem partir caracteres UTF-8. */
function icsDobrar(linha: string): string {
  const encoder = new TextEncoder();
  const partes: string[] = [];
  let atual = '';
  let bytes = 0;
  for (const ch of linha) {
    const tamanho = encoder.encode(ch).length;
    const limite = partes.length === 0 ? 75 : 74; // continuação começa com um espaço
    if (bytes + tamanho > limite) {
      partes.push(atual);
      atual = '';
      bytes = 0;
    }
    atual += ch;
    bytes += tamanho;
  }
  partes.push(atual);
  return partes.join('\r\n ');
}

/** Um VEVENT por dia, com lembrete na véspera do primeiro. Horários em UTC: dispensa VTIMEZONE. */
export function icsConteudo(): string {
  const carimbo = utcCompacto('2026-10-22T12:00:00-03:00');
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Saquetti Martins Advocacia//Lancamento SEBRAMI 2026//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...EVENTO.dias.flatMap((dia, i) => [
      'BEGIN:VEVENT',
      `UID:sebrami-2026-dia-${i + 1}@saquettimartins.adv.br`,
      `DTSTAMP:${carimbo}`,
      `DTSTART:${utcCompacto(dia.inicio)}`,
      `DTEND:${utcCompacto(dia.fim)}`,
      `SUMMARY:${icsTexto(`${EVENTO.sigla} (dia ${i + 1}) — lançamento do livro ${LIVRO.titulo}`)}`,
      `DESCRIPTION:${icsTexto(DESCRICAO)}`,
      `LOCATION:${icsTexto(LOCAL_COMPLETO)}`,
      `URL:${EVENTO.url}`,
      ...(i === 0
        ? ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsTexto(`${EVENTO.sigla} amanhã`)}`, 'TRIGGER:-P1D', 'END:VALARM']
        : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return linhas.map(icsDobrar).join('\r\n') + '\r\n';
}
