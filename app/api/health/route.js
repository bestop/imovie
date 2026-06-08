import { checkConnection } from '../../../lib/db-neon';

export async function GET() {
  const status = await checkConnection();

  if (status.connected) {
    return Response.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  }

  return Response.json({
    status: 'error',
    database: 'disconnected',
    error: status.error,
    timestamp: new Date().toISOString()
  }, { status: 503 });
}
