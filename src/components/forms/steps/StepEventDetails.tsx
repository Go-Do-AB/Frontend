import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { useState } from "react";
import { categoryOptions, filterOptions, subcategoriesMap } from "@/lib/content/contentText";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

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
        <Controller
          name="categories"
          control={control}
          render={({ field: catField }) => (
            <Controller
              name="subcategories"
              control={control}
              render={({ field: subField }) => (
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

                              const toggleCategory = () => {
                                const current = catField.value ?? [];
                                const newVal = isSelected
                                  ? current.filter((c) => c !== code)
                                  : [...current, code];
                                catField.onChange(newVal);
                                setOpenDropdown((prev) => (prev === code ? null : code));
                              };

                              return (
                                <button
                                  key={code}
                                  type="button"
                                  onClick={toggleCategory}
                                  className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl w-full h-24 border transition-all",
                                    isSelected
                                      ? "bg-yellow-400 text-black border-yellow-600"
                                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                  )}
                                >
                                  <Icon className="w-6 h-6 mb-2" />
                                  <span className="text-xs font-medium text-center">{label}</span>
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
                              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scroll-smooth">
                                {subcategoriesMap[openDropdown]?.map(
                                  ({ code: subCode, label: subLabel, icon: SubIcon }) => {
                                    const selected =
                                      subField.value?.[openDropdown]?.includes(subCode) ?? false;
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
                                        className={cn(
                                          "flex flex-col items-center justify-center w-20 h-20 text-xs border rounded-lg transition p-2",
                                          selected
                                            ? "bg-yellow-300 border-yellow-500"
                                            : "bg-white hover:bg-gray-100 border-gray-300"
                                        )}
                                      >
                                        <SubIcon className="w-4 h-4 mb-1" />
                                        <span className="text-center">{subLabel}</span>
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="text-sm font-semibold px-6 py-2 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() =>
                                    toggleAllSubs(subField.value, subField.onChange, openDropdown)
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
                </div>
              )}
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
