"use client";

/**
 * AppPreview — root state machine for the phone preview mockup.
 *
 * Layered state:
 *   activeTab: home | favorites | profile  (preserved across switches)
 *   homeStack: home → results → detail      (only on the home tab)
 *   modal:     login prompt, etc.           (sits above all tabs)
 *
 * The bottom tab bar is hidden on the event-detail screen to give it the
 * immersive feel from MobileApp (where event detail is a modal-style route
 * pushed above the tabs).
 */

import { useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { TabBar, type Tab } from "./components/TabBar";
import { LoginPromptModal } from "./components/LoginPromptModal";
import { HomeScreen } from "./screens/HomeScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { EventDetailScreen } from "./screens/EventDetailScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

type HomeStack =
  | { type: "home"; tagCodes: number[]; selectedCategories: number[] }
  | { type: "results"; categoryCode: number; tagCodes: number[]; showMap: boolean }
  | { type: "detail"; eventId: string; fromCategory: number; tagCodes: number[] };

type ModalState = null | { type: "loginPrompt" };

export function AppPreview() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [homeStack, setHomeStack] = useState<HomeStack>({
    type: "home",
    tagCodes: [],
    selectedCategories: [],
  });
  const [modal, setModal] = useState<ModalState>(null);

  // Shared filter state (persists across screens like the Expo app's FilterContext)
  const [searchText, setSearchText] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleTagsChange = (newTagCodes: number[]) => {
    setHomeStack((prev) => ({ ...prev, tagCodes: newTagCodes }));
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

  // Tab bar hides on event detail (immersive); shows on every other screen
  const showTabBar = !(activeTab === "home" && homeStack.type === "detail");

  // When switching tabs, return the home tab to the home stack root so
  // entering favorites/profile then coming back doesn't strand the user
  // mid-results. (MobileApp does the same — tab press resets the stack.)
  const switchTab = (tab: Tab) => {
    if (tab === "home" && activeTab === "home") {
      setHomeStack({ type: "home", tagCodes: homeStack.tagCodes, selectedCategories: [] });
    }
    setActiveTab(tab);
  };

  const showLoginPrompt = () => setModal({ type: "loginPrompt" });
  const closeModal = () => setModal(null);

  return (
    <PhoneFrame
      bottomBar={
        showTabBar ? <TabBar active={activeTab} onChange={switchTab} /> : undefined
      }
      overlay={
        <LoginPromptModal
          visible={modal?.type === "loginPrompt"}
          onClose={closeModal}
          onLogin={closeModal}
          onRegister={closeModal}
        />
      }
    >
      {activeTab === "home" && homeStack.type === "home" && (
        <HomeScreen
          tagCodes={homeStack.tagCodes}
          selectedCategories={homeStack.selectedCategories}
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
            setHomeStack((prev) => {
              if (prev.type !== "home") return prev;
              const cats = prev.selectedCategories.includes(code)
                ? prev.selectedCategories.filter((c) => c !== code)
                : [...prev.selectedCategories, code];
              return { ...prev, selectedCategories: cats };
            });
          }}
          onGoDo={(categoryCodes) =>
            setHomeStack({
              type: "results",
              categoryCode: categoryCodes[0] ?? 1,
              tagCodes: homeStack.tagCodes,
              showMap: false,
            })
          }
          onSelectEvent={(eventId, categoryCode) =>
            setHomeStack({
              type: "detail",
              eventId,
              fromCategory: categoryCode,
              tagCodes: homeStack.tagCodes,
            })
          }
        />
      )}

      {activeTab === "home" && homeStack.type === "results" && (
        <ResultsScreen
          categoryCode={homeStack.categoryCode}
          tagCodes={homeStack.tagCodes}
          showMap={homeStack.showMap}
          searchText={searchText}
          cities={cities}
          startDate={startDate}
          endDate={endDate}
          onToggleMap={() =>
            setHomeStack((prev) =>
              prev.type === "results" ? { ...prev, showMap: !prev.showMap } : prev,
            )
          }
          onTagsChange={handleTagsChange}
          onBack={() =>
            setHomeStack({
              type: "home",
              tagCodes: homeStack.tagCodes,
              selectedCategories: [],
            })
          }
          onSelectEvent={(eventId) =>
            setHomeStack({
              type: "detail",
              eventId,
              fromCategory: homeStack.categoryCode,
              tagCodes: homeStack.tagCodes,
            })
          }
        />
      )}

      {activeTab === "home" && homeStack.type === "detail" && (
        <EventDetailScreen
          eventId={homeStack.eventId}
          onBack={() =>
            setHomeStack({
              type: "results",
              categoryCode: homeStack.fromCategory,
              tagCodes: homeStack.tagCodes,
              showMap: false,
            })
          }
        />
      )}

      {activeTab === "favorites" && (
        <FavoritesScreen onLoginPrompt={showLoginPrompt} />
      )}

      {activeTab === "profile" && (
        <ProfileScreen onLogin={showLoginPrompt} onRegister={showLoginPrompt} />
      )}
    </PhoneFrame>
  );
}
