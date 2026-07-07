import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, FieldErrors, UseFormRegister, Control, useFormContext } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { useState, useEffect, type MouseEvent } from "react";
import { categoryOptions, filterOptions, subcategoriesMap, CATEGORY_COLORS } from "@/lib/content/contentText";
import { SpotlightImageUpload } from "@/components/forms/SpotlightImageUpload";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const MAX_CATEGORIES = 3;

export function StepEventDetails({ register, control, errors }: StepDetailsProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [orgNrLocked, setOrgNrLocked] = useState(false);
  const { setValue, clearErrors } = useFormContext<FormData>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as Record<string, unknown>;
      const orgNr = payload.organisationNumber as string | undefined;
      if (orgNr) {
        setValue("organisationNumber", orgNr, { shouldValidate: false, shouldDirty: false });
        clearErrors("organisationNumber");
        setOrgNrLocked(true);
      }
    } catch {}
  }, [setValue, clearErrors]);

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
          Arrangör <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Arrangörens namn" {...register("organiser")} />
        {errors.organiser && <p className="text-red-500 text-sm">{errors.organiser.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">
          Organisationsnummer <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="XXXXXX-XXXX"
          {...register("organisationNumber")}
          readOnly={orgNrLocked}
          className={orgNrLocked ? "bg-gray-100 cursor-default select-none" : ""}
        />
        {orgNrLocked && (
          <p className="text-xs text-muted-foreground mt-1">Hämtad från ditt konto</p>
        )}
        {errors.organisationNumber && (
          <p className="text-red-500 text-sm">{errors.organisationNumber.message}</p>
        )}
      </div>

      <div>
        <Label className="py-2 block">
          Titel <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Evenemangets titel" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Categories + Subcategories */}
      <div>
        <Label className="py-2 block">
          Välj kategorier <span className="text-red-500">*</span>
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
                                const color = CATEGORY_COLORS[code] ?? "#888888";

                                const handleClick = () => {
                                  if (isSelected) {
                                    // Toggle dropdown only — never deselect on tile click
                                    setOpenDropdown(openDropdown === code ? null : code);
                                  } else if (!atLimit) {
                                    catField.onChange([...(catField.value ?? []), code]);
                                    setOpenDropdown(code);
                                  }
                                };

                                const handleDeselect = (e: MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  catField.onChange(
                                    (catField.value ?? []).filter((c) => c !== code)
                                  );
                                  if (openDropdown === code) setOpenDropdown(null);
                                };

                                return (
                                  <div key={code} className="relative w-full">
                                    <button
                                      type="button"
                                      onClick={handleClick}
                                      disabled={!isSelected && atLimit}
                                      style={{
                                        backgroundColor: color,
                                        boxShadow: isSelected
                                          ? `0 0 0 3px white, 0 0 0 6px ${color}`
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
                                    {isSelected && (
                                      <button
                                        type="button"
                                        onClick={handleDeselect}
                                        className="absolute top-1 right-1 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-white text-xs leading-none hover:bg-white/50 transition-colors"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {openInThisRow && openDropdown !== null && (
                              <div className="w-full bg-white border rounded-lg p-4 shadow">
                                <p className="text-sm font-semibold mb-2 text-gray-700">
                                  {categoryOptions.find((c) => c.code === openDropdown)?.label}{" "}
                                  Underkategorier
                                </p>
                                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto scroll-smooth p-1.5">
                                  {subcategoriesMap[openDropdown]?.map(
                                    ({ code: subCode, label: subLabel }) => {
                                      const selected =
                                        subField.value?.[openDropdown]?.includes(subCode) ?? false;
                                      const catColor = CATEGORY_COLORS[openDropdown] ?? "#888888";
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
                                    onClick={() => {
                                      toggleAllSubs(
                                        subField.value,
                                        subField.onChange,
                                        openDropdown
                                      );
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {subField.value?.[openDropdown]?.length ===
                                    subcategoriesMap[openDropdown]?.length
                                      ? "Avmarkera alla"
                                      : "Välj alla"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
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
        <Label className="py-2 block">Filter</Label>
        <Controller
          name="filters"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(({ code, label }) => {
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
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                      isSelected
                        ? "bg-[#F3C10E] text-black border-[#F3C10E]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Description & URLs */}
      <div>
        <Label className="py-2 block">
          Beskrivning <span className="text-red-500">*</span>
        </Label>
        <Textarea placeholder="Beskrivning av evenemanget" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Evenemangslänk</Label>
        <Input placeholder="https://event-link.com" {...register("eventUrl")} />
        {errors.eventUrl && <p className="text-red-500 text-sm">{errors.eventUrl.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Bokningslänk</Label>
        <Input placeholder="https://booking-link.com" {...register("bookingUrl")} />
        {errors.bookingUrl && <p className="text-red-500 text-sm">{errors.bookingUrl.message}</p>}
      </div>

      <SpotlightImageUpload />
    </div>
  );
}
