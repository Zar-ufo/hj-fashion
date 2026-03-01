'use client';

import { useState } from 'react';

interface ShareProductButtonProps {
  slug: string;
}

export function ShareProductButton({ slug }: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window === 'undefined') return;
      await navigator.clipboard.writeText(`${window.location.origin}/product/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      className="flex items-center gap-2 px-3 py-1.5 border border-black/20 rounded text-xs text-black/60 hover:bg-black/5 transition"
      onClick={handleShare}
      type="button"
      title="Copy product link"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a4 4 0 005.656 0l1.414-1.414a4 4 0 000-5.656m-7.778-7.778a4 4 0 015.656 0l1.414 1.414a4 4 0 010 5.656" /></svg>
      {copied ? 'Copied' : 'Share'}
    </button>
  );
}
