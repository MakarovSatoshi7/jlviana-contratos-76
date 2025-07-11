// This file is no longer needed as we're using Supabase hooks instead of Zustand store
// Keeping this placeholder file to prevent import errors during migration
export const useStore = () => {
  console.warn('useStore is deprecated. Please use Supabase hooks instead.');
  return {};
};
