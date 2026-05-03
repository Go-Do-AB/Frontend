"use client";

/**
 * AppPreview — root state machine for the phone preview mockup.
 *
 * Layered state:
 *   activeTab: home | favorites | profile  (preserved across switches)
 *   homeStack: home → results → detail      (only on the home tab)
 *   authRoute: login | register             (fullscreen above tabs)
 *   modal:     login prompt, etc.           (sits above all tabs + auth)
 *
 * The bottom tab bar is hidden on the event-detail screen to give it the
 * immersive feel from MobileApp (where event detail is a modal-style route
 * pushed above the tabs). Auth screens keep the tab bar visible to mirror
 * MobileApp's `(tabs)/login.tsx` re-export pattern.
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
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";

type HomeStack =
  | { type: "home"; tagCodes: number[]; selectedCategories: number[] }
  | { type: "results"; categoryCode: number; tagCodes: number[]; showMap: boolean }
  | { type: "detail"; eventId: string; fromCategory: number; tagCodes: number[] };

type ModalState = null | { type: "loginPrompt" };
type AuthRoute = null | "login" | "register";

export function AppPreview() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [homeStack, setHomeStack] = useState<HomeStack>({
    type: "home",
    tagCodes: [],
    selectedCategories: [],
  });
  const [modal, setModal] = useState<ModalState>(null);
  const [authRoute, setAuthRoute] = useState<AuthRoute>(null);

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
  // Any tab switch also dismisses an active auth route.
  const switchTab = (tab: Tab) => {
    if (tab === "home" && activeTab === "home") {
      setHomeStack({ type: "home", tagCodes: homeStack.tagCodes, selectedCategories: [] });
    }
    if (authRoute !== null) setAuthRoute(null);
    setActiveTab(tab);
  };

  const showLoginPrompt = () => setModal({ type: "loginPrompt" });
  const closeModal = () => setModal(null);

  const openLogin = () => {
    setModal(null);
    setAuthRoute("login");
  };
  const openRegister = () => {
    setModal(null);
    setAuthRoute("register");
  };
  const closeAuth = () => setAuthRoute(null);

  return (
    <PhoneFrame
      bottomBar={
        showTabBar ? <TabBar active={activeTab} onChange={switchTab} /> : undefined
      }
      overlay={
        <LoginPromptModal
          visible={modal?.type === "loginPrompt"}
          onClose={closeModal}
          onLogin={openLogin}
          onRegister={openRegister}
        />
      }
    >
      {/* Auth route takes the whole content area when active */}
      {authRoute === "login" && (
        <LoginScreen
          onBack={closeAuth}
          onSwitchToRegister={() => setAuthRoute("register")}
          onSuccess={closeAuth}
        />
      )}
      {authRoute === "register" && (
        <RegisterScreen
          onBack={closeAuth}
          onSwitchToLogin={() => setAuthRoute("login")}
          onSuccess={closeAuth}
        />
      )}

      {/* Tab content (only when not in an auth route) */}
      {authRoute === null && activeTab === "home" && homeStack.type === "home" && (
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

      {authRoute === null && activeTab === "home" && homeStack.type === "results" && (
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

      {authRoute === null && activeTab === "home" && homeStack.type === "detail" && (
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

      {authRoute === null && activeTab === "favorites" && (
        <FavoritesScreen onLoginPrompt={showLoginPrompt} />
      )}

      {authRoute === null && activeTab === "profile" && (
        <ProfileScreen onLogin={openLogin} onRegister={openRegister} />
      )}
    </PhoneFrame>
  );
}
