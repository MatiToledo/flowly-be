export default function buildPagination(p: string, l: string) {
  const limit = parseInt(l) || 20;
  const page = parseInt(p) || 1;
  const offset = (page - 1) * limit;
  return { limit, offset };
}
