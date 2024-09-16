import {
  faCartArrowDown,
  faSearch,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import Slider from "./Slider"; // Import Slider component
import logo from "../assets/HS&DV/D.png";
import hoverLogo from "../assets/HS&DV/DB.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State for navbar hover
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Mobile menu state
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Track cart item count
  const searchBarRef = useRef(null); // Ref for search bar
  const menuRef = useRef(null); // Ref for mobile menu

  // Get the current location (current route)
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowSearchBar(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false); // Close menu if clicked outside
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside); // Detect clicks outside search bar and menu
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch categories and collections from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCategories();
    fetchCollections();
  }, []);

  // Update cart count from local storage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, [cartCount]); // Recalculate when cart changes

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMouseEnter = () => {
    setIsHovered(true); // Set hover state to true
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Reset hover state
  };

  return (
    <>
      <div className="relative w-full overflow-x-hidden">
        {/* Only render the Slider on the Home page (path === "/") */}
        {location.pathname === "/" ? (
          <div className="h-screen">
            <Slider />
          </div>
        ) : (
          <div className="h-0"></div> // Add a class with no height on non-home pages to avoid empty space
        )}

        {/* Navbar */}
        <div
          className={`${
            isScrolled || location.pathname !== "/"
              ? "bg-white shadow-md text-black"
              : "bg-transparent text-white"
          } fixed top-0 left-0 w-full z-50 transition-colors duration-200 hover:bg-white hover:text-black`}
          onMouseEnter={handleMouseEnter} // Handle mouse enter
          onMouseLeave={handleMouseLeave} // Handle mouse leave
        >
          {/* Only show the search bar when search is clicked */}
          {!showSearchBar && (
            <>
              {/* Hamburger menu (Mobile) */}
              <div className="absolute left-5 top-5 md:hidden">
                <FontAwesomeIcon
                  icon={faBars}
                  className={`text-2xl cursor-pointer ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                  onClick={toggleMenu}
                />
              </div>

              {/* Navbar content (links and logo) */}
              <div className="h-[80px] flex justify-between items-center px-10 md:hidden">
                {/* Links for desktop */}
                <ul className="md:flex gap-10 items-center hidden">
                  <li>
                    <Link
                      to="/"
                      className="hover:border-b-2 hover:border-black font-corm"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="relative group">
                    <Link
                      to="/about"
                      className="hover:border-b-2 hover:border-black font-corm"
                    >
                      About
                    </Link>
                    <div className="absolute left-0 top-full bg-white shadow-lg hidden group-hover:block">
                      <ul className="p-5">
                        <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                          <Link to="#founder">Founder</Link>
                        </li>
                        <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                          <Link to="#legacy">Legacy</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="relative group">
                    <Link
                      to="/shop"
                      className="hover:border-b-2 hover:border-black font-corm"
                    >
                      Shop
                    </Link>
                    {/* Dynamic Shop Dropdown with Categories and Collections */}
                    <div className="fixed inset-0 top-[50px] w-full h-96 bg-white shadow-lg hidden group-hover:flex p-5 gap-10 z-50">
                      {/* Categories Column */}
                      <div className="flex-grow ">
                        <h3 className="text-lg text-center font-semibold mb-3 font-corm">
                          Categories
                        </h3>
                        <div className="font-corm font-semibold">
                        <ul>
                          {categories.map((category) => (
                            <li
                              key={category.id}
                              className="hover:bg-gray-100 px-3 py-2 text-center"
                            >
                              <Link to={`/category/${category._id}`}>
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        </div>

                      </div>
                      {/* Collections Column */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold mb-3 font-corm">
                          Collections
                        </h3>
                        <div className="font-corm font-semibold">
                        <ul>
                          {collections.map((collection) => (
                            <li
                              key={collection.id}
                              className="hover:bg-gray-100 px-3 py-2"
                            >
                              <Link to={`/collection/${collection._id}`}>
                                {collection.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link
                      to="/contact"
                      className="hover:border-b-2 hover:border-black font-corm"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>

                <div className="flex items-center relative ">
                  <img
                    src={
                      location.pathname === "/"
                        ? isHovered
                          ? hoverLogo // Black logo on hover for home page
                          : logo // White logo by default for home page
                        : hoverLogo // Black logo for all other pages
                    }
                    alt="Logo"
                    className="h-[100px] w-[100px] transition-opacity duration-300"
                  />
                </div>

                <ul className="flex gap-10 items-center">
                  <li>
                    <div className="flex items-center">
                      <a
                        href="#search"
                        onClick={handleSearchClick}
                        className="hover:border-b-2 font-corm hover:border-black cursor-pointer"
                      >
                        Search
                      </a>
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="ml-2 cursor-pointer text-xl "
                        onClick={handleSearchClick}
                      />
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      className="hover:border-b-2 relative hover:border-black font-corm"
                    >
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-6 bottom-4 bg-red-500 absolute rounded-full px-2 text-md text-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <FontAwesomeIcon
                      icon={faCartArrowDown}
                      className="ml-2 text-xl cursor-pointer"
                    />
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Search Bar */}
          {showSearchBar && (
            <div
              className="flex h-[100px] justify-center bg-white"
              ref={searchBarRef}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border h-[50px] mt-5 rounded-md border-gray-300 p-1 w-[580px]"
                placeholder="Search products..."
              />
              <button className="ml-2  h-[50px] mt-5 rounded-md px-4 bg-[#cdac99] text-black font-corm ">
                Search
              </button>
              <FontAwesomeIcon
                icon={faTimes}
                className="ml-10 mt-8 text-2xl cursor-pointer text-black "
                onClick={() => setShowSearchBar(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div
            className="fixed inset-0  bg-gray-800 bg-opacity-75 flex justify-start"
            ref={menuRef}
          >
            <div className="bg-white w-64 h-full p-5">
              <div className="flex justify-between items-center font-corm">
                <h1 className="mt-9">Menu</h1>
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-2xl cursor-pointer "
                  onClick={toggleMenu}
                />
              </div>
              <ul className="mt-5">
                <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                  <Link to="/" onClick={toggleMenu}>
                    Home
                  </Link>
                </li>
                <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                  <Link to="/about" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                  <Link to="/shop" onClick={toggleMenu}>
                    Shop
                  </Link>
                </li>
                <li className="hover:bg-gray-100 px-3 py-2 font-corm">
                  <Link to="/contact" onClick={toggleMenu}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
