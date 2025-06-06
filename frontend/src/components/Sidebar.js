import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-category">
        <h3 className="category-title">SÁCH THẾ GIỚI</h3>
        <ul className="category-list">
          <li>
            <Link to={`/category/${encodeURIComponent('Viễn Tưởng')}`}>Viễn Tưởng</Link>
          </li>
          <li>
            <Link to={`/category/${encodeURIComponent('Khoa Học')}`}>Khoa Học</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-category">
        <h3 className="category-title1">SÁCH TÂM LINH</h3>
        <ul className="category-list">
          <li>
            <Link to={`/category/${encodeURIComponent('Tâm Linh')}`}>Tâm Linh</Link>
          </li>
          <li>
            <Link to={`/category/${encodeURIComponent('Phật Pháp')}`}>Phật Pháp</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-category">
        <h3 className="category-title2">SÁCH GIA ĐÌNH</h3>
        <ul className="category-list">
          <li>
            <Link to={`/category/${encodeURIComponent('Bố Mẹ')}`}>Bố Mẹ</Link>
          </li>
          <li>
            <Link to={`/category/${encodeURIComponent('Giáo Dục')}`}>Giáo Dục</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-category">
        <h3 className="category-title3">SÁCH ĐỜI SỐNG</h3>
        <ul className="category-list">
          <li>
            <Link to={`/category/${encodeURIComponent('Kỹ Năng Sống')}`}>Kỹ Năng Sống</Link>
          </li>
          <li>
            <Link to={`/category/${encodeURIComponent('Phát Triển Bản Thân')}`}>Phát Triển Bản Thân</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-category">
        <h3 className="category-title4">SÁCH TRIẾT</h3>
        <ul className="category-list">
          <li>
            <Link to={`/category/${encodeURIComponent('Tiểu Thuyết')}`}>Tiểu Thuyết</Link>
          </li>
          <li>
            <Link to={`/category/${encodeURIComponent('Tâm Lý Học')}`}>Tâm Lý Học</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
