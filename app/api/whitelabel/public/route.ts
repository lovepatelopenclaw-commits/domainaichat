import { NextRequest, NextResponse } from 'next/server';
import {
  getWhiteLabelConfigByEmbedToken,
  toPublicWhiteLabelWorkspace,
} from '@/lib/whitelabel';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const workspaceToken = req.nextUrl.searchParams.get('workspace') ?? '';
    const config = await getWhiteLabelConfigByEmbedToken(workspaceToken);

    if (!config) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({
      workspace: toPublicWhiteLabelWorkspace(config),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load workspace' }, { status: 500 });
  }
}
