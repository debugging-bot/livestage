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
const EMPTY = {
  name: "",
  phone: "",
  email: "",
  eventName: "",
  people: "",
  band: "",
  note: "",
};

export default function Booking() {
  const { id } = useParams();
  const venue = getVenue(id);
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { reservations, addReservation } = useReservations();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(() => {
    const d = sp.get("date");
    return venue && d && dayStatus(venue.id, d, reservations) === "available"
      ? d
      : "";
  });
  const [slotId, setSlotId] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [doneId, setDoneId] = useState("");

  if (!venue) {
    return (
      <div className="container empty">
        존재하지 않는 공연장입니다.{" "}
        <Link to="/search" className="accent">
          공연장 찾기
        </Link>
      </div>
    );
  }

  const taken = date ? takenSlots(venue.id, date, reservations) : null;
  const slot = slotId ? getSlot(slotId) : null;
  const total = slot ? slotPrice(venue, slot, date) : 0;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pickDate = (d) => {
    setDate(d);
    setSlotId("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!/^01\d-?\d{3,4}-?\d{4}$/.test(form.phone.trim()))
      e.phone = "연락처를 010-1234-5678 형식으로 입력해 주세요.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "올바른 이메일을 입력해 주세요.";
    if (!form.eventName.trim()) e.eventName = "공연명을 입력해 주세요.";
    const p = Number(form.people);
    if (!p || p < 1) e.people = "예상 관객 수를 입력해 주세요.";
    else if (p > venue.capacity)
      e.people = `이 공연장의 최대 수용 인원은 ${venue.capacity}명입니다.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = () => {
    const newId = addReservation({
      venueId: venue.id,
      date,
      slotId,
      total,
      ...form,
      people: Number(form.people),
    });
    setDoneId(newId);
    setStep(4);
  };

  const Summary = ({ children }) => (
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
      {children}
    </aside>
  );

  const field = ({ label, k, type = "text", placeholder, wide }) => (
    <div key={k} className={`field ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={form[k]}
          onChange={set(k)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={form[k]}
          onChange={set(k)}
          placeholder={placeholder}
        />
      )}
      {errors[k] && <p className="err">{errors[k]}</p>}
    </div>
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
            {/* 추후 아래 input을 달력으로 바꿔야합니다. */}
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

      {step === 2 && (
        <div className="step2-grid">
          <div className="panel">
            <h3>예약자 정보</h3>
            <div className="form-grid">
              {field({
                label: "이름",
                k: "name",
                placeholder: "이름을 입력하세요",
              })}
              {field({
                label: "연락처",
                k: "phone",
                placeholder: "010-1234-5678",
              })}
              {field({
                label: "이메일",
                k: "email",
                type: "email",
                placeholder: "example@email.com",
                wide: true,
              })}
            </div>
            <h3 className="mt">공연 정보</h3>
            <div className="form-grid">
              {field({
                label: "공연명",
                k: "eventName",
                placeholder: "예) 왕산악 49기 정기공연",
                wide: true,
              })}
              {field({
                label: `예상 관객 수 (최대 ${venue.capacity}명)`,
                k: "people",
                type: "number",
                placeholder: "150",
              })}
              {field({
                label: "밴드 구성",
                k: "band",
                placeholder: "보컬 1 / 기타 2 / 베이스 1 / 드럼 1",
              })}
              {field({
                label: "추가 요청 사항",
                k: "note",
                type: "textarea",
                placeholder: "드럼 세트, 기타 앰프 2대 대여 요청 등",
                wide: true,
              })}
            </div>
          </div>
          <Summary>
            <div className="btn-row">
              <button className="btn-outline" onClick={() => setStep(1)}>
                이전
              </button>
              <button
                className="btn-primary"
                onClick={() => validate() && setStep(3)}
              >
                예약 내용 확인
              </button>
            </div>
          </Summary>
        </div>
      )}

      {step === 3 && (
        <div className="step2-grid">
          <div className="panel">
            <h3>예약 내용을 확인해 주세요</h3>
            <ul className="info-list">
              <li>
                <b>공연장</b>
                <span>{venue.name}</span>
              </li>
              <li>
                <b>이용 일시</b>
                <span>
                  {formatDateKo(date)} · {slot.name} ({slot.label})
                </span>
              </li>
              <li>
                <b>예약자</b>
                <span>
                  {form.name} · {form.phone} · {form.email}
                </span>
              </li>
              <li>
                <b>공연명</b>
                <span>{form.eventName}</span>
              </li>
              <li>
                <b>예상 관객 수</b>
                <span>{form.people}명</span>
              </li>
              <li>
                <b>밴드 구성</b>
                <span>{form.band || "-"}</span>
              </li>
              <li>
                <b>요청 사항</b>
                <span>{form.note || "-"}</span>
              </li>
            </ul>
          </div>
          <Summary>
            <div className="btn-row">
              <button className="btn-outline" onClick={() => setStep(2)}>
                이전
              </button>
              <button className="btn-primary" onClick={confirm}>
                예약하기
              </button>
            </div>
          </Summary>
        </div>
      )}

      {step === 4 && (
        <div className="panel done">
          <div className="done-icon">✓</div>
          <h2>예약이 완료되었어요!</h2>
          <p>
            예약 번호 <b>{doneId}</b>
          </p>
          <p className="hint">
            {venue.name} · {formatDateKo(date)} · {slot.label} ·{" "}
            {formatPrice(total)}
          </p>
          <div className="btn-row center">
            <Link to="/mypage" className="btn-primary">
              예약 내역 보기
            </Link>
            <Link to="/" className="btn-outline">
              홈으로
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}