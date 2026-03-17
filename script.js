(() => {
  const yearEl = document.getElementById("ev");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const updatedEl = document.getElementById("frissites");
  if (updatedEl) {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    updatedEl.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
})();

(() => {
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");

  if (!menuBtn || !nav) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
      closeMenu();
    }
  });
})();

(() => {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.15, 0.3, 0.5, 0.7]
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

(() => {
  const serviceCards = document.querySelectorAll("[data-service-card]");

  if (!serviceCards.length || !("IntersectionObserver" in window)) {
    return;
  }

  const serviceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    {
      threshold: 0.6
    }
  );

  serviceCards.forEach((card) => serviceObserver.observe(card));
})();

(() => {
  const floatingCall = document.querySelector(".floating-call");
  const footerLinks = document.querySelector(".footer-links");
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  if (!floatingCall) {
    return;
  }

  const setFloatingCallVisible = (isVisible) => {
    floatingCall.classList.toggle("is-visible", isVisible);
  };

  const showFloatingCall = () => {
    setFloatingCallVisible(true);
  };

  if (footerLinks && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!mediaQuery.matches) {
            setFloatingCallVisible(true);
            return;
          }

          setFloatingCallVisible(!entry.isIntersecting);
        });
      },
      {
        threshold: [0, 0.08, 0.2]
      }
    );

    footerObserver.observe(footerLinks);
  } else {
    showFloatingCall();
  }

  const handleViewportChange = () => {
    showFloatingCall();
  };

  mediaQuery.addEventListener("change", handleViewportChange);
})();

