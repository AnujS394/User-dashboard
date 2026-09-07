import { useState } from "react";
import type { Screen } from "./types";
import { MarketplaceProvider } from "./state/MarketplaceContext";
import { AuthProvider, useAuth } from "./state/AuthContext";
import BottomNav from "./components/BottomNav";

// Main screens
import HomeScreen from "./screens/HomeScreen";
import ShopScreen from "./screens/ShopScreen";
import MarketplaceListScreen from "./screens/MarketplaceListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import EmiDuesScreen from "./screens/EmiDuesScreen";
import EmiCalculatorScreen from "./screens/EmiCalculatorScreen";
import LimitScreen from "./screens/LimitScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignInScreen from "./screens/SignInScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentSuccessScreen from "./screens/PaymentSuccessScreen";

// Profile sub-screens
import PersonalDetailsScreen from "./screens/profile/PersonalDetailsScreen";
import BankAccountScreen from "./screens/profile/BankAccountScreen";
import MutualFundScreen from "./screens/profile/MutualFundScreen";
import KYCScreen from "./screens/profile/KYCScreen";
import NotificationsScreen from "./screens/profile/NotificationsScreen";
import SecurityScreen from "./screens/profile/SecurityScreen";
import HelpScreen from "./screens/profile/HelpScreen";
import TermsScreen from "./screens/profile/TermsScreen";

const HIDE_NAV: Screen["name"][] = ["sign-in", "payment", "payment-success"];
const PROFILE_SCREENS: Screen["name"][] = [
  "profile-personal", "profile-bank", "profile-mf", "profile-kyc",
  "profile-notifications", "profile-security", "profile-help", "profile-terms",
];

function AppInner() {
  const { isLoggedIn } = useAuth();
  const [screen, setScreen] = useState<Screen>(isLoggedIn ? { name: "home" } : { name: "sign-in" });

  function navigate(s: Screen) {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bottom nav active state
  const navName: Screen["name"] =
    screen.name === "marketplace" || screen.name === "product" ? "shop" :
    screen.name === "emi-calculator" ? "home" :
    PROFILE_SCREENS.includes(screen.name) ? "profile" :
    screen.name;

  const showNav = !HIDE_NAV.includes(screen.name);

  return (
    <div className={`relative min-h-full max-w-md mx-auto bg-bg overflow-x-hidden ${showNav ? "pb-19" : ""}`}>
      <div key={screen.name === "product" ? `product-${(screen as any).productId}` : screen.name} className="screen-enter">
        {screen.name === "sign-in" && <SignInScreen navigate={navigate} />}
        {screen.name === "home" && <HomeScreen navigate={navigate} />}
        {screen.name === "shop" && <ShopScreen navigate={navigate} initialTab={(screen as any).initialTab} />}
        {screen.name === "marketplace" && <MarketplaceListScreen navigate={navigate} brandId={(screen as any).brandId} initialCategory={(screen as any).category} />}
        {screen.name === "product" && <ProductDetailScreen productId={(screen as any).productId} navigate={navigate} />}
        {screen.name === "emi-dues" && <EmiDuesScreen navigate={navigate} />}
        {screen.name === "emi-calculator" && <EmiCalculatorScreen navigate={navigate} />}
        {screen.name === "limit" && <LimitScreen navigate={navigate} />}
        {screen.name === "profile" && <ProfileScreen navigate={navigate} />}
        {screen.name === "payment" && <PaymentScreen order={(screen as any).order} navigate={navigate} />}
        {screen.name === "payment-success" && <PaymentSuccessScreen order={(screen as any).order} navigate={navigate} />}
        {screen.name === "profile-personal" && <PersonalDetailsScreen navigate={navigate} />}
        {screen.name === "profile-bank" && <BankAccountScreen navigate={navigate} />}
        {screen.name === "profile-mf" && <MutualFundScreen navigate={navigate} />}
        {screen.name === "profile-kyc" && <KYCScreen navigate={navigate} />}
        {screen.name === "profile-notifications" && <NotificationsScreen navigate={navigate} />}
        {screen.name === "profile-security" && <SecurityScreen navigate={navigate} />}
        {screen.name === "profile-help" && <HelpScreen navigate={navigate} />}
        {screen.name === "profile-terms" && <TermsScreen navigate={navigate} />}
      </div>

      {/* ── Bottom nav ───────────────────────────── */}
      {showNav && <BottomNav current={navName} navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <AppInner />
      </MarketplaceProvider>
    </AuthProvider>
  );
}
