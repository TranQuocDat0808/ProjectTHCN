import '../styles/About.css';
import Footer from '../components/Footer';
import { FaBook, FaUsers, FaGraduationCap, FaBookOpen, FaUserGraduate, 
         FaUniversity, FaLightbulb } from 'react-icons/fa';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-hero">
                <div className="hero-content">
                    <h1>Thư Viện FPT</h1>
                    <p>Nơi Tri Thức Gặp Gỡ Công Nghệ</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <FaBook className="stat-icon" />
                            <span>10,000+ Sách</span>
                        </div>
                        <div className="stat-item">
                            <FaUsers className="stat-icon" />
                            <span>5,000+ Độc giả</span>
                        </div>
                        <div className="stat-item">
                            <FaGraduationCap className="stat-icon" />
                            <span>100+ Chủ đề</span>
                        </div>
                    </div>
                </div>
            </div>
                {/* Existing welcome section */}         
                <section className="about-section highlights-section">
                    <h2>Điểm Nổi Bật Của Chúng Tôi</h2>
                    <div className="highlights-grid">
                        <div className="highlight-card">
                            <FaBookOpen className="highlight-icon" />
                            <h3>Kho Sách Đa Dạng</h3>
                            <p>Hơn 10,000 đầu sách từ nhiều lĩnh vực khác nhau</p>
                        </div>
                        <div className="highlight-card">
                            <FaUserGraduate className="highlight-icon" />
                            <h3>Hỗ Trợ Học Tập</h3>
                            <p>Tài liệu học tập được cập nhật liên tục</p>
                        </div>
                        <div className="highlight-card">
                            <FaUniversity className="highlight-icon" />
                            <h3>Môi Trường Học Tập</h3>
                            <p>Không gian học tập hiện đại và chuyên nghiệp</p>
                        </div>
                        <div className="highlight-card">
                            <FaLightbulb className="highlight-icon" />
                            <h3>Sáng Tạo & Đổi Mới</h3>
                            <p>Ứng dụng công nghệ tiên tiến trong quản lý thư viện</p>
                        </div>
                    </div>
                </section>

                <section className="about-section testimonials-section">
                   <h2>Thông Tin Về Thư Viện</h2>
                    <div className="library-info">
                        <div className="library-text">
                            <h3>FPT Library</h3>
                            <p className="library-subtitle">Bởi vì sách là thế giới</p>
                            <p>
                                Thư viện FPT là không gian tri thức nội bộ dành cho cán bộ, nhân viên công ty, đóng vai trò hỗ trợ nâng cao kiến thức chuyên môn, kỹ năng nghiệp vụ và phát triển văn hóa học tập liên tục trong doanh nghiệp.
                                Với nguồn tài liệu đa dạng từ công nghệ thông tin, quản trị, đến kỹ năng mềm, cùng hệ thống tra cứu hiện đại, thư viện không chỉ là nơi lưu trữ mà còn là trung tâm chia sẻ và lan tỏa tri thức trong toàn FPT.
                            </p>
                            <button className="library-button">Xem thêm</button>
                        </div>
                        <div className="library-image">
                            <img src="/images/FPT.webp" alt="Nhã Nam Bookstore" />
                        </div>
                    </div>
                </section>

                <section className="about-section reader-showcase">
                    <h2>Góc Học Tập</h2>
                    <div className="reader-grid">
                        <div className="reader-card">
                            <div className="reader-image">
                                <img src="/images/Thiet-ke-phong-hoc-voi-chat-lieu-go-chac-chan.jpg" alt="Khu vực học cá nhân" />
                            </div>
                            <div className="reader-content">
                                <h3>Khu Vực Học Cá Nhân</h3>
                                <p>Không gian yên tĩnh, riêng tư dành cho việc học tập và nghiên cứu cá nhân. Được trang bị đầy đủ ánh sáng và ổ cắm điện.</p>
                            </div>
                        </div>

                        <div className="reader-card">
                            <div className="reader-image">
                                <img src="/images/phong-hoc-thong-minh-1-9515-9766.jpg" alt="Khu vực học nhóm" />
                            </div>
                            <div className="reader-content">
                                <h3>Phòng Học Nhóm</h3>
                                <p>Không gian rộng rãi cho các hoạt động học nhóm và thảo luận. Trang bị bảng, máy chiếu và bàn ghế linh hoạt.</p>
                            </div>
                        </div>

                        <div className="reader-card">
                            <div className="reader-image">
                                <img src="/images/11.jpg" alt="Khu vực số" />
                            </div>
                            <div className="reader-content">
                                <h3>Khu Vực Số</h3>
                                <p>Trang bị máy tính hiện đại kết nối Internet tốc độ cao, phục vụ tra cứu tài liệu và học tập trực tuyến.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Update your existing gallery section with more images */}
                <div className="gallery-grid">
                    <div className="gallery-item large">
                        <img src="/images/thuvien.jpg" alt="Thư viện" />
                        <div className="gallery-overlay">
                            <h3>Thư Viện FPT</h3>
                            <p>Không gian học tập hiện đại</p>
                        </div>
                    </div>
                    <div className="gallery-item vertical">
                        <img src="/images/khuvuchoc.jpg" alt="Khu vực học" />
                        <div className="gallery-overlay">
                            <h3>Khu Vực Học Nhóm</h3>
                        </div>
                    </div>
                    <div className="gallery-item">
                        <img src="/images/thu-vien-tam-ky-181.jpg" alt="Phòng máy tính" />
                        <div className="gallery-overlay">
                            <h3>Phòng Máy Tính</h3>
                        </div>
                    </div>
                    <div className="gallery-item horizontal">
                        <img src="/images/thuong-mai-1.jpg" alt="Phòng đọc" />
                        <div className="gallery-overlay">
                            <h3>Phòng Đọc Yên Tĩnh</h3>
                        </div>
                    </div>
                    <div className="gallery-item">
                        <img src="/images/khuthaoluan.jpg" alt="Khu thảo luận" />
                        <div className="gallery-overlay">
                            <h3>Khu Vực Thảo Luận</h3>
                        </div>
                    </div>
                </div>
            <Footer/>
        </div>
    );
};

export default About;