// src/pages/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth, logout, isAuthenticated } from "../utils/auth.js";
import { API_BASE } from "../config.js";
import Avatar from "../components/Avatar.jsx";

/** Hotlink-safe stock images */
const CATEGORY_IMAGES = {
  SMARTPHONES: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
  TABLETS: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg",
  WEARABLES: "https://images.pexels.com/photos/2861929/pexels-photo-2861929.jpeg",
  LAPTOPS: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
  DESKTOPS: "https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg",
  PC_COMPONENTS: "https://images.pexels.com/photos/6704948/pexels-photo-6704948.jpeg",
  MONITORS: "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg",
  PERIPHERALS_ACCESSORIES: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
  STORAGE: "https://images.pexels.com/photos/2942361/pexels-photo-2942361.jpeg",
  SOFTWARE: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
  CAMERAS: "https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg",
  AUDIO_HEADPHONES: "https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg",
  AUDIO_SPEAKERS: "https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg",
  GAMING_CONSOLES: "https://images.pexels.com/photos/33513532/pexels-photo-33513532.jpeg",
  GAMING_ACCESSORIES: "https://images.pexels.com/photos/21067/pexels-photo.jpg",
  TV_HOME_THEATER: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg",
  SMART_HOME: "https://images.pexels.com/photos/1072851/pexels-photo-1072851.jpeg",
  NETWORKING: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
  PRINTERS_SCANNERS: "https://images.pexels.com/photos/9301887/pexels-photo-9301887.jpeg",
  DRONES: "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg",
  SMALL_APPLIANCES: "https://images.pexels.com/photos/29461935/pexels-photo-29461935.jpeg",
  ELECTRIC_MOBILITY: "https://images.pexels.com/photos/8811560/pexels-photo-8811560.jpeg",
};

/** Section titles + categories */
const SECTIONS = [
  {
    title: "Phones & Tablets",
    items: [
      { label: "Smartphones", value: "SMARTPHONES" },
      { label: "Tablets", value: "TABLETS" },
      { label: "Wearables", value: "WEARABLES" },
    ],
  },
  {
    title: "Computers",
    items: [
      { label: "Laptops", value: "LAPTOPS" },
      { label: "Desktops", value: "DESKTOPS" },
      { label: "PC Components", value: "PC_COMPONENTS" },
      { label: "Monitors", value: "MONITORS" },
      { label: "Peripherals & Accessories", value: "PERIPHERALS_ACCESSORIES" },
      { label: "Storage", value: "STORAGE" },
      { label: "Software", value: "SOFTWARE" },
    ],
  },
  {
    title: "Imaging & Audio",
    items: [
      { label: "Cameras", value: "CAMERAS" },
      { label: "Audio & Headphones", value: "AUDIO_HEADPHONES" },
      { label: "Audio Speakers", value: "AUDIO_SPEAKERS" },
    ],
  },
  {
    title: "Gaming",
    items: [
      { label: "Gaming Consoles", value: "GAMING_CONSOLES" },
      { label: "Gaming Accessories", value: "GAMING_ACCESSORIES" },
    ],
  },
  {
    title: "TV & Smart Home",
    items: [
      { label: "TV & Home Theater", value: "TV_HOME_THEATER" },
      { label: "Smart Home", value: "SMART_HOME" },
    ],
  },
  {
    title: "Networking & Printing",
    items: [
      { label: "Networking", value: "NETWORKING" },
      { label: "Printers & Scanners", value: "PRINTERS_SCANNERS" },
    ],
  },
  { title: "Drones", items: [{ label: "Drones", value: "DRONES" }] },
  {
    title: "Appliances & Mobility",
    items: [
      { label: "Small Appliances", value: "SMALL_APPLIANCES" },
      { label: "Electric Mobility", value: "ELECTRIC_MOBILITY" },
    ],
  },
];

