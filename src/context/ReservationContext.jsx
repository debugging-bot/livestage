import { createContext, useContext, useState, useEffect } from "react";
import { getVenue } from '../data/venues';
import { addDays, getSlot, slotPrice } from '../utils';

const Ctx = createContext(null);
const RES_KEY = 'livestage-reservations_v2';
const FAV_KEY = 'livestage-favorites_v1';

function load(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // 저장 불가 환경에서는 메모리에서만 동작
    }
}

function makeSeed(id, venueId, eventName, offset, slotId, people, status) {
    const venue = getVenue(venueId);
    const date = addDays(offset);
    return {
        id, venueId, eventName, date, slotId, people, status,
        band: '보컬 1 / 기타 2 / 베이스 1 / 드럼 1',
        note: '', name: '홍길동', 
        phone: '010-1234-5678', 
        email: 'user@example.com',
        total: slotPrice(venue, getSlot(slotId), date) 
    };
}

const seed = () => [
    makeSeed('R-1001', 1, '왕산악 49기 정기공연', 10, 'night', 150, '예약 완료'),
    makeSeed('R-1002', 2, '동아리 연합 공연', 35, 'day', 200, '예약 대기'),
    makeSeed('R-0990', 4, '봄 페스티벌 리허설', -20, 'night', 100, '이용 완료'),
    makeSeed('R-0981', 6, '밴드 합주 촬영', -45, 'day', 60, '이용 완료'),
    makeSeed('R-0950', 7, '졸업 콘서트', -70, 'full', 170, '이용 완료')
]

export function ReservationProvider({ children }) {
    const [reservations, setReservations] = useState(() => load(RES_KEY, seed()));
    const [favorites, setFavorites] = useState(() => load(FAV_KEY, [1, 4,]));

    useEffect(() => save(RES_KEY, reservations), [reservations]);
    useEffect(() => save(FAV_KEY, favorites), [favorites]);

    const addReservation = (data) => {
        const id = `R-${crypto.randomUUID()}`;
        setReservations((prev) => [{ ...data, id, status: '예약 완료' }, ...prev]);
        return id;
    };

    const cancelReservation = (id) => 
        setReservations((prev) => 
            prev.map((removeObj) => 
                removeObj.id === id ? { ...removeObj, status: '취소' } : removeObj));

    const toggleFavorite = (id) =>
        setFavorites((prev) => 
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

    const isFavorite = (id) => favorites.includes(id);

    return (
        <Ctx.Provider value={{ 
            reservations, addReservation, cancelReservation, 
            favorites, toggleFavorite, isFavorite 
            }}>
            {children}
            </Ctx.Provider>
    );
}

export const useReservations = () => useContext(Ctx);