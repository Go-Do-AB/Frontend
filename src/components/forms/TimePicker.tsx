import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TimeOption = { value: string; label: string };

const timeOptions: TimeOption[] = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const raw = `${h.toString().padStart(2, "0")}:${m}`;
  const display = new Date(`1970-01-01T${raw}:00`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { value: raw, label: display };
});

export function TimePicker({
  value,
  onChange,
  placeholder,
  label,
}: {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {value
                ? timeOptions.find((t) => t.value === value)?.label
                : placeholder || "Pick time"}
            </div>
            <span className="text-xl leading-none">⌄</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 max-h-60 overflow-y-auto p-1 bg-white">
          {timeOptions.map((t) => (
            <button
              key={t.value}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 text-sm",
                value === t.value && "bg-gray-200 font-semibold"
              )}
              onClick={(e) => {
                e.preventDefault();
                onChange(t.value);
              }}
            >
              {t.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
