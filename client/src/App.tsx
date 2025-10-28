import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import InfoLogPage from "./pages/InfoLogPage";
import HousesPage from "./pages/HousesPage";
import MembersPage from "./pages/MembersPage";
import ActiveMembersPage from "./pages/ActiveMembersPage";
import ExpiredMembersPage from "./pages/ExpiredMembersPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/infolog"} component={InfoLogPage} />
      <Route path={"/houses"} component={HousesPage} />
      <Route path={"/members"} component={MembersPage} />
      <Route path={"/active-members"} component={ActiveMembersPage} />
      <Route path={"/expired-members"} component={ExpiredMembersPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
