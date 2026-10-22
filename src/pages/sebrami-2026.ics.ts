/**
 * Arquivo de agenda do lançamento (Apple Calendário, Outlook e afins).
 * No build estático vira `dist/sebrami-2026.ics`; o GitHub Pages serve como text/calendar.
 */
import type { APIRoute } from 'astro';
import { icsConteudo } from '../data/lancamento';

export const GET: APIRoute = () =>
  new Response(icsConteudo(), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
