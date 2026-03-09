"use client";

import { useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { HomeScreen } from "./screens/HomeScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { EventDetailScreen } from "./screens/EventDetailScreen";

type Screen =
  | { type: "home"; tagCodes: number[]; selectedCategories: number[] }
  | { type: "results"; categoryCode: number; tagCodes: number[]; showMap: boolean }
  | { type: "detail"; eventId: string; fromCategory: number; tagCodes: number[] };

export function AppPreview() {
  const [screen, setScreen] = useState<Screen>({
    type: "home",
    tagCodes: [],
    selectedCategories: [],
  });

  // Shared filter state (persists across screens like the Expo app's FilterContext)
  const [searchText, setSearchText] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleTagsChange = (newTagCodes: number[]) => {
    setScreen((prev) => ({ ...prev, tagCodes: newTagCodes }));
  };

  const handleToggleCity = (city: string) => {
    setCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const handleDateRange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <PhoneFrame>
      {screen.type === "home" && (
        <HomeScreen
          tagCodes={screen.tagCodes}
          selectedCategories={screen.selectedCategories}
          searchText={searchText}
          cities={cities}
          startDate={startDate}
          endDate={endDate}
          onSearchChange={setSearchText}
          onToggleCity={handleToggleCity}
          onSetCities={setCities}
          onDateRange={handleDateRange}
          onTagsChange={handleTagsChange}
          onToggleCategory={(code) => {
            setScreen((prev) => {
              if (prev.type !== "home") return prev;
              const cats = prev.selectedCategories.includes(code)
                ? prev.selectedCategories.filter((c) => c !== code)
                : [...prev.selectedCategories, code];
              return { ...prev, selectedCategories: cats };
            });
          }}
          onGoDo={(categoryCodes) =>
            setScreen({
              type: "results",
              categoryCode: categoryCodes[0] ?? 1,
              tagCodes: screen.tagCodes,
              showMap: false,
            })
          }
          onSelectEvent={(eventId, categoryCode) =>
            setScreen({
              type: "detail",
              eventId,
              fromCategory: categoryCode,
              tagCodes: screen.tagCodes,
            })
          }
        />
      )}

      {screen.type === "results" && (
        <ResultsScreen
          categoryCode={screen.categoryCode}
          tagCodes={screen.tagCodes}
          showMap={screen.showMap}
          searchText={searchText}
          cities={cities}
          startDate={startDate}
          endDate={endDate}
          onToggleMap={() =>
            setScreen((prev) =>
              prev.type === "results" ? { ...prev, showMap: !prev.showMap } : prev,
            )
          }
          onTagsChange={handleTagsChange}
          onBack={() =>
            setScreen({ type: "home", tagCodes: screen.tagCodes, selectedCategories: [] })
          }
          onSelectEvent={(eventId) =>
            setScreen({
              type: "detail",
              eventId,
              fromCategory: screen.categoryCode,
              tagCodes: screen.tagCodes,
            })
          }
        />
      )}

      {screen.type === "detail" && (
        <EventDetailScreen
          eventId={screen.eventId}
          onBack={() =>
            setScreen({
              type: "results",
              categoryCode: screen.fromCategory,
              tagCodes: screen.tagCodes,
              showMap: false,
            })
          }
        />
      )}
    </PhoneFrame>
  );
}