/** Local helpers for cart */
function readCartArray() {
  try {
    const arr = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function cartTotals(items) {
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (it.qty || 1), 0);
  const currency = items[0]?.currency || "RON";
  return { subtotal, currency };
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const cartBtnRef = useRef(null);
  const cartPanelRef = useRef(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const role = user?.role;
  const canShop = role === "USER"; // only normal users can buy

  const fetchUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      return;
    }
    try {
      const res = await fetchWithAuth(`${API_BASE}/auth/me`);
      if (res.ok) setUser(await res.json());
      else {
        logout();
        setUser(null);
      }
    } catch {
      logout();
      setUser(null);
    }
  };

  /** auth */
  useEffect(() => {
    fetchUser();
    const handleAuthChange = () => (isAuthenticated() ? fetchUser() : setUser(null));
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  /** close mega menu when clicking outside */
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMenuOpen]);

  /** cart: sync with localStorage + custom event */
  const refreshCart = () => setCartItems(readCartArray());
  useEffect(() => {
    refreshCart();
    const onCartChange = () => refreshCart();
    window.addEventListener("cartChange", onCartChange);
    window.addEventListener("storage", onCartChange);
    return () => {
      window.removeEventListener("cartChange", onCartChange);
      window.removeEventListener("storage", onCartChange);
    };
  }, []);

  /** close cart popover on outside click */
  useEffect(() => {
    if (!cartOpen) return;
    const onDocClick = (e) => {
      if (
        cartPanelRef.current &&
        !cartPanelRef.current.contains(e.target) &&
        cartBtnRef.current &&
        !cartBtnRef.current.contains(e.target)
      ) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [cartOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    // Require auth to search
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    const params = new URLSearchParams();
    if (searchQ.trim()) params.set("query", searchQ.trim());
    navigate(`/catalog?${params.toString()}`);
    setIsMenuOpen(false);
  };

  const goCategory = (value) => {
    const params = new URLSearchParams();
    params.set("category", value);
    // Require auth to search/browse categories
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    navigate(`/catalog?${params.toString()}`);
    setIsMenuOpen(false);
  };

  const handleClearCart = () => {
    localStorage.setItem("cart", "[]");
    window.dispatchEvent(new Event("cartChange"));
    refreshCart();
  };

  const handleToggleCart = () => {
    if (!canShop) {
      // Block cart UI for admins/brand sellers
      return;
    }
    setCartOpen((v) => !v);
  };

  const { subtotal, currency } = cartTotals(cartItems);
  const cartCount = cartItems.reduce((s, it) => s + (it.qty || 0), 0);

  // shared button styles
  const primaryBtn = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #6366f1",
    background: "#6366f1",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  };
  const secondaryBtn = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
  };
  const dangerBtn = {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #b91c1c",
    background: "#ef4444",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  };
  const disabledBtn = {
    opacity: 0.5,
    cursor: "not-allowed",
    filter: "grayscale(0.2)",
  };

  return (
    <nav
      style={{
        padding: "12px 24px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        fontFamily:
          '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left group: logo + catalog + search */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 18,
            color: "#6366f1",
          }}
        >
          Spark✨
        </Link>

        {/* Catalog Trigger */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((v) => !v);
              if (!isMenuOpen) setActiveSectionIdx(0);
            }}
            onMouseEnter={() => {
              setIsMenuOpen(true);
              setActiveSectionIdx((idx) => (idx == null ? 0 : idx));
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              color: "#1f2937",
              zIndex: 100,
            }}
          >
            Catalog ▾
          </button>

          {/* Mega Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              onMouseLeave={() => setIsMenuOpen(false)}
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                background: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                display: "grid",
                gridTemplateColumns: "260px 1fr",
                minWidth: 760,
                overflow: "hidden",
                zIndex: 60,
              }}
            >
              {/* Left rail */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 12,
                  borderRight: "1px solid #f3f4f6",
                  gap: 4,
                  background: "#fafafa",
                }}
              >
                {SECTIONS.map((sec, i) => {
                  const active = i === activeSectionIdx;
                  return (
                    <div
                      key={sec.title}
                      role="presentation"
                      onMouseEnter={() => setActiveSectionIdx(i)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: "default",
                        background: active ? "#eef2ff" : "transparent",
                        color: active ? "#3730a3" : "#111827",
                      }}
                    >
                      {sec.title}
                    </div>
                  );
                })}
              </div>

              {/* Right panel */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
                  gap: 12,
                  padding: 16,
                }}
              >
                {SECTIONS[activeSectionIdx]?.items.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => goCategory(cat.value)}
                    style={{
                      position: "relative",
                      textAlign: "center",
                      padding: "24px 12px",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: "hidden",
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <img
                      src={CATEGORY_IMAGES[cat.value]}
                      alt={cat.label}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 1,
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255,255,255,0.45)",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    />
                    <span
                      style={{
                        position: "relative",
                        zIndex: 3,
                        color: "#111827",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 8,
                        backdropFilter: "blur(2px) brightness(1.1)",
                        WebkitBackdropFilter: "blur(2px) brightness(1.1)",
                        background: "rgba(255,255,255,0.25)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search bar (requires auth now) */}
        <form
          onSubmit={submitSearch}
          role="search"
          style={{
            flex: 1,
            maxWidth: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <input
            placeholder="Search products…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #6366f1",
              background: "#6366f1",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Right-side links */}
      <div className="links" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          to="/catalog"
          style={{ textDecoration: "none", color: "#6366f1", fontWeight: 700 }}
          onClick={(e) => {
            if (!isAuthenticated()) {
              e.preventDefault();
              navigate("/login");
            }
          }}
        >
          Explore
        </Link>

        {/* Role-based Orders link */}
        {user && role === "USER" && (
          <Link to="/orders" style={{ textDecoration: "none", color: "#6366f1", fontWeight: 700 }}>
            My Orders
          </Link>
        )}
        {user && role === "BRAND_SELLER" && (
          <Link
            to="/my-brand/orders"
            style={{ textDecoration: "none", color: "#6366f1", fontWeight: 700 }}
          >
            Brand Orders
          </Link>
        )}

        {/* Cart button + popover */}
        <div style={{ position: "relative" }}>
          <button
            ref={cartBtnRef}
            type="button"
            onClick={handleToggleCart}
            aria-label="Open cart"
            disabled={!canShop}
            title={!canShop ? "Buying is disabled for your role" : "Open cart"}
            style={{
              position: "relative",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: canShop ? "pointer" : "not-allowed",
              fontWeight: 700,
              fontSize: 14,
              color: "#1f2937",
              ...(canShop ? {} : disabledBtn),
            }}
          >
            🛒 Cart
            {cartCount > 0 && canShop && (
              <span
                style={{
                  marginLeft: 6,
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontSize: 12,
                  fontWeight: 800,
                  verticalAlign: "middle",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {cartOpen && canShop && (
            <div
              ref={cartPanelRef}
              style={{
                position: "absolute",
                right: 0,
                top: "115%",
                width: 360,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 70,
              }}
            >
              <div style={{ padding: 12, borderBottom: "1px solid #f3f4f6", fontWeight: 800 }}>
                Your Cart
              </div>

              {cartItems.length === 0 ? (
                <div style={{ padding: 16, color: "#6b7280" }}>Your cart is empty.</div>
              ) : (
                <>
                  <div
                    style={{
                      maxHeight: 320,
                      overflowY: "auto",
                      padding: 8,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    {cartItems.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "64px 1fr auto",
                          gap: 8,
                          alignItems: "center",
                          border: "1px solid #f3f4f6",
                          borderRadius: 10,
                          padding: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            background: "#f3f4f6",
                            borderRadius: 8,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {it.cover ? (
                            <img
                              src={it.cover}
                              alt={it.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              loading="lazy"
                            />
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: 12 }}>No image</span>
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={it.name}
                          >
                            {it.name}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>Qty: {it.qty}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {it.price} {it.currency || "RON"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 12, borderTop: "1px solid #f3f4f6", display: "grid", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                        fontWeight: 700,
                      }}
                    >
                      <span>Subtotal</span>
                      <span>
                        {subtotal.toFixed(2)} {currency}
                      </span>
                    </div>

                    {/* CLEAR */}
                    <div>
                      <button onClick={handleClearCart} style={dangerBtn} title="Clear cart">
                        🗑 Clear cart
                      </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          navigate("/cart");
                        }}
                        style={secondaryBtn}
                      >
                        View cart
                      </button>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          navigate("/checkout");
                        }}
                        style={primaryBtn}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {role === "ADMIN" && (
              <Link
                to="/admin"
                style={{
                  marginRight: 8,
                  textDecoration: "none",
                  color: "#6366f1",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Admin
              </Link>
            )}
            {role === "USER" && (
              <Link
                to="/request-brand"
                style={{
                  textDecoration: "none",
                  color: "#6366f1",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Request Brand
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                to="/admin/brand-requests"
                style={{
                  textDecoration: "none",
                  color: "#6366f1",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Brand Requests
              </Link>
            )}
            {role === "BRAND_SELLER" && (
              <Link
                to="/my-brand"
                style={{
                  textDecoration: "none",
                  color: "#6366f1",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                My Brand
              </Link>
            )}

            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "#1f2d3a",
              }}
            >
              <Avatar imageUrl={user.imageUrl} size={32} alt={user.name} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              style={{
                padding: "8px 14px",
                background: "#f5f7fa",
                color: "#1f2d3a",
                border: "1px solid #d1d9e6",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "background .2s ease, filter .2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.5)";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#6366f1",
                fontWeight: 600,
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#6366f1",
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
