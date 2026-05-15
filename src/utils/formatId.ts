export const formatOrderId = (id: string): string =>
  'ORD-' + id.replace(/-/g, '').slice(0, 8).toUpperCase();

export const formatAppId = (id: string): string =>
  'APP-' + id.replace(/-/g, '').slice(0, 8).toUpperCase();

export const formatReportId = (id: string): string =>
  'RPT-' + id.replace(/-/g, '').slice(0, 8).toUpperCase();
