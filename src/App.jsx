import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Eager load critical components (Menu + Home page)
import Menu from "./components/Menu/Menu";
import Home from "./pages/Home/Home";

// Lazy load non-critical routes for better code splitting
const About = lazy(() => import("./pages/About/About"));
const FAQ = lazy(() => import("./pages/FAQ/FAQ"));
const Contact = lazy(() => import("./pages/Contact/Contact"));

import "./App.css";

/**
 * Loading fallback for lazy-loaded routes
 */
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#fffaed',
    }}>
      <div style={{
        fontSize: '1.5rem',
        color: '#333',
      }}>
        Loading...
      </div>
    </div>
  );
}

/**
 * Scroll to top on route change with delay for page transitions
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1400);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Menu />
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
