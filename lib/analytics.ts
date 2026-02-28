import 'server-only';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function getPageViews(paths: string[]): Promise<Record<string, number>> {
  const { GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY } = process.env;
  if (!GA_PROPERTY_ID || !GA_CLIENT_EMAIL || !GA_PRIVATE_KEY) return {};

  const client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: GA_CLIENT_EMAIL,
      private_key: GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });

  const [response] = await client.runReport({
    property: `properties/${GA_PROPERTY_ID}`,
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'views' }],
    dimensionFilter: {
      orGroup: {
        expressions: paths.map((path) => ({
          filter: {
            fieldName: 'pagePath',
            stringFilter: { value: path, matchType: 'EXACT' },
          },
        })),
      },
    },
  });

  const views: Record<string, number> = {};
  for (const row of response.rows ?? []) {
    const path = row.dimensionValues?.[0]?.value ?? '';
    const count = parseInt(row.metricValues?.[0]?.value ?? '0', 10);
    if (path) views[path] = count;
  }
  return views;
}