import { useCallback, useMemo, useRef, useState } from "react";
import okYay from "./assets/ok-yay.gif";
import "./App.css";

const NO_PHRASES = [
  "No",
  "Really?",
  "Are you sure?",
  "Think again?",
  "Please?",
  "Come on...",
  "Don't be shy",
  "One more chance?",
  "You're teasing me",
  "Say yes?",
  "I'm waiting...",
  "Last chance?",
];

type Position = { top: number; left: number };

type Band = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function App() {
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({ top: 55, left: 55 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const lastNoIndex = NO_PHRASES.length - 1;
  const noLabel = NO_PHRASES[Math.min(noClicks, lastNoIndex)];
  const promptText = accepted ? (
    <>
      I knew it,
      <br />
      my queen.
    </>
  ) : (
    "Will you be my valentines my queen"
  );
  const subtitleText = accepted
    ? ""
    : "I saved a spot just for us, wrapped in roses and a quiet promise.";

  const acceptedText = "You just made my whole world glow.";

  const getRandomPositionOutsideCard = useCallback((): Position => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const padding = 24;
    const cardRect = cardRef.current?.getBoundingClientRect();

    if (!cardRect) {
      return {
        left: padding + Math.random() * (width - padding * 2),
        top: padding + Math.random() * (height - padding * 2),
      };
    }

    const bands: Band[] = [
      {
        minX: padding,
        maxX: width - padding,
        minY: padding,
        maxY: Math.max(padding, cardRect.top - padding),
      },
      {
        minX: padding,
        maxX: width - padding,
        minY: Math.min(height - padding, cardRect.bottom + padding),
        maxY: height - padding,
      },
      {
        minX: padding,
        maxX: Math.max(padding, cardRect.left - padding),
        minY: padding,
        maxY: height - padding,
      },
      {
        minX: Math.min(width - padding, cardRect.right + padding),
        maxX: width - padding,
        minY: padding,
        maxY: height - padding,
      },
    ];

    const validBands = bands.filter(
      (band) => band.maxX - band.minX > 20 && band.maxY - band.minY > 20
    );

    const chosen =
      validBands[Math.floor(Math.random() * validBands.length)] ?? bands[1];

    return {
      left: chosen.minX + Math.random() * (chosen.maxX - chosen.minX),
      top: chosen.minY + Math.random() * (chosen.maxY - chosen.minY),
    };
  }, []);

  const handleNo = () => {
    setNoClicks((current) => Math.min(current + 1, NO_PHRASES.length));
    setNoPosition(getRandomPositionOutsideCard());
  };

  const handleYes = () => {
    setAccepted(true);
  };

  const noStyle = useMemo(
    () => ({
      top: `${noPosition.top}px`,
      left: `${noPosition.left}px`,
    }),
    [noPosition]
  );

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <main className={accepted ? "card accepted" : "card"} ref={cardRef}>
        <svg className="heart-bg" viewBox="0 0 400 360" aria-hidden="true">
          <path
            className="heart-path"
            d="M200 320
               C120 260 40 200 40 120
               C40 70 80 40 125 40
               C160 40 185 60 200 85
               C215 60 240 40 275 40
               C320 40 360 70 360 120
               C360 200 280 260 200 320 Z"
          />
        </svg>
        <div className="card-content">
          <p className="eyebrow">For my favorite person</p>
          <h1 className="title" aria-live="polite">
            {promptText}
          </h1>
          {accepted && <p className="accepted-text">{acceptedText}</p>}
          {subtitleText && <p className="subtitle">{subtitleText}</p>}
          <div className="actions">
            {accepted ? (
              <img src={okYay} alt="Ok yay" className="sticker" />
            ) : (
              <>
                <button className="btn yes" type="button" onClick={handleYes}>
                  Yes
                </button>
                {noClicks === 0 && noClicks < NO_PHRASES.length && (
                  <button className="btn no" type="button" onClick={handleNo}>
                    {noLabel}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {accepted && (
        <div className="hearts-fall" aria-hidden="true">
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
          <span className="heart" />
        </div>
      )}
      {!accepted && noClicks > 0 && noClicks < NO_PHRASES.length && (
        <button
          className="btn no floating"
          type="button"
          onClick={handleNo}
          style={noStyle}
        >
          {noLabel}
        </button>
      )}
      <div className="ribbon" aria-hidden="true" />
    </div>
  );
}

export default App;
