import { useState } from 'react';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar() {
    const now = new Date();
    const [cur, setCur] = useState({ y: now.getFullYear(), m: now.getMonth() 
    });

    const move = (delta) => {
        const d = new Date(cur.y, cur.m + delta, 1);
        setCur({ y: d.getFullYear(), m: d.getMonth() });
    };

    const first = new Date(cur.y, cur.m, 1).getDay();
    const total = new Date(cur.y, cur.m + 1, 0).getDate();
    const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

    return (
        <div className="cal">
            <div className="cal-head">
            <button type="button" onClick={() => move(-1)}>‹</button>
            <strong>{cur.y}년 {cur.m + 1}월</strong>
            <button type="button" onClick={() => move(1)}>›</button>
            </div>
            <div className="cal-grid">
                {DOW.map((d) => <span key={d} className="cal-dow">{d}</span>)}
                {cells.map((d, i) =>
                    d === null ? <span key={`e${i}`} /> : <button type="button" key={d} className="cal-day available">{d}</button>
                )}
            </div>
        </div>
    );
}