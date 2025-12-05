import { NextResponse } from 'next/server';
import { executeWorkflowSearch } from '@/lib/search/engine';
import { clampPage, clampPageSize, parseFiltersFromURL } from '@/lib/search';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const sizeParam = parseInt(searchParams.get('pageSize') ?? '24', 10);
  const page = clampPage(pageParam);
  const pageSize = clampPageSize(sizeParam);
  const filters = parseFiltersFromURL(searchParams);

  try {
    const data = await executeWorkflowSearch(filters, page, pageSize);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to perform search at this time.',
      },
      { status: 500 }
    );
  }
}
