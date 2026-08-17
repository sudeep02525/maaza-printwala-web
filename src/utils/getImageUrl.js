export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Extract base URL from env
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Ensure correct slash formatting
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};
