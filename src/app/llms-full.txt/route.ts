import { llmsTxt } from '@/lib/structured-data';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(await llmsTxt({ full: true }), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
