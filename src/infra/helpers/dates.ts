export function nowToISOString(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '');
};