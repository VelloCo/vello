export interface Property {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  price: string;
  bedrooms: number;
  parking: number;
  area: number;
  type: 'Venda' | 'Aluguel';
  image: string;
}

export const properties: Property[] = [
  {
    id: 'moinhos',
    title: 'Apartamento no Moinhos de Vento',
    neighborhood: 'Moinhos de Vento',
    city: 'Porto Alegre',
    price: 'R$ 890.000',
    bedrooms: 3,
    parking: 2,
    area: 124,
    type: 'Venda',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bela-vista',
    title: 'Apartamento no Bela Vista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    price: 'R$ 645.000',
    bedrooms: 2,
    parking: 1,
    area: 87,
    type: 'Venda',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'loft-centro',
    title: 'Loft no Centro',
    neighborhood: 'Centro Histórico',
    city: 'Porto Alegre',
    price: 'R$ 480.000',
    bedrooms: 2,
    parking: 0,
    area: 62,
    type: 'Venda',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'auxiliadora',
    title: 'Apartamento na Auxiliadora',
    neighborhood: 'Auxiliadora',
    city: 'Porto Alegre',
    price: 'R$ 712.000',
    bedrooms: 3,
    parking: 1,
    area: 98,
    type: 'Venda',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  },
];

export const heroProperties = properties.slice(0, 2);
export const selectionProperties = properties;
