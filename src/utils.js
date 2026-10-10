import { TIME_SLOTS } from './data/venues.js';

const pad = (n) => String(n).padStart(2, '0'); 
const DOW = ['일', '월', '화', '수', '목', '금', '토'];

export const toDateStr = (d) => 
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDate = (s) => {
    const [y, m, d] = s.split('-').map(Number); 
    return new Date(y, m - 1, d);
};

export const todayStr = () => toDateStr(new Date()); 

export const addDays = (n) => {
    const d = new Date(); 
    d.setDate(d.getDate() + n); 
    return toDateStr(d);
};

export const formatDateKo = (s) => {
    const d = parseDate(s);
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DOW[d.getDay()]})`;
};

export const formatPrice = (n) => `${n.toLocaleString('ko-KR')}원`;


// 예약 가능한 기간 (2026년 10월 ~ 2027년 1월) 
export const BOOKING_START = '2026-10-01'; 
export const BOOKING_END = '2027-01-31';
export const inBookingRange = (s) => s >= BOOKING_START && s <= BOOKING_END;


// 주말 = 토·일. 주말에는 weekendPrice, 평일에는 basePrice를 종일 대관료로 사용한다. 
export const isWeekend = (s) => [0, 6].includes(parseDate(s).getDay());
export const dayPrice = (venue, dateStr) => 
    (dateStr && isWeekend(dateStr) ? venue.weekendPrice : venue.basePrice);
export const slotPrice = (venue, slot, dateStr) => 
    Math.round((dayPrice(venue, dateStr) * slot.ratio) / 10000) * 10000;
export const getSlot = (id) => 
    TIME_SLOTS.find((s) => s.id === id);


// ---- 예약 가능 여부 (더미 로직) ----
// 공연장/날짜 조합으로 일부 시간대를 "이미 예약됨"으로 만들고, 내 예약 내역도 반영한다. 
const hash = (s) => {
    let h = 0;
    for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
};

export function takenSlots(venueId, dateStr, reservations = []) {
    const taken = new Set();
    const h = hash(`${venueId}-${dateStr}`); 
    if (h % 7 === 0) taken.add('full');
    else if (h % 5 === 0) taken.add('night'); 
    reservations.forEach((r) => {
        if (r.venueId === venueId && r.date === dateStr && r.status !== '취소')
            taken.add(r.slotId);
    });
    return taken;
}

export const isSlotBlocked = (taken, slotId) =>
    taken.has('full') || taken.has(slotId) || (slotId === 'full' && taken.size > 0);

// 'past' | 'booked' | 'available'
export function dayStatus(venueId, dateStr, reservations) {
    if (dateStr <= todayStr() || !inBookingRange(dateStr))
        return 'past';
    const taken = takenSlots(venueId, dateStr, reservations);
    return TIME_SLOTS.every((s) => isSlotBlocked(taken, s.id)) ? 'booked' : 'available';
}

