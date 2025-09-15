import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TimeOption = { value: string; label: string };

const timeOptions: TimeOption[] = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const raw = `${h.toString().padStart(2, "0")}:${m}:00`;
  const display = new Date(`1970-01-01T${raw}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { value: raw, label: display };
});

interface TimePickerProps {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  disabledOptions?: (value: string) => boolean;
}

export function TimePicker({
  value,
  onChange,
  placeholder,
  label,
  disabledOptions = () => false,
}: TimePickerProps) {
  const handleValueChange = (val: string) => {
    if (!disabledOptions(val)) {
      onChange(val);
    }
  };

  return (
    <div className="w-full space-y-1">
      {label && <Label className="text-sm">{label}</Label>}
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder={placeholder || "Pick time"} />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto">
          {timeOptions.map((t) => {
            const isDisabled = disabledOptions(t.value);
            return (
              <SelectItem
                key={t.value}
                value={t.value}
                className={cn(isDisabled && "opacity-50 pointer-events-none cursor-not-allowed")}
              >
                {t.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
