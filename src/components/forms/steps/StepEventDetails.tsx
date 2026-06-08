import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { useState } from "react";
import { categoryOptions, filterOptions, subcategoriesMap } from "@/lib/content/contentText";
import { CATEGORY_COLORS } from "@/components/preview/constants";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const MAX_CATEGORIES = 3;

export function StepEventDetails({ register, control, errors }: StepDetailsProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleSubcategory = (
    subFieldValue: Record<number, number[]> | undefined,
    onChange: (...event: unknown[]) => void,
    categoryCode: number,
    subCode: number
  ) => {
    const current = subFieldValue?.[categoryCode] ?? [];
    const newSet = current.includes(subCode)
      ? current.filter((s) => s !== subCode)
      : [...current, subCode];
    onChange({ ...subFieldValue, [categoryCode]: newSet });
  };

  const toggleAllSubs = (
    subFieldValue: Record<number, number[]> | undefined,
    onChange: (...event: unknown[]) => void,
    categoryCode: number
  ) => {
    const allSubs = subcategoriesMap[categoryCode].map((s) => s.code);
    const current = subFieldValue?.[categoryCode] ?? [];
    const allSelected = current.length === allSubs.length;
    onChange({ ...subFieldValue, [categoryCode]: allSelected ? [] : [...allSubs] });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="py-2 block">
          Organiser <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Organiser name" {...register("organiser")} />
        {errors.organiser && <p className="text-red-500 text-sm">{errors.organiser.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">
          Organisation number <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="XXXXXX-XXXX" {...register("organisationNumber")} />
        {errors.organisationNumber && (
          <p className="text-red-500 text-sm">{errors.organisationNumber.message}</p>
        )}
      </div>

      <div>
        <Label className="py-2 block">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Event Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Categories + Subcategories */}
      <div>
        <Label className="py-2 block">
          Select Categories <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-muted-foreground mb-3">
          Max {MAX_CATEGORIES} kategorier — klicka på en vald kategori för att öppna underkategorier
        </p>
        <Controller
          name="categories"
          control={control}
          render={({ field: catField }) => (
            <Controller
              name="subcategories"
              control={control}
              render={({ field: subField }) => {
                const selectedCount = (catField.value ?? []).length;
                const atLimit = selectedCount >= MAX_CATEGORIES;

                return (
                  <div className="flex flex-col space-y-4">
                    {Array.from({ length: Math.ceil(categoryOptions.length / 4) }).map(
                      (_, rowIdx) => {
                        const row = categoryOptions.slice(rowIdx * 4, rowIdx * 4 + 4);
                        const openInThisRow = row.some((cat) => cat.code === openDropdown);

                        return (
                          <div key={rowIdx} className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {row.map(({ code, label, icon: Icon }) => {
                                const isSelected = (catField.value ?? []).includes(code);

                                const handleClick = () => {
                                  if (isSelected) {
                                    if (openDropdown === code) {
                                      // Second click on open tile → deselect + close
                                      catField.onChange(
                                        (catField.value ?? []).filter((c) => c !== code)
                                      );
                                      setOpenDropdown(null);
                                    } else {
                                      // First click on selected tile → open dropdown
                                      setOpenDropdown(code);
                                    }
                                  } else if (!atLimit) {
                                    catField.onChange([...(catField.value ?? []), code]);
                                    setOpenDropdown(code);
                                  }
                                };

                                return (
                                  <button
                                    key={code}
                                    type="button"
                                    onClick={handleClick}
                                    disabled={!isSelected && atLimit}
                                    style={{
                                      backgroundColor: CATEGORY_COLORS[code],
                                      boxShadow: isSelected
                                        ? `0 0 0 3px white, 0 0 0 6px ${CATEGORY_COLORS[code]}`
                                        : "none",
                                      opacity: !isSelected && atLimit ? 0.35 : 1,
                                    }}
                                    className={cn(
                                      "flex flex-col items-center justify-center p-4 rounded-xl w-full h-24 border-0 transition-all text-white",
                                      !isSelected && atLimit ? "cursor-not-allowed" : ""
                                    )}
                                  >
                                    <Icon className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-medium text-center">
                                      {label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {openInThisRow && openDropdown !== null && (
                              <div className="w-full bg-white border rounded-lg p-4 shadow">
                                <p className="text-sm font-semibold mb-2 text-gray-700">
                                  {categoryOptions.find((c) => c.code === openDropdown)?.label}{" "}
                                  Subcategories
                                </p>
                                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto scroll-smooth p-1.5">
                                  {subcategoriesMap[openDropdown]?.map(
                                    ({ code: subCode, label: subLabel }) => {
                                      const selected =
                                        subField.value?.[openDropdown]?.includes(subCode) ?? false;
                                      const catColor = CATEGORY_COLORS[openDropdown];
                                      return (
                                        <button
                                          key={subCode}
                                          type="button"
                                          onClick={() =>
                                            toggleSubcategory(
                                              subField.value,
                                              subField.onChange,
                                              openDropdown,
                                              subCode
                                            )
                                          }
                                          style={{
                                            backgroundColor: catColor,
                                            boxShadow: selected
                                              ? `0 0 0 2px white, 0 0 0 4px ${catColor}`
                                              : "none",
                                            opacity: selected ? 1 : 0.65,
                                          }}
                                          className={cn(
                                            "px-3 py-1.5 text-xs border-0 rounded-full transition text-white",
                                            selected ? "font-medium" : ""
                                          )}
                                        >
                                          {subLabel}
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                                <div className="flex justify-center mt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="text-sm font-semibold px-6 py-2 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                                    onClick={() =>
                                      toggleAllSubs(
                                        subField.value,
                                        subField.onChange,
                                        openDropdown
                                      )
                                    }
                                  >
                                    {subField.value?.[openDropdown]?.length ===
                                    subcategoriesMap[openDropdown]?.length
                                      ? "Unselect All"
                                      : "Select All"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                    {atLimit && (
                      <p className="text-xs text-amber-600 font-medium">
                        Max {MAX_CATEGORIES} kategorier valda — avmarkera en för att välja en annan
                      </p>
                    )}
                  </div>
                );
              }}
            />
          )}
        />
      </div>

      {/* Filters */}
      <div>
        <Label className="py-2 block">Filters</Label>
        <Controller
          name="filters"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filterOptions.map(({ code, label, icon }) => {
                const isSelected = (field.value ?? []).includes(code);

                const toggle = () => {
                  const newVal = isSelected
                    ? (field.value ?? []).filter((f: number) => f !== code)
                    : [...(field.value ?? []), code];
                  field.onChange(newVal);
                };

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={toggle}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl w-full h-24 border transition-all text-sm font-medium",
                      isSelected
                        ? "bg-yellow-400 text-black border-yellow-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    {icon}
                    <span className="text-center text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Description & URLs */}
      <div>
        <Label className="py-2 block">Description</Label>
        <Textarea placeholder="Event Description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Event URL</Label>
        <Input placeholder="https://event-link.com" {...register("eventUrl")} />
        {errors.eventUrl && <p className="text-red-500 text-sm">{errors.eventUrl.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Booking URL</Label>
        <Input placeholder="https://booking-link.com" {...register("bookingUrl")} />
        {errors.bookingUrl && <p className="text-red-500 text-sm">{errors.bookingUrl.message}</p>}
      </div>
      <p className="text-xs text-muted-foreground italic">* Not all fields above are required</p>
    </div>
  );
}
