export interface Category {
  id: string;
  name: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  hoverBorderClass: string;
}

export interface Prompt {
  id: string;
  categoryId: string;
  text: string;
  createdAt: number;
}
