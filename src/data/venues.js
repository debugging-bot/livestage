// 더미 데이터: 홍대 인근 공연장 10곳
// basePrice = 평일 종일 대관료(목록에 '~부터'로 표시), weekendPrice = 주말(토·일) 종일 대관료
// ※ 가격·수용 인원은 홍대 라이브클럽 시세를 참고한 추정치이며 실제 요금이 아닙니다.
export const REGIONS = ['서울 전체', '홍대', '합정', '상수', '망원'];
export const CATEGORIES = ['전체', '라이브홀', '소규모 공연장', '대관 스튜디오', '야외 공연장'];
export const PEOPLE_OPTIONS = [50, 100, 150, 200, 250, 300];
export const BUDGET_OPTIONS = [0, 500000, 1000000, 1500000, 2000000]; // 0 = 제한 없음

// ratio: 종일 대관료 대비 비율 (종일 대관료 = 평일 basePrice / 주말 weekendPrice)
export const TIME_SLOTS = [
    { id: 'day', name: '낮 타임', label: '14:00 ~ 18:00', ratio: 1 / 3 },
    { id: 'night', name: '저녁 타임', label: '18:00 ~ 22:00', ratio: 2 / 3 },
    { id: 'full', name: '종일', label: '14:00 ~ 22:00', ratio: 1 },
];

const RAW = [
    {
        id: 1, name: '홍대 클럽 FF', region: '홍대', category: '라이브홀',
        address: '서울 마포구 잔다리로 32 지하 1층', capacity: 200, basePrice: 700000,
        weekendPrice: 1000000, rating: 4.8, reviewCount: 124, area: 68, hours: '10:00 ~ 24:00',
        parking: '가능(유료)',
        equipment: ['드럼', '기타앰프', '베이스앰프', 'PA'],
        description: '인디밴드 공연에 최적화된 홍대 대표 라이브홀입니다.',
        x: 52, y: 52, hues: [340, 260],
    },
    {
        id: 2, name: '블루라이트 홀', region: '홍대', category: '라이브홀', address: '서울 마포구 와우산로21길 18', capacity: 250, basePrice: 900000,
        weekendPrice: 1300000,
        rating: 4.7, reviewCount: 98, area: 82, hours: '10:00 ~ 24:00', parking: '가능',
        equipment: ['드럼', '기타앰프', '베이스앰프', '키보드', 'PA'],
        description: '푸른 조명 연출이 강점인 중대형 라이브홀. 음향 시설이 탄탄합니다.', x: 62, y: 38, hues: [215, 280],
    },
    {
        id: 3, name: '마포 라이브홀', region: '합정', category: '라이브홀',
        address: '서울 마포구 양화로 45 지하 1층', capacity: 300, basePrice: 1200000, weekendPrice: 1800000,
        rating: 4.6, reviewCount: 87, area: 110, hours: '12:00 ~ 24:00', parking: '가능 (유료)',
        equipment: ['드럼', '기타앰프', '베이스앰프', '키보드', 'PA', '조명 콘솔'],
        description: '최대 300명까지 수용하는 대형 공연장. 페스티벌급 무대를 경험해 보세요.', x: 34, y: 70, hues: [28, 350],
    },
    {
        id: 4, name: '프리즘 홀', region: '홍대', category: '소규모 공연장',
        address: '서울 마포구 어울마당로 63 2층', capacity: 150, basePrice: 600000, weekendPrice: 900000,
        rating: 4.5, reviewCount: 76, area: 52, hours: '10:00 ~ 23:00', parking: '불가',
        equipment: ['드럼', '기타앰프', '베이스앰프', 'PA'],
        description: '아담하지만 사운드가 깔끔한 150명 규모의 공연장입니다.', x: 44, y: 34, hues: [280, 190],
    },
    {
        id: 5, name: '언더그라운드 쉘터', region: '상수', category: '소규모 공연장',
        address: '서울 마포구 독막로15길 9 지하', capacity: 60, basePrice: 300000, weekendPrice: 450000,
        rating: 4.4, reviewCount: 52, area: 34, hours: '12:00 ~ 23:00', parking: '불가',
        equipment: ['드럼', '기타앰프', 'PA'],
        description: '첫 단독 공연, 소규모 쇼케이스에 어울리는 아늑한 지하 공간.', x: 18, y: 44, hues: [8, 320],
    },
    {
        id: 6, name: '스튜디오 하울', region: '상수', category: '대관 스튜디오',
        address: '서울 마포구 상수동 331-5 3층', capacity: 100, basePrice: 400000, weekendPrice: 600000,
        rating: 4.6, reviewCount: 64, area: 45, hours: '09:00 ~ 23:00', parking: '가능',
        equipment: ['드럼', '기타앰프', '베이스앰프', '키보드', 'PA'], description: '촬영과 합주, 소규모 공연이 모두 가능한 다목적 대관 스튜디오.', x: 26, y: 26, hues: [170, 300],
    },
    {
        id: 7, name: '레드룸', region: '홍대', category: '라이브홀',
        address: '서울 마포구 홍익로 21 지하 1층', capacity: 180, basePrice: 650000, weekendPrice: 950000,
        rating: 4.5, reviewCount: 91, area: 60, hours: '11:00 ~ 24:00', parking: '가능 (유료)',
        equipment: ['드럼', '기타앰프', '베이스앰프', '키보드', 'PA'], description: '붉은 조명과 빈티지 인테리어로 유명한 홍대의 라이브 클럽.',
        x: 70, y: 55, hues: [355, 20],
    },
    {
        id: 8, name: '서교 사운드박스', region: '홍대', category: '대관 스튜디오',
        address: '서울 마포구 서교동 395-12 4층', capacity: 80, basePrice: 250000, weekendPrice: 350000,
        rating: 4.3, reviewCount: 41, area: 38, hours: '10:00 ~ 22:00', parking: '불가',
        equipment: ['드럼', '기타앰프', '베이스앰프', 'PA'],
        description: '리허설과 소규모 공연을 함께 진행하기 좋은 방음 스튜디오.', x: 56, y: 66, hues: [200, 320],
    },
    {
        id: 9, name: '합정 스테이지 소극장', region: '합정', category: '소규모 공연장',
        address: '서울 마포구 월드컵로 12길 7', capacity: 220, basePrice: 800000, weekendPrice: 1200000,
        rating: 4.6, reviewCount: 68, area: 74, hours: '10:00 ~ 23:00', parking: '가능',
        equipment: ['드럼', '기타앰프', '베이스앰프', '키보드', 'PA', '조명 콘솔'], description: '객석 경사가 있어 어디서든 무대가 잘 보이는 소극장형 공연장.',
        x: 44, y: 82, hues: [255, 40],
    },
    {
        id: 10, name: '망원 루프탑 라이브', region: '망원', category: '야외 공연장',
        address: '서울 마포구 망원로 58 옥상', capacity: 100, basePrice: 500000, weekendPrice: 750000,
        rating: 4.4, reviewCount: 57, area: 48, hours: '14:00 ~ 22:00', parking: '불가',
        equipment: ['드럼', '기타앰프', '베이스앰프', 'PA'],
        description: '노을과 함께하는 옥상 야외 공연장. 우천 시 일정 변경이 가능합니다.', x: 20, y: 86, hues: [25, 200],
    },
];


