import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Stepper from "../components/Stepper";
import VenueImage from "../components/VenueImage";
import { TIME_SLOTS, getVenue } from "../data/venues";
import { useReservations } from "../context/ReservationContext";
import {
  dayPrice,
  dayStatus,
  formatDateKo,
  formatPrice,
  getSlot,
  isSlotBlocked,
  isWeekend,
  slotPrice,
  takenSlots,
} from "../utils";

const STEPS = ["날짜/시간 선택", "정보 입력", "예약 확인", "완료"];

export default function Booking() {
  const { id } = useParams();
  const venue = getVenue(id);
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { reservations } = useReservations();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(() => {
    const d = sp.get("date");
    return venue && d && dayStatus(venue.id, d, reservations) === "available"
      ? d
      : "";
  });
  const [slotId, setSlotId] = useState("");

  if (!venue) {
    return (
      <div className="container empty">
        존재하지 않는 공연장입니다. <Link to="/search">공연장 찾기</Link>
      </div>
    );
  }

  const taken = date ? takenSlots(venue.id, date, reservations) : null;
  const slot = slotId ? getSlot(slotId) : null;
  const total = slot ? slotPrice(venue, slot, date) : 0;

  const pickDate = (d) => {
    setDate(d);
    setSlotId("");
  };

  const Summary = () => (
    <aside className="sum-card">
      <h3>선택한 공연장</h3>
      <div className="sum-venue">
        <VenueImage venue={venue} className="sum-img" />
        <div>
          <b>{venue.name}</b>
          <span>{venue.address}</span>
          {date && <span>📅 {formatDateKo(date)}</span>}
          {slot && <span>🕒 {slot.label}</span>}
          <span>
            💰{" "}
            {slot
              ? formatPrice(total)
              : date
                ? `${formatPrice(dayPrice(venue, date))} (${isWeekend(date) ? "주말" : "평일"} 종일)`
                : `${formatPrice(venue.basePrice)} ~`}
          </span>
        </div>
      </div>
      {slot && (
        <div className="sum-total">
          <span>총 결제 금액</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      )}
    </aside>
  );

  return (
    <div className="container page">
      <div className="book-title">
        <button
          className="back"
          onClick={() =>
            step > 1 && step < 4
              ? setStep(step - 1)
              : navigate(`/venues/${venue.id}`)
          }
        >
          ←
        </button>
        <h1>예약하기</h1>
      </div>
      <Stepper steps={STEPS} current={step} />

      {step === 1 && (
        <div className="step1-grid">
          <Summary />

          <div className="panel">
            <h3>날짜 선택</h3>
            {/* Calendar 완성되면 input을 달력으로 교체. */}
            <input
              type="date"
              value={date}
              onChange={(e) => pickDate(e.target.value)}
            />
          </div>

          <div className="panel">
            <h3>
              시간 선택
              {date && (
                <small className="hint">
                  {" "}
                  · {isWeekend(date) ? "주말 요금" : "평일 요금"}
                </small>
              )}
            </h3>
            {!date ? (
              <p className="hint">먼저 날짜를 선택해 주세요.</p>
            ) : (
              <div className="slots">
                {TIME_SLOTS.map((s) => {
                  const blocked = isSlotBlocked(taken, s.id);
                  return (
                    <button
                      key={s.id}
                      disabled={blocked}
                      className={`slot ${slotId === s.id ? "selected" : ""}`}
                      onClick={() => setSlotId(s.id)}
                    >
                      <span>
                        {s.name} · {s.label}
                      </span>
                      <strong>
                        {blocked
                          ? "마감"
                          : formatPrice(slotPrice(venue, s, date))}
                      </strong>
                    </button>
                  );
                })}
              </div>
            )}
            <button
              className="btn-primary block"
              disabled={!date || !slotId}
              onClick={() => setStep(2)}
            >
              다음 단계
            </button>
          </div>
        </div>
      )}

      {step === 2 && <div className="panel">2단계 화면 제작 예정.</div>}
    </div>
  );
}