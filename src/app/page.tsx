"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const CARDS = [
  { src: "/card1.jpg", label: "Momen spesial" },
  { src: "/card2.jpg", label: "Foto bareng" },
  { src: "/card3.jpg", label: "Kenangan indah" },
];

export default function LandingPage() {
  const router = useRouter();
  const [active, setActive] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setActive((p) => (p + 1) % CARDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: .3; transform: scale(1); }
          50%       { opacity: .55; transform: scale(1.06); }
        }
        .glass {
          background: rgba(255,255,255,.07);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,.13);
          box-shadow: 0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.15);
        }
        .gpill {
          background: rgba(255,255,255,.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
        }
        .gbtn {
          background: rgba(236,72,153,.88);
          backdrop-filter: blur(20px) saturate(200%);
          -webkit-backdrop-filter: blur(20px) saturate(200%);
          border: 1px solid rgba(255,255,255,.28);
          box-shadow: 0 4px 28px rgba(236,72,153,.45), inset 0 1px 0 rgba(255,255,255,.3);
          cursor: pointer;
          transition: transform .15s ease;
        }
        .gbtn:hover  { transform: scale(1.025); }
        .gbtn:active { transform: scale(.97); }

        .photo-card {
          position: absolute;
          border-radius: 22px;
          overflow: hidden;
          cursor: pointer;
          width: clamp(140px, 28vw, 210px);
          height: clamp(186px, 37vw, 280px);
          transition: all .55s cubic-bezier(.34, 1.56, .64, 1);
        }
        .photo-card.is-active {
          transform: translateX(0) translateY(-10px) rotate(0deg) scale(1);
          z-index: 3; opacity: 1;
          box-shadow: 0 32px 72px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.1);
        }
        .photo-card.is-left {
          transform: translateX(-42%) translateY(16px) rotate(-15deg) scale(0.82);
          z-index: 2; opacity: 0.88;
          box-shadow: 0 10px 28px rgba(0,0,0,.5);
        }
        .photo-card.is-right {
          transform: translateX(42%) translateY(16px) rotate(15deg) scale(0.82);
          z-index: 2; opacity: 0.88;
          box-shadow: 0 10px 28px rgba(0,0,0,.5);
        }
        .photo-card.is-hidden {
          transform: scale(0.5); z-index: 0; opacity: 0;
        }
        .dot-btn {
          height: 6px; border: none;
          border-radius: 100px; cursor: pointer;
          padding: 0; transition: all .3s ease;
        }

        /* ── Mobile layout (default) ── */
        .landing-root {
          min-height: 100dvh;
          background: #080808;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .landing-inner {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 44px 24px 40px;
          position: relative;
          z-index: 1;
        }
        .card-stage {
          position: relative;
          width: 100%;
          height: clamp(230px, 50vw, 320px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
          margin-bottom: 32px;
        }

        /* ── Desktop layout (≥ 768px) ── */
        @media (min-width: 768px) {
          .landing-inner {
            max-width: 1100px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: clamp(48px, 6vw, 100px);
            padding: 60px 48px;
          }
          .left-col {
            flex: 1;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .right-col {
            flex: 1;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .card-stage {
            width: 100%;
            height: clamp(320px, 40vw, 480px);
          }
          .photo-card {
            width: clamp(180px, 18vw, 240px);
            height: clamp(240px, 24vw, 320px);
          }
          h1.brand {
            text-align: left !important;
            font-size: clamp(52px, 6vw, 80px) !important;
          }
          p.tagline {
            text-align: left !important;
          }
          .badge-wrap { align-self: flex-start; }
          .feature-grid { grid-template-columns: 1fr 1fr; }
          .cta-wrap { width: 100%; max-width: 360px; align-self: flex-start; }
          .dots-wrap { align-self: flex-start; }
        }

        /* ── Large desktop (≥ 1200px) ── */
        @media (min-width: 1200px) {
          .landing-inner { gap: 120px; }
          h1.brand { font-size: 88px !important; }
        }
      `}</style>

      <div className="landing-root">
        {/* Ambient glows */}
        {[
          {
            top: "-10%",
            left: "-10%",
            w: "55%",
            h: "55%",
            color: "rgba(168,85,247,.28)",
            dur: "6s",
            delay: "0s",
          },
          {
            top: "5%",
            right: "-8%",
            w: "48%",
            h: "48%",
            color: "rgba(236,72,153,.22)",
            dur: "8s",
            delay: "2s",
          },
          {
            bottom: "0",
            left: "20%",
            w: "50%",
            h: "40%",
            color: "rgba(99,102,241,.18)",
            dur: "7s",
            delay: "1s",
          },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              width: b.w,
              height: b.h,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
              animation: `pulse-glow ${b.dur} ease-in-out infinite ${b.delay}`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div className="landing-inner">
          {/* ── Left column (text + CTA) ── */}
          <div
            className="left-col"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <div
              className="badge-wrap"
              style={{ marginBottom: "clamp(20px, 3vw, 28px)" }}
            >
              <div
                className="gpill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 16px",
                  borderRadius: "100px",
                }}
              >
                <span style={{ fontSize: "13px" }}>📸</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,.7)",
                    fontWeight: 600,
                    letterSpacing: ".06em",
                  }}
                >
                  VIRTUAL PHOTOBOX
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="brand"
              style={{
                fontSize: "clamp(44px, 11vw, 64px)",
                fontWeight: 900,
                letterSpacing: "-2.5px",
                color: "#fff",
                margin: "0 0 12px",
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              Strip<span style={{ color: "#f472b6" }}>Kita</span>
            </h1>

            <p
              className="tagline"
              style={{
                fontSize: "clamp(13px, 2.5vw, 16px)",
                color: "rgba(255,255,255,.38)",
                margin: "0 0 clamp(28px, 4vw, 40px)",
                letterSpacing: ".01em",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Virtual photobox langsung di browser.
              <br />
              Jepret, pilih, hias — download gratis.
            </p>

            {/* Features */}
            <div className="feature-grid">
              {[
                { icon: "🎞️", text: "6 foto otomatis" },
                { icon: "✂️", text: "Pilih terbaik" },
                { icon: "✨", text: "Hias & caption" },
                { icon: "🔒", text: "Privat, no server" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="glass"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    borderRadius: "16px",
                  }}
                >
                  <span style={{ fontSize: "clamp(16px, 3vw, 20px)" }}>
                    {f.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(11px, 2vw, 13px)",
                      color: "rgba(255,255,255,.75)",
                      fontWeight: 500,
                    }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="cta-wrap"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                className="gbtn"
                onClick={() => router.push("/setup")}
                style={{
                  width: "100%",
                  padding: "clamp(14px, 2.5vw, 20px)",
                  borderRadius: "20px",
                  fontSize: "clamp(15px, 2.5vw, 18px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-.2px",
                }}
              >
                Mulai Sekarang ✦
              </button>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "clamp(10px, 1.5vw, 12px)",
                  color: "rgba(255,255,255,.18)",
                  margin: 0,
                }}
              >
                Gratis · Tidak perlu akun · Data tidak tersimpan
              </p>
            </div>
          </div>

          {/* ── Right column (cards) ── */}
          <div
            className="right-col"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="card-stage">
              {CARDS.map((card, i) => {
                const isActive = i === active;
                const isLeft = i === (active - 1 + CARDS.length) % CARDS.length;
                const isRight = i === (active + 1) % CARDS.length;
                const cls = isActive
                  ? "is-active"
                  : isLeft
                    ? "is-left"
                    : isRight
                      ? "is-right"
                      : "is-hidden";

                return (
                  <div
                    key={i}
                    className={`photo-card ${cls}`}
                    onClick={() => setActive(i)}
                  >
                    <Image
                      src={card.src}
                      alt={card.label}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 40vw, 240px"
                      priority={i === 1}
                    />
                    {/* Glass label */}
                    <div
                      className="glass"
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        right: "10px",
                        borderRadius: "12px",
                        padding: "7px 10px",
                        zIndex: 2,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "clamp(10px, 2vw, 12px)",
                          fontWeight: 600,
                          color: "#fff",
                          textAlign: "center",
                          margin: 0,
                          letterSpacing: ".02em",
                        }}
                      >
                        {card.label}
                      </p>
                    </div>
                    {/* Glint */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,.12) 0%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Dots */}
            <div
              className="dots-wrap"
              style={{ display: "flex", gap: "6px", marginTop: "8px" }}
            >
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  className="dot-btn"
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? "20px" : "6px",
                    background:
                      i === active ? "#f472b6" : "rgba(255,255,255,.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
