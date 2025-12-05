import { NextResponse } from 'next/server';
import { invalidateWorkflowDataCache, WORKFLOW_DATA_TAG } from '@/lib/data';

export const dynamic = 'force-dynamic';

const SECRET =
  process.env.WORKFLOW_REVALIDATE_TOKEN ||
  process.env.REVALIDATE_TOKEN ||
  process.env.REVALIDATE_SECRET ||
  null;

function isAuthorized(request: Request, url: URL): boolean {
  if (!SECRET) return true;
  const header = request.headers.get('authorization');
  if (header && header.toLowerCase().startsWith('bearer ')) {
    const token = header.slice(7);
    if (token === SECRET) {
      return true;
    }
  }
  const querySecret = url.searchParams.get('secret');
  return querySecret === SECRET;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (!isAuthorized(request, url)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    // Ignore JSON parse errors; treat as empty payload
  }

  invalidateWorkflowDataCache();

  return NextResponse.json({
    success: true,
    tag: WORKFLOW_DATA_TAG,
    datasetHash: typeof payload.datasetHash === 'string' ? payload.datasetHash : null,
    timestamp: new Date().toISOString(),
  });
}
