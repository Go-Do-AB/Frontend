"use client";

import { useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { HomeScreen } from "./screens/HomeScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { EventDetailScreen } from "./screens/EventDetailScreen";

type Screen =
  | { type: "home"; tagCodes: number[] }
  | { type: "results"; categoryCode: number; tagCodes: number[] }
  | { type: "detail"; eventId: string; fromCategory: number; tagCodes: number[] };

export function AppPreview() {
  const [screen, setScreen] = useState<Screen>({ type: "home", tagCodes: [] });

  const handleTagsChange = (newTagCodes: number[]) => {
    setScreen((prev) => ({ ...prev, tagCodes: newTagCodes }));
  };

  return (
    <PhoneFrame>
      {screen.type === "home" && (
        <HomeScreen
          tagCodes={screen.tagCodes}
          onTagsChange={handleTagsChange}
          onSelectCategory={(code) =>
            setScreen({ type: "results", categoryCode: code, tagCodes: screen.tagCodes })
          }
          onSelectEvent={(eventId, categoryCode) =>
            setScreen({ type: "detail", eventId, fromCategory: categoryCode, tagCodes: screen.tagCodes })
          }
        />
      )}

      {screen.type === "results" && (
        <ResultsScreen
          categoryCode={screen.categoryCode}
          tagCodes={screen.tagCodes}
          onTagsChange={handleTagsChange}
          onBack={() => setScreen({ type: "home", tagCodes: screen.tagCodes })}
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
            })
          }
        />
      )}
    </PhoneFrame>
  );
}
