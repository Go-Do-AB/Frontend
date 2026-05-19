interface DraftBannerProps {
  text: string;
}

export function DraftBanner({ text }: DraftBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm px-4 py-3 text-center font-medium"
    >
      {text}
    </div>
  );
}
