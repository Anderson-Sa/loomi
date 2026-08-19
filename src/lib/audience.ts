export const AUDIENCES = [
  {
    slug: "feminino",
    name: "Feminino",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200",
  },
  {
    slug: "masculino",
    name: "Masculino",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200",
  },
  {
    slug: "infantil",
    name: "Infantil",
    imageUrl: "https://images.unsplash.com/photo-1771098124556-0d22d2ab3881?w=1200",
  },
] as const;

export function getAudienceName(slug: string) {
  return AUDIENCES.find((a) => a.slug === slug)?.name ?? slug;
}