(() => {
  const whySection = document.getElementById("miert");
  const cards = document.querySelectorAll("[data-why-card]");

  if (!whySection || !cards.length) {
    return;
  }

  const mediaQuery = window.matchMedia("(pointer: fine)");
  const toggleCard = (card) => {
    const isFlipped = !card.classList.contains("is-flipped");
    const tiltLayer = card.querySelector(".why-card-tilt");

    card.classList.toggle("is-flipped", isFlipped);
    card.classList.toggle("is-peek", !isFlipped);
    card.classList.toggle("is-invite", !isFlipped);
    card.setAttribute("aria-pressed", String(isFlipped));
    card.style.transform = "";
    if (tiltLayer) {
      tiltLayer.style.transform = "";
    }
  };

  const setPeekState = (enabled) => {
    cards.forEach((card, index) => {
      card.classList.toggle("is-peek", enabled && !card.classList.contains("is-flipped"));
      card.classList.toggle("is-invite", enabled && !card.classList.contains("is-flipped"));
      card.style.setProperty("--peek-y", index === 1 ? "0deg" : index === 2 ? "7deg" : "-7deg");
      card.style.setProperty("--invite-delay", `${index * 0.22}s`);
    });
  };

  if ("IntersectionObserver" in window) {
    const whyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setPeekState(entry.isIntersecting && entry.intersectionRatio >= 0.35);
        });
      },
      { threshold: [0.2, 0.35, 0.6] }
    );

    whyObserver.observe(whySection);
  } else {
    setPeekState(true);
  }

  cards.forEach((card) => {
    const tiltLayer = card.querySelector(".why-card-tilt");

    card.addEventListener("click", () => toggleCard(card));

    if (!mediaQuery.matches) {
      return;
    }

    card.addEventListener("pointermove", (event) => {
      if (card.classList.contains("is-flipped")) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 12;
      const rotateX = (0.5 - py) * 10;
      card.classList.remove("is-peek");
      card.classList.remove("is-invite");
      if (tiltLayer) {
        tiltLayer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener("pointerleave", () => {
      if (tiltLayer) {
        tiltLayer.style.transform = "";
      }
      if (!card.classList.contains("is-flipped")) {
        card.classList.add("is-peek");
        card.classList.add("is-invite");
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      toggleCard(card);
    });
  });
})();

(() => {
  const calcType = document.getElementById("calcType");
  const calcKm = document.getElementById("calcKm");
  const calcWait = document.getElementById("calcWait");
  const calcReturn = document.getElementById("calcReturn");
  const calcTotal = document.getElementById("calcTotal");
  const calcBreakdown = document.getElementById("calcBreakdown");
  const calcRouteBtn = document.getElementById("calcRouteBtn");
  const fromAddress = document.getElementById("fromAddress");
  const toAddress = document.getElementById("toAddress");
  const TAXI_BASE_LOCATION = "Szekszárd, Magyarország";

  if (!calcType || !calcKm || !calcWait || !calcReturn || !calcTotal || !calcBreakdown) {
    return;
  }

  const formatFt = (value) => `${new Intl.NumberFormat("hu-HU").format(Math.round(value))} Ft`;

  const getKm = () => {
    const normalized = String(calcKm.value || "").replace(",", ".").trim();
    const value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
  };

  const getWait = () => {
    const value = Number(calcWait.value || 0);
    return Number.isFinite(value) ? value : 0;
  };

  const animateTotal = () => {
    calcTotal.classList.add("is-updating");
    window.setTimeout(() => calcTotal.classList.remove("is-updating"), 180);
  };

  const setKmLocked = (locked) => {
    calcKm.readOnly = locked;
    calcKm.classList.toggle("is-locked", locked);
    calcKm.title = locked ? "A távolságot a Honnan és Hová mező alapján számoljuk." : "";
  };

  const setDistanceBreakdown = ({ pickupKm = "", tripKm = "", pricingKm = "" } = {}) => {
    calcKm.dataset.pickupKm = pickupKm === "" ? "" : String(pickupKm);
    calcKm.dataset.tripKm = tripKm === "" ? "" : String(tripKm);
    calcKm.dataset.pricingKm = pricingKm === "" ? "" : String(pricingKm);
  };

  const updateCalculator = () => {
    const type = calcType.value;
    const km = getKm();
    const wait = getWait();
    const isReturn = calcReturn.checked;

    let total = 0;
    const lines = [];

    if (type === "city") {
      if (km <= 0) {
        calcTotal.textContent = "0 Ft";
        calcBreakdown.textContent = "Add meg az adatokat a számításhoz.";
        return;
      }

      total = 1900;
      lines.push("Városi alapdíj 3 km-ig: 1 900 Ft");

      if (km > 3) {
        const extraKm = km - 3;
        const extra = extraKm * 550;
        total += extra;
        lines.push(`3 km felett: ${extraKm.toFixed(1)} km × 550 Ft = ${formatFt(extra)}`);
      }

      if (wait > 0) {
        const waitCost = wait * 100;
        total += waitCost;
        lines.push(`Várakozás: ${wait} perc × 100 Ft = ${formatFt(waitCost)}`);
      }
    } else if (type === "rural") {
      if (km <= 0) {
        calcTotal.textContent = "0 Ft";
        calcBreakdown.textContent = "Add meg az adatokat a számításhoz.";
        return;
      }

      const oneWay = 800 + km * 550;
      total = oneWay;
      const pickupKm = Number(calcKm.dataset.pickupKm || 0);
      const tripKm = Number(calcKm.dataset.tripKm || 0);
      lines.push("Vidéki tarifa: számolunk a Szekszárd-Honnan távolsággal is.");
      lines.push("Vidéki induló díj: 800 Ft");

      if (pickupKm > 0 || tripKm > 0) {
        lines.push(`Szekszárdi indulással: ${pickupKm.toFixed(1)} km`);
        lines.push(`Utasút: ${tripKm.toFixed(1)} km`);
        lines.push(`Össztávolság (Teljes út): ${km.toFixed(1)} km × 550 Ft = ${formatFt(km * 550)}`);
      } else {
        lines.push(`Össztávolság (Teljes út): ${km.toFixed(1)} km × 550 Ft = ${formatFt(km * 550)}`);
      }

      if (isReturn) {
        const returnPart = oneWay * 0.5;
        total += returnPart;
        lines.push(`Visszaút féláron: ${formatFt(returnPart)}`);
      }

      if (wait > 0) {
        const waitCost = wait * 100;
        total += waitCost;
        lines.push(`Várakozás: ${wait} perc × 100 Ft = ${formatFt(waitCost)}`);
      }
    } else if (type === "wine") {
      calcTotal.textContent = "Egyedi ár";
      calcBreakdown.textContent = "Borászatokhoz fix díj, útvonal és program alapján.";
      animateTotal();
      return;
    } else {
      calcTotal.textContent = "Egyedi ár";
      calcBreakdown.textContent = "Reptéri és egyedi utak esetén előzetes egyeztetés szükséges.";
      animateTotal();
      return;
    }

    calcTotal.textContent = formatFt(total);
    calcBreakdown.innerHTML = lines.join("<br>");
    animateTotal();
  };

  let routeTimer = null;

  const scheduleRouteCalculation = () => {
    if (!fromAddress || !toAddress) {
      return;
    }

    window.clearTimeout(routeTimer);
    routeTimer = window.setTimeout(calculateRouteDistance, 650);
  };

  const geocodeOSM = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Geocode HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || !data.length) {
      throw new Error(`Nincs találat: ${query}`);
    }

    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  };

  const routeKmOSRM = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM HTTP ${response.status}`);
    }

    const data = await response.json();
    const meters = data?.routes?.[0]?.distance;

    if (!meters) {
      throw new Error("Nincs route távolság");
    }

    return meters / 1000;
  };

  async function calculateRouteDistance() {
    if (!fromAddress || !toAddress) {
      return;
    }

    const from = fromAddress.value.trim();
    const to = toAddress.value.trim();

    if (!from || !to) {
      setKmLocked(false);
      setDistanceBreakdown();
      updateCalculator();
      return;
    }

    setKmLocked(true);

    try {
      const start = await geocodeOSM(from);
      const end = await geocodeOSM(to);

      if (calcType.value === "rural") {
        const taxiBase = await geocodeOSM(TAXI_BASE_LOCATION);
        const pickupKm = await routeKmOSRM(taxiBase, start);
        const tripKm = await routeKmOSRM(start, end);
        const totalKm = pickupKm + tripKm;

        setDistanceBreakdown({
          pickupKm: Math.round(pickupKm * 10) / 10,
          tripKm: Math.round(tripKm * 10) / 10,
          pricingKm: Math.round(totalKm * 10) / 10
        });

        calcKm.value = (Math.round(totalKm * 10) / 10).toString().replace(".", ",");
      } else {
        const km = await routeKmOSRM(start, end);
        setDistanceBreakdown();
        calcKm.value = (Math.round(km * 10) / 10).toString().replace(".", ",");
      }
    } catch (error) {
      console.warn("Route km számítás hiba:", error);
      setKmLocked(false);
      setDistanceBreakdown();
    }

    updateCalculator();
  }

  [calcType, calcKm, calcWait, calcReturn].forEach((element) => {
    element.addEventListener("input", updateCalculator);
    element.addEventListener("change", updateCalculator);
  });

  calcType.addEventListener("change", scheduleRouteCalculation);

  if (fromAddress && toAddress) {
    [fromAddress, toAddress].forEach((element) => {
      element.addEventListener("input", scheduleRouteCalculation);
      element.addEventListener("change", scheduleRouteCalculation);
      element.addEventListener("blur", scheduleRouteCalculation);
    });
  }

  if (calcRouteBtn) {
    calcRouteBtn.addEventListener("click", calculateRouteDistance);
  }

  updateCalculator();
})();

(() => {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");
  const consentKey = "cookieConsent";
  const acceptedValue = "accepted";

  if (!cookieBanner || !acceptBtn || !declineBtn) {
    return;
  }

  const loadTidio = () => {
    if (document.getElementById("tidio-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "tidio-script";
    script.src = "https://code.tidio.co/kuftdd3wnjx11dcsgsq397qwpil70rt6.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const consent = localStorage.getItem(consentKey);

  if (!consent) {
    cookieBanner.hidden = false;
  } else if (consent === acceptedValue) {
    loadTidio();
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem(consentKey, acceptedValue);
    cookieBanner.hidden = true;
    loadTidio();
  });

  declineBtn.addEventListener("click", () => {
    localStorage.setItem(consentKey, "declined");
    cookieBanner.hidden = true;
  });
})();
