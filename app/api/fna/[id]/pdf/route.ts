export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('fna_sessions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(18).text('Financial Needs Analysis Report', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${new Date(data.created_at).toLocaleString()}`);
  doc.moveDown();
  doc.text(`Household Income: $${data.household_income}`);
  doc.text(`Debt Total: $${data.debt_total}`);
  doc.text(`Savings Total: $${data.savings_total}`);
  doc.text(`Dependents: ${data.dependents}`);
  doc.text(`Years of Income to Protect: ${data.goal_years_of_income}`);
  doc.end();

  await new Promise(resolve => doc.on('end', resolve));

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="fna-${params.id}.pdf"`
    }
  });
}
