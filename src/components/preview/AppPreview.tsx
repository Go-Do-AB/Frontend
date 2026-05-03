"use client";

/**
 * AppPreview — root state machine for the phone preview mockup.
 *
 * Layered state:
 *   activeTab:    home | favorites | profile        (preserved across switches)
 *   homeStack:    home → results → detail            (only on the home tab)
 *   profileStack: lists | list-detail | near-me | subscription   (above tab)
 *   authRoute:    login | register                   (fullscreen above tabs)
 *   modal:        login prompt, premium prompt, etc. (above all)
 *
 * Tab bar visibility:
 *   - Hidden on event detail (immersive)
 *   - Visible on every other surface (incl. auth + profile sub-screens)
 *
 * Mock account state (signedIn / favoriteIds / lists / isPremium) lives
 * here too so toggling sign-in flips Profile + Favorites cohesively. No
 * real auth / API.
 */

import { useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { TabBar, type Tab } from "./components/TabBar";
import { LoginPromptModal } from "./components/LoginPromptModal";
import { CreateListModal } from "./components/CreateListModal";
import { NearMePremiumPromptModal } from "./components/NearMePremiumPromptModal";
import { HomeScreen } from "./screens/HomeScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { EventDetailScreen } from "./screens/EventDetailScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { ListsScreen, type MockList } from "./screens/ListsScreen";
import { ListDetailScreen } from "./screens/ListDetailScreen";
import { NearMeScreen } from "./screens/NearMeScreen";
import { SubscriptionScreen } from "./screens/SubscriptionScreen";

type HomeStack =
  | { type: "home"; tagCodes: number[]; selectedCategories: number[] }
  | { type: "results"; categoryCode: number; tagCodes: number[]; showMap: boolean }
  | { type: "detail"; eventId: string; fromCategory: number; tagCodes: number[] };

type ModalState =
  | null
  | { type: "loginPrompt" }
  | { type: "createList" }
  | { type: "nearMePremium" };
type AuthRoute = null | "login" | "register";
type ProfileRoute =
  | null
  | { type: "lists" }
  | { type: "list-detail"; listId: string }
  | { type: "near-me" }
  | { type: "subscription" };

const MOCK_USER = { initials: "A", email: "anna@godo.nu" } as const;

const INITIAL_FAVORITE_IDS = [
  "mock-005",
  "mock-012",
  "mock-025",
  "mock-040",
];

const INITIAL_LISTS: MockList[] = [
  {
    id: "list-1",
    name: "Sommarfavoriter",
    eventIds: ["mock-003", "mock-008", "mock-015", "mock-022"],
  },
  {
    id: "list-2",
    name: "Med barnen",
    eventIds: ["mock-050", "mock-058"],
  },
];

export function AppPreview() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [homeStack, setHomeStack] = useState<HomeStack>({
    type: "home",
    tagCodes: [],
    selectedCategories: [],
  });
  const [modal, setModal] = useState<ModalState>(null);
  const [authRoute, setAuthRoute] = useState<AuthRoute>(null);
  const [profileRoute, setProfileRoute] = useState<ProfileRoute>(null);

  // Mock account state
  const [signedIn, setSignedIn] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(INITIAL_FAVORITE_IDS);
  const [lists, setLists] = useState<MockList[]>(INITIAL_LISTS);
  const [isPremium, setIsPremium] = useState(false);

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

  // Tab switch resets home stack root and dismisses any auth/profile route
  const switchTab = (tab: Tab) => {
    if (tab === "home" && activeTab === "home") {
      setHomeStack({ type: "home", tagCodes: homeStack.tagCodes, selectedCategories: [] });
    }
    if (authRoute !== null) setAuthRoute(null);
    if (profileRoute !== null) setProfileRoute(null);
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

  // Successful login/register flips signed-in state for the preview
  const onAuthSuccess = () => {
    setSignedIn(true);
    setAuthRoute(null);
  };

  const handleLogout = () => {
    setSignedIn(false);
    setIsPremium(false);
    setProfileRoute(null);
  };

  const openLists = () => setProfileRoute({ type: "lists" });
  const openSubscription = () => setProfileRoute({ type: "subscription" });
  const openNearMe = () => {
    if (!signedIn) {
      setModal({ type: "loginPrompt" });
      return;
    }
    if (!isPremium) {
      setModal({ type: "nearMePremium" });
      return;
    }
    setProfileRoute({ type: "near-me" });
  };
  const openListDetail = (listId: string) =>
    setProfileRoute({ type: "list-detail", listId });
  const closeProfileRoute = () => setProfileRoute(null);

  const removeFavorite = (id: string) =>
    setFavoriteIds((prev) => prev.filter((x) => x !== id));

  const createList = (name: string) => {
    setLists((prev) => [
      ...prev,
      { id: `list-${Date.now()}`, name, eventIds: [] },
    ]);
    setModal(null);
  };
  const deleteList = (id: string) =>
    setLists((prev) => prev.filter((l) => l.id !== id));

  // When opening an event from a profile-route screen, we want to leave the
  // route and route back through the home stack so the existing detail flow
  // (back goes to results) continues to work consistently.
  const openEventFromProfileRoute = (eventId: string) => {
    setProfileRoute(null);
    setActiveTab("home");
    setHomeStack({
      type: "detail",
      eventId,
      fromCategory: 1,
      tagCodes: homeStack.tagCodes,
    });
  };

  const profileRouteActive = profileRoute !== null;
  const authRouteActive = authRoute !== null;

  return (
    <PhoneFrame
      bottomBar={
        showTabBar ? <TabBar active={activeTab} onChange={switchTab} favoritesCount={favoriteIds.length} /> : undefined
      }
      overlay={
        <>
          <LoginPromptModal
            visible={modal?.type === "loginPrompt"}
            onClose={closeModal}
            onLogin={openLogin}
            onRegister={openRegister}
          />
          <CreateListModal
            visible={modal?.type === "createList"}
            onClose={closeModal}
            onCreate={createList}
          />
          <NearMePremiumPromptModal
            visible={modal?.type === "nearMePremium"}
            onClose={closeModal}
            onUpgrade={() => {
              setModal(null);
              setProfileRoute({ type: "subscription" });
            }}
          />
        </>
      }
    >
      {/* Auth route takes the whole content area when active */}
      {authRouteActive && authRoute === "login" && (
        <LoginScreen
          onBack={closeAuth}
          onSwitchToRegister={() => setAuthRoute("register")}
          onSuccess={onAuthSuccess}
        />
      )}
      {authRouteActive && authRoute === "register" && (
        <RegisterScreen
          onBack={closeAuth}
          onSwitchToLogin={() => setAuthRoute("login")}
          onSuccess={onAuthSuccess}
        />
      )}

      {/* Profile sub-routes (Lists, ListDetail, NearMe, Subscription) */}
      {!authRouteActive && profileRouteActive && profileRoute?.type === "lists" && (
        <ListsScreen
          isPremium={isPremium}
          lists={lists}
          onBack={closeProfileRoute}
          onCreate={() => setModal({ type: "createList" })}
          onSelectList={openListDetail}
          onDeleteList={deleteList}
          onUpgrade={() => setProfileRoute({ type: "subscription" })}
        />
      )}
      {!authRouteActive &&
        profileRouteActive &&
        profileRoute?.type === "list-detail" && (
          <ListDetailScreen
            list={
              lists.find((l) => l.id === profileRoute.listId) ?? {
                id: profileRoute.listId,
                name: "Lista",
                eventIds: [],
              }
            }
            onBack={() => setProfileRoute({ type: "lists" })}
            onSelectEvent={openEventFromProfileRoute}
          />
        )}
      {!authRouteActive && profileRouteActive && profileRoute?.type === "near-me" && (
        <NearMeScreen
          onBack={closeProfileRoute}
          onSelectEvent={openEventFromProfileRoute}
        />
      )}
      {!authRouteActive &&
        profileRouteActive &&
        profileRoute?.type === "subscription" && (
          <SubscriptionScreen
            isPremium={isPremium}
            onBack={closeProfileRoute}
            onUpgrade={() => setIsPremium(true)}
          />
        )}

      {/* Tab content (only when no overlay route is active) */}
      {!authRouteActive &&
        !profileRouteActive &&
        activeTab === "home" &&
        homeStack.type === "home" && (
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

      {!authRouteActive &&
        !profileRouteActive &&
        activeTab === "home" &&
        homeStack.type === "results" && (
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

      {!authRouteActive &&
        !profileRouteActive &&
        activeTab === "home" &&
        homeStack.type === "detail" && (
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

      {!authRouteActive && !profileRouteActive && activeTab === "favorites" && (
        <FavoritesScreen
          signedIn={signedIn}
          favoriteIds={favoriteIds}
          onLoginPrompt={showLoginPrompt}
          onRemove={removeFavorite}
          onSelectEvent={openEventFromProfileRoute}
        />
      )}

      {!authRouteActive && !profileRouteActive && activeTab === "profile" && (
        <ProfileScreen
          signedIn={signedIn}
          user={signedIn ? MOCK_USER : null}
          favoritesCount={favoriteIds.length}
          listsCount={lists.length}
          isPremium={isPremium}
          onLogin={openLogin}
          onRegister={openRegister}
          onLogout={handleLogout}
          onOpenSaved={() => setActiveTab("favorites")}
          onOpenLists={openLists}
          onOpenNearMe={openNearMe}
          onOpenSubscription={openSubscription}
        />
      )}
    </PhoneFrame>
  );
}
