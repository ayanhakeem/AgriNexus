import React, { useState, useEffect } from "react";
import {
  useUser,
  SignOutButton,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/new_logo2.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Logo component with updated styling
const Logo = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src={logo} alt="logo" className="h-10 w-auto" />
      <div className="font-bold flex">
        <motion.span
          className="text-[#BC6C25] text-3xl"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {t("logo.agri")}
        </motion.span>
        <motion.span
          className="text-[#606C38] text-3xl"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {t("logo.nexus")}
        </motion.span>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const getUsername = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  const navItems = [
    { path: "/marketplace", label: t("navbar.marketplace") },
    { path: "/nursery", label: t("navbar.nursery") },
    { path: "/fish-market", label: t("navbar.fishMarket") },
    { path: "/learn", label: t("navbar.learn") },
    { path: "/schemes", label: t("navbar.schemes") },
    { path: "/equipments", label: t("navbar.equipments") },
    { path: "/analytics", label: t("navbar.analytics") },
    { path: "/about", label: t("navbar.about") },
  ];

  useEffect(() => {
    if (isSignedIn) {
      navigate("/auth-redirect");
    }
  }, [isSignedIn]);

  const navVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -5 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <nav className="bg-[#FEFAE0] shadow-md">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="cursor-pointer flex-shrink-0 mr-8"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Logo />
          </motion.div>

          <div className="lg:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#283618] p-2 hover:text-[#606C38]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </motion.button>
          </div>

          <div className="hidden lg:flex items-center flex-1 justify-end space-x-4">
            <div className="flex items-center space-x-1 xl:space-x-4">
              {navItems.map((item, i) => {
                const isActive = item.path === location.pathname;
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`cursor-pointer text-[#283618] hover:text-[#606C38] transition-colors relative py-2 px-1 text-sm xl:text-base whitespace-nowrap ${
                      isActive ? "border-b-2 border-[#606C38] font-semibold" : ""
                    }`}
                    custom={i}
                    variants={navVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Language Switcher */}
            <div className="relative z-50">
              <motion.button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 cursor-pointer text-[#283618] bg-[#DDA15E] bg-opacity-20 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🌐 {i18n.language && i18n.language.startsWith("kn") ? "ಕನ್ನಡ" : "English"}</span>
                <motion.span
                  animate={{ rotate: langDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px]"
                >
                  ▼
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-[#FEFAE0] ${
                        i18n.language && i18n.language.startsWith("en") ? "font-bold text-[#606C38]" : "text-[#283618]"
                      }`}
                      onClick={() => {
                        i18n.changeLanguage("en");
                        setLangDropdownOpen(false);
                      }}
                      whileHover={{ x: 3 }}
                    >
                      English
                    </motion.button>
                    <motion.button
                      className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-[#FEFAE0] ${
                        i18n.language && i18n.language.startsWith("kn") ? "font-bold text-[#606C38]" : "text-[#283618]"
                      }`}
                      onClick={() => {
                        i18n.changeLanguage("kn");
                        setLangDropdownOpen(false);
                      }}
                      whileHover={{ x: 3 }}
                    >
                      ಕನ್ನಡ
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isSignedIn ? (
              <motion.div
                className="relative ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="flex items-center space-x-2 cursor-pointer text-[#283618] bg-[#DDA15E] bg-opacity-20 px-3 py-1.5 rounded-full"
                  whileHover={{ backgroundColor: "rgba(221, 161, 94, 0.3)" }}
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                  <UserButton />
                  <span className="font-medium text-sm hidden xl:inline">
                    {user
                      ? getUsername(user.primaryEmailAddress.emailAddress)
                      : "User"}
                  </span>
                  <motion.span
                    animate={{ rotate: dropdownVisible ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs"
                  >
                    ▼
                  </motion.span>
                </motion.div>
                <AnimatePresence>
                  {dropdownVisible && (
                    <motion.div
                      className="cursor-pointer absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        className="cursor-pointer block w-full text-left px-4 py-2 text-[#283618] hover:bg-[#FEFAE0]"
                        whileHover={{ x: 5 }}
                        onClick={() => navigate("/profile")}
                      >
                        {t("navbar.profile")}
                      </motion.button>
                      <motion.div className="block w-full px-4 py-2">
                        <SignOutButton />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <SignInButton>
                <motion.button
                  className="cursor-pointer bg-[#606C38] text-[#FEFAE0] px-5 py-2 rounded-full hover:bg-[#283618] transition-colors text-sm whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {t("navbar.signin")}
                </motion.button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-[#DDA15E]/20"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-[#283618] hover:bg-[#DDA15E]/10 rounded-md"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {isSignedIn ? (
                  <>
                    <motion.button
                      onClick={() => {
                        navigate(`/profile/${user.id}`);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-[#283618] hover:bg-[#DDA15E]/10 rounded-md"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      {t("navbar.profile")}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setDropdownVisible(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-[#283618] hover:bg-[#DDA15E]/10 rounded-md"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <SignOutButton />
                    </motion.button>
                  </>
                ) : (
                  <SignInButton>
                    <motion.button
                      onClick={() => setDropdownVisible(false)}
                      className="block w-full text-center px-3 py-2 text-[#FEFAE0] bg-[#606C38] hover:bg-[#283618] rounded-md mt-3"
                      variants={itemVariants}
                    >
                      {t("navbar.signin")}
                    </motion.button>
                  </SignInButton>
                )}

                {/* Language Switcher for Mobile */}
                <div className="border-t border-[#DDA15E]/20 pt-3 mt-3 px-3">
                  <span className="block text-xs font-semibold text-[#283618]/60 uppercase tracking-wider mb-2">Language / ಭಾಷೆ</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => i18n.changeLanguage("en")}
                      className={`flex-1 py-2 text-center text-sm rounded-md transition-colors font-medium cursor-pointer ${
                        i18n.language && i18n.language.startsWith("en")
                          ? "bg-[#606C38] text-[#FEFAE0] font-semibold shadow-sm"
                          : "bg-[#DDA15E]/10 text-[#283618] hover:bg-[#DDA15E]/20"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage("kn")}
                      className={`flex-1 py-2 text-center text-sm rounded-md transition-colors font-medium cursor-pointer ${
                        i18n.language && i18n.language.startsWith("kn")
                          ? "bg-[#606C38] text-[#FEFAE0] font-semibold shadow-sm"
                          : "bg-[#DDA15E]/10 text-[#283618] hover:bg-[#DDA15E]/20"
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
