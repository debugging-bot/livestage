// 실제 사진 대신 조명 그라데이션으로 공연장 이미지를 대신한다.
// 나중에 venue.images = ['url', ...] 을 추가해서 <img>로 교체하면 된다.
export default function VenueImage({ venue, index = 0, className = '', children }) {
  const [h1, h2] = venue.hues;
  const shift = index * 17;
  const style = {
    background: `
      radial-gradient(circle at ${20 + ((index * 23) % 60)}% 25%, hsla(${h1 + shift},90%,60%,.85) 0, transparent 38%),
      radial-gradient(circle at ${75 - ((index * 19) % 50)}% 30%, hsla(${h2 + shift},90%,55%,.8) 0, transparent 40%),
      linear-gradient(180deg, #1a1420 0%, #0d0a12 100%)`,
  };
  return (
    <div className={`vimg ${className}`} style={style}>
      <div className="vimg-stage" />
      <div className="vimg-amp a1" />
      <div className="vimg-amp a2" />
      {children}
    </div>
  );
}