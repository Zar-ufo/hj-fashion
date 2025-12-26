'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  defaultValue: string;
}

export function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select 
      name="sort" 
      defaultValue={defaultValue}
      onChange={handleChange}
      className="bg-transparent font-bold text-stone-900 outline-none cursor-pointer focus:ring-0 border-none px-0"
    >
      <option value="featured">Featured</option>
      <option value="newest">Newest First</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}
