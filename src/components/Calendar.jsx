import { useState } from "react";
import { BOOKING_END, BOOKING_START, parseDate, toDateStr } from "../utils";

// 문자열을 연월 숫자로 변환
const ym = (s) => {
  const d = parseDate(s);
  return d.getFullYear() * 12 + d.getMonth();
};

const MIN = ym(BOOKING_START);
const MAX = ym(BOOKING_END);

// 요일
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

// statusOf(dateStr) => 'available' | 'booked' | 'past'

export default function Calendar({ value, onSelect, statusOf }) {
  const start = value ? parseDate(value) : new Date();

  const startIdx = Math.min(
    Math.max(start.getFullYear() * 12 + start.getMonth(), MIN),
    MAX,
  );

  const [cur, setCur] = useState({
    y: Math.floor(startIdx / 12),
    m: startIdx % 12,
  });

  const curIdx = cur.y * 12 + cur.m;
  const canPrev = curIdx > MIN;
  const canNext = curIdx < MAX;

  // 월 이동
  const move = (delta) => {
    const d = new Date(cur.y, cur.m + delta, 1);

    setCur({
      y: d.getFullYear(),
      m: d.getMonth(),
    });
  };

  // 달력 날짜 계산
  const first = new Date(cur.y, cur.m, 1).getDay();
  const total = new Date(cur.y, cur.m + 1, 0).getDate();

  const cells = [
    ...Array(first).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canPrev}
          aria-label="이전 달"
        >
          ‹
        </button>

        <strong>
          {cur.y}년 {cur.m + 1}월
        </strong>

        <button
          type="button"
          onClick={() => move(1)}
          disabled={!canNext}
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {DOW.map((d, i) => (
          <span
            key={d}
            className={`cal-dow ${i === 0 ? "sun" : ""} ${i === 6 ? "sat" : ""}`}
          >
            {d}
          </span>
        ))}

        {cells.map((d, i) => {
          if (d === null) {
            return <span key={`e${i}`} />;
          }

          const ds = toDateStr(new Date(cur.y, cur.m, d));
          const st = statusOf(ds);
          const selected = ds === value;

          return (
            <button
              type="button"
              key={ds}
              disabled={st !== "available"}
              onClick={() => onSelect(ds)}
              className={`cal-day ${st} ${selected ? "selected" : ""}`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="cal-legend">
        <span>
          <i className="dot green" />
          예약 가능
        </span>

        <span>
          <i className="dot red" />
          예약 마감
        </span>

        <span>
          <i className="dot pink" />
          선택
        </span>
      </div>
    </div>
  );
}
