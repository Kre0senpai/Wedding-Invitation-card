import React, { useEffect, useMemo, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  MapPin,
  Navigation,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import "./styles.css";
/* ============================================================
   WEDDING DATA
   ============================================================ */

const COUPLE = {
  groomFirst: "Akash",
  groomFull: "Akash Singh",
  groomRole: "",

  brideFirst: "Aarzoo",
  brideFull: "Aarzoo Singh",
  brideRole: "",
};

const WEDDING_DATE = new Date("2026-11-25T19:00:00+05:30");

const FAMILIES = [
  {
    side: "The Bride's Family",
    names: ["Rakesh Singh & Sarita Singh"],
    address: "",
  },
  {
    side: "The Groom's Family",
    names: ["Mr. & Mrs. Singh"],
    address: "",
  }
];

const EVENTS = [
  {
    time: "To Be Announced",
    title: "Haldi",
    description:
      "A morning filled with laughter, turmeric, and bright yellow hues.",
    icon: Sparkles,
  },
  {
    time: "To Be Announced",
    title: "Mehndi",
    description:
      "Intricate henna patterns, sweet music and warm conversations.",
    icon: Sparkles,
  },
  {
    time: "To Be Announced",
    title: "Sangeet",
    description:
      "A night of music, dance performances and festive joy.",
    icon: Sparkles,
  },
  {
    time: "07:00 PM",
    title: "Wedding Ceremony",
    description:
      "The main ceremony — seven sacred vows and eternal union.",
    icon: Heart,
  },
];

const GALLERY = [
  {
    title: "The Beginning",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Engagement",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Together",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Our Moment",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
  },
];

const VENUE = {
  name: "Viraj International Hotel",
  address: "Babatpur, Varanasi, Uttar Pradesh",
  city: "Varanasi",
  date: "Wednesday · 25 November 2026",
  time: "7:00 PM",

  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Viraj+International+Hotel+Babatpur+Varanasi",

  embedUrl:
    "https://maps.google.com/maps?q=Viraj+International+Hotel+Babatpur+Varanasi+Uttar+Pradesh&output=embed&z=15",
};

/* ============================================================
   HELPERS
   ============================================================ */

function useCountdown(target) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const difference = Math.max(0, target - now);

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

/* ============================================================
   SMALL DECORATIVE COMPONENTS
   ============================================================ */

function LotusDivider() {
  return (
    <div className="lotus-divider">
      <span />
      <span className="divider-diamond">◆</span>
      <span />
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      className="section-heading"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <LotusDivider />
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

/* ============================================================
   OPENING GATE
   ============================================================ */

function OpeningGate({ onOpen }) {
  return (
    <motion.div
      className="opening"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.8 }}
    >
      <div className="opening-glow" />

        <div className="flower-rain" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <img
              key={i}
              src="/images/flower.png"
              className="falling-flower"
              alt=""
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${(i * 1.7) % 12}s`,
                animationDuration: `${12 + ((i * 2.3) % 8)}s`,
                width: `${18 + ((i * 13) % 20)}px`,
              }}
            />
          ))}
        </div>

      <motion.div
        className="opening-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/images/hero-arch.png"
          className="opening-art"
          alt=""
        />

        <div className="opening-content">
          <div className="ganesha-symbol">ॐ</div>

          <p className="opening-small">With the blessings of our families</p>

          <h1>
            {COUPLE.brideFirst}
            <span>&</span>
            {COUPLE.groomFirst}
          </h1>

          <LotusDivider />
          

          <p className="opening-date">25 · 11 · 2026</p>

          <p className="opening-invite">
            Request the pleasure of your company
            <br />
            as we begin our forever.
          </p>

          <motion.button
            className="open-invitation"
            onClick={onOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Open Invitation
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 100]);

  return (
    <section className="hero">

      {/* Background */}
      <motion.div
        className="hero-bg"
        style={{ y: imageY }}
      />

      <div className="hero-overlay" />

      {/* Bottom floral decorations */}
      <img
        src="/images/hero-flowers.png"
        alt=""
        className="hero-flower hero-flower-left"
        aria-hidden="true"
      />

      <img
        src="/images/hero-flowers.png"
        alt=""
        className="hero-flower hero-flower-right"
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="hero-blessing">
            ॥ श्री गणेशाय नमः ॥
          </p>

          <p className="hero-small">
            Together with their families
          </p>

          <h1 className="hero-names">
            {COUPLE.groomFirst}
            <span>&</span>
            {COUPLE.brideFirst}
          </h1>

          <p className="hero-tagline">
            invite you to celebrate their wedding
          </p>

          <div className="hero-date">
            <span>Wednesday</span>
            <strong>25</strong>
            <span>November · 2026</span>
          </div>

          <a href="#story" className="hero-scroll">
            <span>Scroll to explore</span>
            <ChevronDown size={18} />
          </a>
        </motion.div>
      </div>

    </section>
  );
}

/* ============================================================
   COUPLE / FAMILY
   ============================================================ */

function FamilySection() {
  return (
    <section id="story" className="section family-section">
              

      <div className="paper-panel">
        <SectionHeading
          eyebrow="With joyful hearts"
          title="Two families, one beautiful beginning"
          subtitle="With the blessings and love of our families, we invite you to witness the beginning of our forever."
        />

        <div className="families">
          {FAMILIES.map((family, index) => (
            <motion.div
              className="family-card"
              key={family.side}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span>{family.side}</span>

              <h3>{family.names}</h3>

              <p>{family.address}</p>
            </motion.div>
          ))}
        </div>

        <div className="couple-intro">
          <p className="announce">Joyfully announcing the union of</p>

          <div className="person">
            <h3>{COUPLE.brideFull}</h3>
            <span>{COUPLE.brideRole}</span>
          </div>

          <div className="ampersand">&</div>

          <div className="person">
            <h3>{COUPLE.groomFull}</h3>
            <span>{COUPLE.groomRole}</span>
          </div>
        </div>
      </div>
      
    </section>
  );
}

/* ============================================================
   DECORATIVE TOWER
   ============================================================ */

function TowerLeft() {
  return (
    <div className="decorative-tower decorative-tower-left" aria-hidden="true">
      <img
        src="/images/tower.png"
        alt=""
      />
    </div>
  );
}

function TowerRight() {
  return (
    <div className="decorative-tower decorative-tower-right" aria-hidden="true">
      <img
        src="/images/tower.png"
        alt=""
      />
    </div>
  );
}


/* ============================================================
   GALLERY
   ============================================================ */

function GallerySection() {
  const [active, setActive] = useState(0);

  const previous = () => {
    setActive((current) =>
      current === 0 ? GALLERY.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) => (current + 1) % GALLERY.length);
  };

  return (
    <section className="section gallery-section">
      <SectionHeading
        eyebrow="Captured moments"
        title="A few memories"
        subtitle="A glimpse into the moments that brought us here."
      />

      <div className="gallery">
        <button className="gallery-arrow left" onClick={previous}>
          <ChevronLeft size={20} />
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="gallery-main"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45 }}
          >
            <img src={GALLERY[active].image} alt={GALLERY[active].title} />

          </motion.div>
        </AnimatePresence>

        <button className="gallery-arrow right" onClick={next}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="gallery-dots">
        {GALLERY.map((_, index) => (
          <button
            key={index}
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SECTION FLORAL DECORATION
   ============================================================ */

function SectionFlowerLeft() {
  return (
    <div className="section-flowers" aria-hidden="true">
      <img
        src="/images/hero-flowers.png"
        className="section-flower section-flower-left"
        alt=""
      />
    </div>
  );
}

function SectionFlowerRight() {
  return (
    <div className="section-flowers" aria-hidden="true">

      <img
        src="/images/hero-flowers.png"
        className="section-flower section-flower-right"
        alt=""
      />
    </div>
  );
}
/* ============================================================
   COUNTDOWN
   ============================================================ */

function CountdownSection() {
  const countdown = useCountdown(WEDDING_DATE);

  const items = [
    ["Days", countdown.days],
    ["Hours", countdown.hours],
    ["Minutes", countdown.minutes],
    ["Seconds", countdown.seconds],
  ];

  return (
    <section className="section countdown-section">
      <div className="countdown-card">
        <div className="countdown-decor">✦</div>

        <p className="eyebrow light">The countdown begins</p>

        <h2>Until we say “I do”</h2>

        <div className="countdown-grid">
          {items.map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <strong>{formatNumber(value)}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p className="countdown-date">
          Wednesday · 25 November · 2026
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   CEREMONY & VENUE
   ============================================================ */

function CeremonySection() {
  return (
    <section className="section ceremony-section" id="venue">

      <SectionHeading
        eyebrow="Save the date"
        title="The Wedding Day"
        subtitle="Join us as we celebrate love, family and a lifetime together."
      />
        <TowerLeft />
      {/* DATE CARD */}
      <div className="date-card">
        <p>{VENUE.date.split(" · ")[0]}</p>

        <div className="date-number">
          <span>NOV</span>
          <strong>25</strong>
          <span>2026</span>
        </div>

        <p>at {VENUE.time}</p>
      </div>

      {/* VENUE */}
      <motion.div
        className="venue-card"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="venue-info">

          <MapPin
            size={24}
            strokeWidth={1.5}
            className="venue-icon"
          />

          <p className="venue-label">
            Wedding Venue
          </p>

          <h3>{VENUE.name}</h3>

          <p className="venue-address">
            {VENUE.address}
          </p>

          <p className="venue-time">
            <Clock3 size={14} />
            {VENUE.date} · {VENUE.time}
          </p>

          <a
            href={VENUE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn venue-map-button"
          >
            <Navigation size={15} />
            Get Directions
          </a>

        </div>

        <div className="venue-map">
          <iframe
            title={`${VENUE.name} - Google Maps`}
            src={VENUE.embedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </motion.div>

    </section>
  );
}

/* ============================================================
   SCHEDULE
   ============================================================ */

function ScheduleSection() {
  return (
    <section className="section schedule-section">
      <SectionHeading
        eyebrow="The celebration"
        title="Celebrations Schedule"
        subtitle="Come for the ceremony, stay for the celebration."
      />

      <div className="timeline">
        {EVENTS.map((event, index) => {
          const Icon = event.icon;

          return (
            <motion.div
              className="timeline-item"
              key={event.title}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -25 : 25,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="timeline-time">{event.time}</div>

              <div className="timeline-marker">
                <Icon size={15} />
              </div>

              <div className="timeline-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   CALENDAR
   ============================================================ */

function CalendarSection() {
  const days = useMemo(() => {
    const year = 2026;
    const month = 11;

    const first = new Date(year, month, 1);
    const total = new Date(year, month + 1, 0).getDate();

    const start = (first.getDay() + 6) % 7;

    return [
      ...Array(start).fill(null),
      ...Array.from({ length: total }, (_, i) => i + 1),
    ];
  }, []);

  function addToCalendar() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261125T190000",
      "DTEND:20261125T230000",
      "SUMMARY:Akash & Aarzoo Wedding",
      "LOCATION:Viraj International Hotel",
      "DESCRIPTION:Wedding celebration of Akash & Aarzoo Wedding",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "arjun-priya-wedding.ics";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="section calendar-section">
      <SectionHeading
        eyebrow="Mark your calendar"
        title="November 2026"
        subtitle="We would be honoured to have you with us."
      />

      <div className="calendar">
        <div className="calendar-title">
          <CalendarDays size={18} />
          <span>November 2026</span>
        </div>

        <div className="calendar-weekdays">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((day, index) => (
            <span
              key={index}
              className={day === 25 ? "selected-day" : ""}
            >
              {day}
              {day === 25 && <Heart size={9} fill="currentColor" />}
            </span>
          ))}
        </div>
      </div>

      <button className="gold-button" onClick={addToCalendar}>
        <CalendarDays size={15} />
        Add to Calendar
      </button>
    </section>
  );
}

/* ============================================================
   DRESS CODE
   ============================================================ */

function DressCodeSection() {
  return (
    <section className="section dress-section">
      <div className="dress-card">
        <p className="eyebrow">Dress Code</p>

        <h2>Festive Elegance</h2>

        <p>
          Come dressed in your favourite celebration colours.
          Think elegant, joyful and effortlessly festive.
        </p>

        <div className="dress-swatches">
          <span style={{ background: "#741521" }} />
          <span style={{ background: "#c69b58" }} />
          <span style={{ background: "#e8c7b2" }} />
          <span style={{ background: "#f7e9cc" }} />
          <span style={{ background: "#283b25" }} />
        </div>

        <div className="dress-labels">
          <span>Maroon</span>
          <span>Gold</span>
          <span>Rose</span>
          <span>Ivory</span>
          <span>Emerald</span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GUESTBOOK - INDEXED DB
   ============================================================ */

const GUESTBOOK_DB = "ArjunPriyaWeddingDB";
const GUESTBOOK_STORE = "guestbook";

function openGuestbookDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(GUESTBOOK_DB, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(GUESTBOOK_STORE)) {
        const store = db.createObjectStore(GUESTBOOK_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* Get all messages */

async function getGuestbookMessages() {
  const db = await openGuestbookDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GUESTBOOK_STORE,
      "readonly"
    );

    const store = transaction.objectStore(GUESTBOOK_STORE);

    const request = store.getAll();

    request.onsuccess = () => {
      const messages = request.result || [];

      /*
        Newest messages first
      */
      messages.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      resolve(messages);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* Save a message */

async function saveGuestbookMessage(message) {
  const db = await openGuestbookDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GUESTBOOK_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(
      GUESTBOOK_STORE
    );

    const request = store.add({
      name: message.name,
      text: message.text,
      createdAt: Date.now(),
    });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* Delete a message */

async function deleteGuestbookMessage(id) {
  const db = await openGuestbookDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GUESTBOOK_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(
      GUESTBOOK_STORE
    );

    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* ============================================================
   GUESTBOOK
   ============================================================ */
function GuestbookSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  /* ==========================================================
     LOAD MESSAGES WHEN COMPONENT MOUNTS
     ========================================================== */

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);

        const savedMessages =
          await getGuestbookMessages();

        setMessages(savedMessages);
      } catch (err) {
        console.error(
          "Could not load guestbook messages:",
          err
        );

        setError(
          "Unable to load your saved wishes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);


  /* ==========================================================
     SUBMIT MESSAGE
     ========================================================== */

  async function submit(e) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      setError("Please enter your name and wishes.");
      return;
    }

    if (cleanName.length > 60) {
      setError("Name should be less than 60 characters.");
      return;
    }

    if (cleanMessage.length > 500) {
      setError(
        "Message should be less than 500 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newMessage = {
        name: cleanName,
        text: cleanMessage,
        createdAt: Date.now(),
      };

      await saveGuestbookMessage(newMessage);

      /*
        Reload from IndexedDB so UI always represents
        what's actually stored.
      */

      const updatedMessages =
        await getGuestbookMessages();

      setMessages(updatedMessages);

      setName("");
      setMessage("");

    } catch (err) {
      console.error(
        "Could not save guestbook message:",
        err
      );

      setError(
        "Something went wrong while saving your wishes."
      );
    } finally {
      setSaving(false);
    }
  }


  /* ==========================================================
     DELETE MESSAGE
     
     Optional:
     Remove this if you don't want users to delete messages.
     ========================================================== */

  async function removeMessage(id) {
    try {
      await deleteGuestbookMessage(id);

      const updatedMessages =
        await getGuestbookMessages();

      setMessages(updatedMessages);

    } catch (err) {
      console.error(
        "Could not delete message:",
        err
      );
    }
  }


  return (
    <section className="section guestbook-section">

      <SectionHeading
        eyebrow="Leave a little love"
        title="Guestbook"
        subtitle="Your wishes will become part of our wedding memories."
      />


      {/* =====================================================
          FORM
          ===================================================== */}

      <form
        className="guestbook-form"
        onSubmit={submit}
      >

        <div className="input-group">

          <label htmlFor="guest-name">
            Your Name
          </label>

          <input
            id="guest-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            maxLength={60}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>


        <div className="input-group">

          <label htmlFor="guest-message">
            Your Wishes
          </label>

          <textarea
            id="guest-message"
            rows="5"
            maxLength={500}
            placeholder="Write something beautiful for Arjun & Priya..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <span className="character-count">
            {message.length}/500
          </span>

        </div>


        {error && (
          <p className="guestbook-error">
            {error}
          </p>
        )}


        <button
          className="gold-button guestbook-submit"
          type="submit"
          disabled={saving}
        >

          {saving ? (
            <>
              <span className="button-spinner" />
              Saving...
            </>
          ) : (
            <>
              <Send size={14} />
              Send Wishes
            </>
          )}

        </button>

      </form>


      {/* =====================================================
          SAVED MESSAGE COUNT
          ===================================================== */}

      {!loading && messages.length > 0 && (
        <div className="guestbook-count">

          <Heart
            size={12}
            fill="currentColor"
          />

          <span>
            {messages.length}{" "}
            {messages.length === 1
              ? "wish"
              : "wishes"}{" "}
            shared
          </span>

        </div>
      )}


      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading && (
        <div className="guestbook-loading">

          <span className="button-spinner" />

          <p>Opening the guestbook...</p>

        </div>
      )}


      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {!loading && messages.length === 0 && (
        <div className="guestbook-empty">

          <Heart
            size={22}
            strokeWidth={1}
          />

          <p>
            Be the first to leave a little love.
          </p>

        </div>
      )}


      {/* =====================================================
          MESSAGES
          ===================================================== */}

      {!loading && messages.length > 0 && (

        <div className="messages">

          {messages.map((item) => (

            <motion.div
              className="message-card"
              key={item.id}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              layout
            >

              <div className="message-top">

                <div className="message-heart">
                  <Heart
                    size={13}
                    fill="currentColor"
                  />
                </div>

                {item.id && (
                  <button
                    className="message-delete"
                    onClick={() =>
                      removeMessage(item.id)
                    }
                    type="button"
                    aria-label="Delete message"
                  >
                    ×
                  </button>
                )}

              </div>


              <h3>
                {item.name}
              </h3>


              <p>
                {item.text}
              </p>


              <span className="message-date">
                {new Date(
                  item.createdAt
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>

            </motion.div>

          ))}

        </div>

      )}

    </section>
  );
}
/* ============================================================
   GIFT
   ============================================================ */

function GiftSection() {
  const [showGiftModal, setShowGiftModal] = useState(false);

  const saveQR = (image, filename) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (showGiftModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showGiftModal]);

  return (
    <>
      {/* =====================================================
          GIFT SECTION
          ===================================================== */}

      <section className="section gift-section">

        <SectionHeading
          eyebrow="A little note"
          title="Your presence is our gift"
          subtitle="Having you celebrate this special day with us means more than anything."
        />

        <motion.div
          className="gift-box-area"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >

          <motion.button
            className="gift-box-trigger"
            onClick={() => setShowGiftModal(true)}
            whileHover={{
              scale: 1.04,
              y: -5,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >

            <div className="gift-image-wrap">

              <img
                src="/images/gift-box.png"
                alt="Gift box"
                className="gift-box-image"
              />

              <span className="gift-spark spark-one">✦</span>
              <span className="gift-spark spark-two">✦</span>
              <span className="gift-spark spark-three">✧</span>

            </div>

            <span className="gift-tap-text">
              TAP TO OPEN
            </span>

          </motion.button>

          <p className="gift-bottom-note">
            A small gesture, a big blessing
          </p>

          <div className="gift-mini-divider">
            <span />
            <b>◆</b>
            <span />
          </div>

        </motion.div>

      </section>


      {/* =====================================================
          GIFT PAYMENT MODAL
          ===================================================== */}

      <AnimatePresence>

        {showGiftModal && (

          <motion.div
            className="gift-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowGiftModal(false);
              }
            }}
          >

            <motion.div
              className="gift-modal"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 25,
                scale: 0.97,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
            >

              {/* ================= HEADER ================= */}

              <div className="gift-modal-header">

                <div className="modal-corner modal-corner-left">
                  ❧
                </div>

                <div>
                  <p>With love</p>

                  <h2>GIFT BOX</h2>

                  <div className="modal-title-divider">
                    <span />
                    <b>◆</b>
                    <span />
                  </div>
                </div>

                <button
                  className="gift-modal-close"
                  onClick={() => setShowGiftModal(false)}
                  aria-label="Close gift box"
                >
                  ×
                </button>

              </div>


              {/* ================= BODY ================= */}

              <div className="gift-modal-body">

                <div className="gift-modal-intro">

                  <div className="gift-intro-icon">
                    <Gift size={25} strokeWidth={1.5} />
                  </div>

                  <div>

                    <h3>A token of love</h3>

                    <p>
                      If you wish to send a gift, you can contribute
                      using the details below.
                    </p>

                  </div>

                </div>


                {/* ================= BANK ACCOUNTS ================= */}

                <div className="payment-columns">


                  {/* ================= GROOM ================= */}

                  <div className="payment-card">

                    <div className="bank-heading">

                      <div>
                        <p className="bank-person">
                          Groom
                        </p>

                        <h3>
                          HDFC Bank
                        </h3>
                      </div>

                    </div>


                    <div className="qr-wrapper">

                      <img
                        src="/images/groom-qr.png"
                        alt="Groom HDFC Bank QR code"
                        className="payment-qr"
                      />

                    </div>


                    <p className="qr-note">
                      This QR contains the account
                      <br />
                      details for the gift transfer.
                    </p>


                    <div className="account-details">

                      <strong>
                        50100324778190
                      </strong>

                      <span>
                        Akash Singh
                      </span>

                    </div>


                    <button
                      className="save-qr-button"
                      onClick={() =>
                        saveQR(
                          "/images/groom-qr.png",
                          "arjun-mehta-qr.png"
                        )
                      }
                    >
                      <span>↓</span>
                      Save QR
                    </button>

                  </div>


                  {/* ================= CENTER DIVIDER ================= */}

                  <div className="payment-divider">

                    <span />

                    <b>✦</b>

                    <span />

                  </div>


                  {/* ================= BRIDE ================= */}

                  <div className="payment-card">

                    <div className="bank-heading">

                      <div>
                        <p className="bank-person">
                          Bride
                        </p>

                        <h3>
                          ICICI Bank
                        </h3>
                      </div>

                    </div>


                    <div className="qr-wrapper">

                      <img
                        src="/images/bride-qr.png"
                        alt="Bride ICICI Bank QR code"
                        className="payment-qr"
                      />

                    </div>


                    <p className="qr-note">
                      This QR contains the account
                      <br />
                      details for the gift transfer.
                    </p>


                    <div className="account-details">

                      <strong>
                        602401518846
                      </strong>

                      <span>
                        Aarzoo Singh
                      </span>

                    </div>


                    <button
                      className="save-qr-button"
                      onClick={() =>
                        saveQR(
                          "/images/bride-qr.png",
                          "priya-sharma-qr.png"
                        )
                      }
                    >
                      <span>↓</span>
                      Save QR
                    </button>

                  </div>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-art" />

      <div className="footer-content">
        <p>With love</p>

        <h2>
          {COUPLE.brideFirst}
          <span>&</span>
          {COUPLE.groomFirst}
        </h2>

        <LotusDivider />

        <p>
          We can't wait to celebrate
          <br />
          with you.
        </p>

        <div className="footer-date">
          25 · 11 · 2026
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MUSIC BUTTON
   ============================================================ */

function MusicButton({ audioRef, playing, setPlaying }) {
  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (error) {
      console.error("Music playback failed:", error);
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      className={`music-button ${playing ? "is-playing" : ""}`}
      onClick={toggleMusic}
      aria-label={playing ? "Pause wedding music" : "Play wedding music"}
      aria-pressed={playing}
    >
      {playing ? (
        <Volume2 size={17} />
      ) : (
        <VolumeX size={17} />
      )}
    </button>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const startMusic = async () => {
    try {
      const audio = audioRef.current;

      if (!audio) return;

      audio.volume = 0.45;
      audio.loop = true;

      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Music playback failed:", error);
    }
  };

  const handleOpen = async () => {
    setOpened(true);

    // Wait for the invitation/music element to render
    setTimeout(async () => {
      await startMusic();
    }, 100);
  };

  return (
    <>
      {/* Music */}
      <audio
        ref={audioRef}
        src="/wedding-music.mp3"
        preload="auto"
        loop
      />

      <AnimatePresence>
        {!opened && (
          <OpeningGate onOpen={handleOpen} />
        )}
      </AnimatePresence>

      {opened && (
        <motion.main
          className="site"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <MusicButton
            audioRef={audioRef}
            playing={playing}
            setPlaying={setPlaying}
          />

          <Hero />

          <FamilySection />

          <GallerySection />

          <CountdownSection />

          <CeremonySection />

          <ScheduleSection />

          <CalendarSection />

          <DressCodeSection />

          <GuestbookSection />

          <GiftSection />

          <Footer />
        </motion.main>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);