export const VENUES = RAW.map((v) => ({
    ...v, tags: [v.category, v.region]
}));


export const getVenue = (id) =>
    VENUES.find(
        (v) => v.id === Number(id)
    );

export const EQUIP_DETAIL = {
    드럼: '5피스 드럼 키트 (심벌 포함)',
    기타앰프: '기타 앰프 2대 (마샬/펜더 계열)',
    베이스앰프: '베이스 앰프 1대',
    키보드: '스테이지 피아노 1대',
    PA: '메인 PA + 모니터 스피커 4개',
    '조명 콘솔': 'LED 무빙 조명 + 조명 콘솔',
};

const REVIEW_POOL = [
    { user: '밴드 노이즈캔들', rating: 5, date: '2026.08.23', text: '사운드가 정말 좋 아요. 엔지니어분이 친절해서 리허설부터 편하게 진행했습니다.' },
    { user: '동아리 소리샘', rating: 4, date: '2026.08.09', text: '동선이 좋고 대기 공간이 넉넉했어요. 주차만 조금 아쉬웠습니다.' },
    { user: '인디밴드 새벽', rating: 5, date: '2026.07.27', text: '조명 연출이 예뻐서 공연 영상이 잘 나왔어요. 다음에도 여기서 하려고요.' },
    { user: '솔로 아티스트 J', rating: 4, date: '2026.07.12', text: '장비 상태가 깔끔 합니다. 대관료 대비 만족도가 높았어요.' },
    { user: '밴드 파도소리', rating: 5, date: '2026.06.30', text: '관객과의 거리가 가 까워서 분위기가 뜨거웠습니다. 강력 추천!' },
];

export const getReviews = (venue) =>
    [0, 1, 2].map(
        (i) => REVIEW_POOL[(venue.id + i) % REVIEW_POOL.length]
    );
