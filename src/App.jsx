import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import NavBar from "./components/NavBar.jsx";

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <>
      {/* <Nav /> */}
      <NavBar />
      <div className="max-w-4xl mx-auto site-border">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/projects"
              element={
                <Page>
                  <Projects />
                </Page>
              }
            />
            <Route
              path="/services"
              element={
                <Page>
                  <Services />
                </Page>
              }
            />
            <Route
              path="/about"
              element={
                <Page>
                  <About />
                </Page>
              }
            />
            <Route
              path="/contact"
              element={
                <Page>
                  <Contact />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <footer className="container-px mx-auto opacity-70 text-sm border-b border-t border-neutral-200/60">
        <p className="container-px max-w-4xl mx-auto h-20 text-center site-border">
          Built with React, Tailwind v4 & Framer Motion.
        </p>
      </footer>
    </>
  );
}
