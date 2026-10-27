import { NavLink, Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();
  const light = pathname !== '/';
  return (
    <header className={`header ${light ? 'light' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-bars"><i /><i /><i /><i /><i /></span>
          LiveStage
        </Link>
        <nav className="nav">
          <NavLink to="/search">공연장 찾기</NavLink>
          <NavLink to="/map">지도 기반 검색</NavLink>
          <NavLink to="/mypage">마이페이지</NavLink>
        </nav>
        <div className="header-actions">
          <button className="btn-outline-sm">로그인</button>
          <button className="btn-primary-sm">회원가입</button>
        </div>
      </div>
    </header>
  );
}