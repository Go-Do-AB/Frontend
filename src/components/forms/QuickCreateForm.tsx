"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, MapPin, FileText, Tag, Link2, Building2 } from "lucide-react";
import { QuickCreateFormData } from "@/lib/validation/quick-create-schema";
import { subcategoriesMap, categoryOptions, filterOptions } from "@/lib/content/contentText";

interface QuickCreateFormProps {
  form: UseFormReturn<QuickCreateFormData>;
  onSubmit: (data: QuickCreateFormData) => void;
  isLoading?: boolean;
}

export function QuickCreateForm({ form, onSubmit, isLoading }: QuickCreateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedSubcategories = watch("subcategoryCodes") || [];
  const selectedFilters = watch("filterCodes") || [];

  // Get all subcategories flattened for display
  const allSubcategories = Object.entries(subcategoriesMap).flatMap(([catCode, subs]) => {
    const category = categoryOptions.find((c) => c.code === Number(catCode));
    return subs.map((sub) => ({
      ...sub,
      categoryName: category?.label || "",
      categoryCode: Number(catCode),
    }));
  });

  const handleSubcategoryToggle = (code: number) => {
    const current = selectedSubcategories;
    const updated = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    setValue("subcategoryCodes", updated);
  };

  const handleFilterToggle = (code: number) => {
    const current = selectedFilters;
    const updated = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    setValue("filterCodes", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info Section */}
      <Card className="bg-white border-black/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Building2 className="w-5 h-5" />
            <span>Basic Info</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Place/Attraction Name</Label>
              <Input
                id="name"
                placeholder="e.g., Helsingborg Castle"
                {...register("name")}
                className="bg-white"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organiserName">Owner/Organiser</Label>
              <Input
                id="organiserName"
                placeholder="e.g., City of Helsingborg"
                {...register("organiserName")}
                className="bg-white"
              />
              {errors.organiserName && (
                <p className="text-red-500 text-sm">{errors.organiserName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organisationNumber">Organisation Number</Label>
              <Input
                id="organisationNumber"
                placeholder="e.g., 556677-8899"
                {...register("organisationNumber")}
                className="bg-white"
              />
              {errors.organisationNumber && (
                <p className="text-red-500 text-sm">{errors.organisationNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="readMoreUrl">Website URL</Label>
              <Input
                id="readMoreUrl"
                placeholder="https://..."
                {...register("readMoreUrl")}
                className="bg-white"
              />
              {errors.readMoreUrl && (
                <p className="text-red-500 text-sm">{errors.readMoreUrl.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card className="bg-white border-black/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="place">City/Place</Label>
              <Input
                id="place"
                placeholder="e.g., Helsingborg"
                {...register("place")}
                className="bg-white"
              />
              {errors.place && <p className="text-red-500 text-sm">{errors.place.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="e.g., Slottshagen 1"
                {...register("address")}
                className="bg-white"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
              <Input
                id="gpsCoordinates"
                placeholder="e.g., 56.0465, 12.6945"
                {...register("gpsCoordinates")}
                className="bg-white"
              />
              {errors.gpsCoordinates && (
                <p className="text-red-500 text-sm">{errors.gpsCoordinates.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card className="bg-white border-black/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <FileText className="w-5 h-5" />
            <span>Description</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the place or attraction..."
              rows={4}
              {...register("description")}
              className="bg-white resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card className="bg-white border-black/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Tag className="w-5 h-5" />
            <span>Categories</span>
          </div>

          <div className="space-y-4">
            <Label>Select Subcategories (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {allSubcategories.map((sub) => (
                <Button
                  key={sub.code}
                  type="button"
                  variant={selectedSubcategories.includes(sub.code) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubcategoryToggle(sub.code)}
                  className={
                    selectedSubcategories.includes(sub.code)
                      ? "bg-black text-white"
                      : "border-black/20 hover:bg-gray-100"
                  }
                >
                  {sub.label}
                </Button>
              ))}
            </div>
            {selectedSubcategories.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected: {selectedSubcategories.length} subcategories
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card className="bg-white border-black/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Zap className="w-5 h-5" />
            <span>Filters</span>
          </div>

          <div className="space-y-4">
            <Label>Select Filters (optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.code}
                  type="button"
                  variant={selectedFilters.includes(filter.code) ? "default" : "outline"}
                  onClick={() => handleFilterToggle(filter.code)}
                  className={`h-auto py-3 flex flex-col items-center gap-1 ${
                    selectedFilters.includes(filter.code)
                      ? "bg-black text-white"
                      : "border-black/20 hover:bg-gray-100"
                  }`}
                >
                  {filter.icon}
                  <span className="text-xs">{filter.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white hover:bg-black/90 h-12 text-lg font-semibold"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span> Creating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" /> Quick Create
          </span>
        )}
      </Button>
    </form>
  );
}
