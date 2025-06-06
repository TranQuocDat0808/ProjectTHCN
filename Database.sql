--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-06 11:32:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4944 (class 1262 OID 16388)
-- Name: library_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE library_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE library_db OWNER TO postgres;

\connect library_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 226 (class 1255 OID 16442)
-- Name: authenticate_user(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.authenticate_user(p_email character varying, p_password character varying) RETURNS TABLE(user_id integer, email character varying, full_name character varying, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.email, u.full_name, u.role
    FROM users u
    WHERE u.email = p_email
    AND u.password = p_password
    AND u.is_active = true;
END;
$$;


ALTER FUNCTION public.authenticate_user(p_email character varying, p_password character varying) OWNER TO postgres;

--
-- TOC entry 225 (class 1255 OID 16441)
-- Name: check_email_exists(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_email_exists(p_email character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM users WHERE email = p_email);
END;
$$;


ALTER FUNCTION public.check_email_exists(p_email character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16611)
-- Name: audiobooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audiobooks (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    audio_url character varying(255),
    author character varying(100),
    cover_image character varying(255),
    category character varying(100)
);


ALTER TABLE public.audiobooks OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16610)
-- Name: audiobooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audiobooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audiobooks_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 223
-- Name: audiobooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audiobooks_id_seq OWNED BY public.audiobooks.id;


--
-- TOC entry 220 (class 1259 OID 16444)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    category character varying(100),
    description text,
    publication_year integer,
    available_quantity integer DEFAULT 0,
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bookcontent character varying(255),
    average_rating numeric(3,2) DEFAULT 0,
    rating_count integer DEFAULT 0
);


ALTER TABLE public.books OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16443)
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_book_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 219
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- TOC entry 222 (class 1259 OID 16542)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    book_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying,
    title character varying,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16541)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 221
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4771 (class 2604 OID 16614)
-- Name: audiobooks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audiobooks ALTER COLUMN id SET DEFAULT nextval('public.audiobooks_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 16447)
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 16545)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16393)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4938 (class 0 OID 16611)
-- Dependencies: 224
-- Data for Name: audiobooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.audiobooks VALUES (10, 'Content Đúng Là King', 'Xây dựng một doanh nghiệp hàng triệu đôla, mà không tốn 1 đồng quảng cáo. Tại sao không? Với những tuyệt chiêu Content Marketing trong cuốn bí kíp này, bạn sẽ còn làm được nhiều hơn thế! Cuốn sách này sẽ giúp bạn đạt được một số điều: Trước tiên, bạn sẽ hoàn toàn hiểu được content marketing là gì và làm thế nào để một chiến lược content marketing trở nên hiệu quả. Bạn có thể sẽ nhận ra rằng mình không phù hợp với công việc này, hoặc sẽ nhảy cẫng lên đầy hứng khởi.', 'https://dn721908.ca.archive.org/0/items/content-dung-5/content-dung-1.m4a', 'Dan Norris', '../images/content-dung-la-king.webp', 'Maketing Bán Hàng');
INSERT INTO public.audiobooks VALUES (5, 'Vượt Qua Chính Mình', 'Vượt lên chính mình là vượt qua những giới hạn của bản thân trên nhiều góc độ, khách quan cũng như chủ quan. Vượt lên số phận là nghị lực vượt qua nghèo khổ, bệnh tật, những khó khăn, nghịch cảnh, thử thách, những đau buồn trong cuộc sống.', 'https://ia800402.us.archive.org/11/items/vuot-qua_202207/vuot-qua.mp3', 'NXB Trẻ', '../images/vuot-qua-chinh-minh.webp', 'Bài Học Kinh Doanh');
INSERT INTO public.audiobooks VALUES (9, 'Hoa Sen Trên Tuyết ', 'Câu chuyện bắt đầu với một người đàn ông sinh ra trong nghèo khó. Vì muốn thoát khỏi cảnh cùng cực, anh rời bỏ gia đình ngay khi có thể. Lớn lên anh trở thành y sĩ, anh làm việc gấp ba bốn lần người thường.', 'https://ia902305.us.archive.org/22/items/hoa-sen-tren-tuyet.sna/HoaSenTrenTuyet01.mp3', 'Nguyên Phongg', '../images/hoa-sen-tren-tuyet.webp', 'Phật Pháp');
INSERT INTO public.audiobooks VALUES (4, 'Đời Ngắn Đừng Ngủ Dài', 'Đời ngắn đừng ngủ dài chứa đựng nhiều câu chuyện khác nhau, nhưng điểm chung là chúng đều truyền cảm hứng và động lực cho người đọc rất thực tế, giúp chúng ta nhận ra rằng, trong cuộc sống bộn bề ngày nay, đôi khi chúng ta cũng nên dành thời gian để nghỉ ngơi và sống chậm lại, thay vì cứ cố gắng hết sức dù cho bản thân mình đã và đang rất mệt mỏi.', 'https://ia903101.us.archive.org/20/items/doingandungngudai_201911/%C4%90%E1%BB%9Di%20Ng%E1%BA%AFn%20%C4%90%E1%BB%ABng%20Ng%E1%BB%A7%20D%C3%A0i.mp3', 'Robin Sharma', '../images/doi-ngan-dung-ngu-dai.webp', 'Danh Nhân Thế Giới');
INSERT INTO public.audiobooks VALUES (6, 'Lòng Tự Trọng Và Tự Chủ', 'Lòng tự trọng hình thành và phát triển trong suốt cuộc sống khi chúng ta hình thành trong đầu hình tượng về chính mình bằng những trải nghiệm với mọi người và hoạt động xung quanh chúng ta. Những trải nghiệm trong thời thơ ấu đóng vai trò quan trọng trong việc hình thành nên lòng tự trọng.', 'https://ia601406.us.archive.org/3/items/long-tu/long-tu.mp3', 'Huỳnh Phạm Hương Trang', '../images/long-tu-trong-va-tu-chu.webp', 'Danh Nhân Thế Giới');
INSERT INTO public.audiobooks VALUES (8, 'Chấp Nhận Cuộc Đời Phần 1', 'Chấp Nhận Cuộc Đời 4:13:25 
 788
Chấp Nhận Cuộc Đời
 Danh Mục: Tư Duy - Kỹ Năng

 Thể Loại: Kỹ Năng Sống

 Tác Giả: Luise Rinser

 Giọng Đọc: Sách Hay Bizbook

01
Chia sẻ0
Xem nhiều, nghe nhiều: Nhà văn Nguyễn Nhật Ánh

         Đánh giá của bạn: 0
61 đánh giá
BÁO LỖI

Phần 1

00:00
Phần 1
Phần 2
Phần 3
Phần Cuối
Quyển sách ” Chấp Nhận Cuộc Đời – Tìm Hiểu Ý Nghĩa Cuộc Sống Của Bạn ” là quyển sách về triết lí, về cách sống và nhìn nhận vấn đề, cách đối chiếu những quan niệm trên từng tình huống, hoàn cảnh.', 'https://ia601401.us.archive.org/25/items/chap-nhan-1/chap-nhan-1.mp3', 'Luise Rinserr', '../images/chap-nhan-cuoc-doi.webp', 'Kỹ Năng Sống');
INSERT INTO public.audiobooks VALUES (14, 'Tâm Buông Bỏ, Đời Bình An', '“Tâm buông bỏ, đời bình an” là cuốn sách lưu giữ những bí mât để đạt tới hạnh phúc. Nếu chúng ta mở rộng tâm hồn mình, không mong cầu không tiếc nuối, chẳng phải cả thế giới này đều là của chúng ta hay sao? Đây là cuốn sách giúp chúng ta sống hạnh phúc, biết buông bỏ những phiền não, thanh lọc tâm hồn.

', 'https://ia902208.us.archive.org/8/items/tam-buong-4/tam-buong-1.mp3', 'Natori Hougen', '../images/tam-buong-bo-doi-binh-an.webp', 'Kỹ Năng Sống');
INSERT INTO public.audiobooks VALUES (15, 'Lối Sống Tối Giản Của Người Nhật ', 'Lối sống tối giản của người Nhật là lối sống tối giản đơn giản chỉ là cắt giảm những vật dụng trong cuộc sống đến mức tối thiểu. Cùng với cuộc sống ít đồ đạc nhất có thể, trong quá trình này, con người cũng sẽ có nhiều thời gian để tâm hơn tới hạnh phúc của bản thân mình. Đó chính là trọng tâm xuyên suốt quyển sách này.', 'https://ia902802.us.archive.org/3/items/loisongtoigiansection1/loisongtoigian%20%20Section%201.mp3', 'Sasaki Fumio', '../images/loi-song-toi-gian-cua-nguoi-nhat.webp', 'Kỹ Năng Sống');
INSERT INTO public.audiobooks VALUES (16, 'Trump 101: Con Đường Dẫn Đến Thành Công', 'ạn đã đọc Tôi đã làm giàu như thế, Đường đến thành công đỉnh cao, Nghĩ như một tỷ phú của Donald J. Trump thì không thể bỏ qua Trump 101, con đường dẫn đến thành công. Trong cuốn sách này với vai trò vừa là nhà tư vấn, vừa là bạn đồng hành, Donald J. ', 'https://ia601500.us.archive.org/16/items/trump-4/trump-1.mp3', 'Donald J.Trump | Meredith Mclver', '../images/trump-101-con-duong-dan-den-thanh-cong.webp', 'Bài Học Kinh Doanh');
INSERT INTO public.audiobooks VALUES (17, 'Talmud, Tinh Hoa Trí Tuệ Do Thái', 'Talmud là một tập hợp các văn bản cổ của các bậc thầy người Do Thái trong suốt hơn 10 thế kỷ. Bộ sách gồm 20 cuốn, hơn 1200 trang, hơn 250 vạn chữ, nội dung gồm ba phần “Missimah”, “Midrash” và “Germara”. Đây là nơi khởi nguồn của trí tuệ và là kim chỉ nam cho lối sống của dân tộc Do Thái.', 'https://ia800109.us.archive.org/24/items/talmud-tinh-hoa-tri-tue-do-thai-audio-.sna/01.GioiThieu_TinhHoaTriTueDoThai.mp3', 'Từ Quang Á', '../images/talmud-tinh-hoa-tri-tue-do-thai.webp', 'Bài Học Kinh Doanh');
INSERT INTO public.audiobooks VALUES (18, 'Cuộc Đời Kỳ Lạ Của Nikola Tesla', 'Cuộc Đời Kỳ Lạ Của Nikola Tesla là quyển sách có nội dụng về cuộc đời đầy thăng trầm nhưng vô cùng ý nghĩa của tác giả, một trong những nhà phát minh vĩ đại nhất của nhân loại, người đã góp phần thay đổi hoàn toàn bộ mặt của thế giới Thế kỹ XX. Ông được mệnh danh là “nhà khoa học điên” của thé giới vật lý, Tesla là người đi tiên phong đưa kỹ thuật điện , điện từ vào đời sống. ', 'https://ia800402.us.archive.org/11/items/vuot-qua_202207/vuot-qua.mp3', 'Nikola Tesla', '../images/cuoc-doi-ky-la-cua-nikola-tesla.webp', 'Danh Nhân Thế Giới');
INSERT INTO public.audiobooks VALUES (20, 'd', 'dđ', 'https://ia800402.us.archive.org/11/items/vuot-qua_202207/vuot-qua.mp3', '', '../images/An-Lac-Tung-Buoc-Chan.jpg', 'Kỹ Năng Sống');
INSERT INTO public.audiobooks VALUES (21, 'Không Diệt Không Sinh Đừng Sợ Hãi', 'Không diệt Không sinh Đừng sợ hãi là tựa sách được Thiền sư Thích Nhất Hạnh viết nên dựa trên kinh nghiệm của chính mình. Ở đó, Thầy Nhất Hạnh đã đưa ra một thay thế đáng ngạc nhiên cho hai triết lý trái ngược nhau về vĩnh cửu và hư không: “Tự muôn đời tôi vẫn tự do. Tử sinh chỉ là cửa ngõ ra vào, tử sinh là trò chơi cút bắt.', 'https://ia804601.us.archive.org/18/items/khong-diet-1/khong-diet-1.mp3', 'Thích Nhất Hạnh', '../images/khong-diet-khong-sinh-dung-so-hai.webp', 'Phật Pháp');
INSERT INTO public.audiobooks VALUES (22, 'Con Đường Giác Ngộ', '
Lời đầu sách – Thế gian vô thường

00:00
1. Lời đầu sách – Thế gian vô thường
2. Thế gian vô thường tiếp theo
3. Thừa kế nghiệp
4. Cái mê truyền kiếp
5. Phát tâm bồ đề
6. Phát tâm bồ đề tiếp theo
7. Yếu chỉ tâm kinh Bát nhã
8. Tam nhân Phật tánh
9. Tam nhân Phật tánh tiếp theo
10. Phật pháp đến để mà thấy
11. Thiền là sống ngay thực tại
12. Cái biết sáng người muôn thuở
13. Cái biết sáng người muôn thuở tiếp theo
14. Giải thoát tri kiến
Con đường giác ngộ là tập sách được ghi lại từ những bài giảng, mong rằng sẽ đem lại một chút ánh sáng trên đường giác ngộ cho người trở về quê Giác. Tuy nhiên, con đường giác ngộ chân thật vốn không nằm trên những chữ nghĩa chết này, mà ở ngay trong tâm của mỗi người. ', 'https://ia801805.us.archive.org/30/items/con-duong-03/con-duong-01.mp3', 'Thích Thông Phương', '../images/con-duong-giac-ngo.webp', 'Phật Pháp');
INSERT INTO public.audiobooks VALUES (23, 'Content Bạc Tỷ', '“Content bạc tỷ” với nội dung thiết thực, giải thích cặn kẽ, diễn đạt khéo léo, không chỉ dành riêng cho những Copywriter mà còn cho tất cả những ai có hứng thú với việc viết content.“Content bạc tỷ” với nội dung thiết thực, giải thích cặn kẽ, diễn đạt khéo léo, không chỉ dành riêng cho những Copywriter mà còn cho tất cả những ai có hứng thú với việc viết content.', 'https://ia801501.us.archive.org/29/items/content-6/content-1.m4a', 'Diệp Tiểu Ngư', '../images/content-bac-ty.webp', 'Maketing Bán Hàng');


--
-- TOC entry 4934 (class 0 OID 16444)
-- Dependencies: 220
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.books VALUES (94, 'Khúc Nhạc Vĩnh Hằng', 'Cao Minh', 'Kỹ Năng Sống', '“Khúc Nhạc Vĩnh Hằng” là một tập truyện ngắn của tác giả Cao Minh, được dịch sang tiếng Việt bởi Phương Linh. Tác phẩm khai thác những câu chuyện đời thường nhưng mang chiều sâu triết lý, tập trung vào các khía cạnh tâm lý, cảm xúc và sự đa chiều của cuộc sống. ', 1991, 0, '../images/khuc-nhac-vinh-hang-cao-minh-phuong-linh-dich.jpg', '2025-04-18 03:51:27.344', '2025-04-23 03:58:53.204', '/bookcontent/KhÃºc Nháº¡c VÄ©nh Háº±ng - Cao Minh & PhÆ°Æ¡ng Linh (dá»ch).epub', 0.00, 0);
INSERT INTO public.books VALUES (109, 'Mã Mẫu Tử – Calore Stivers', 'Calore Stivers', 'Viễn Tưởng', '“Mã Mẫu Tử” là một tiểu thuyết khoa học viễn tưởng kỳ ảo, nơi mà công nghệ và ma thuật đan xen lẫn nhau. Câu chuyện xoay quanh nhân vật chính, người phải đối mặt với những thử thách trong một thế giới mà ranh giới giữa thực tế và ảo ảnh mờ nhạt. ', 2001, 0, '../images/cover-22.jpg', '2025-06-05 14:48:38.469', '2025-06-05 14:48:38.469', '/bookcontent/Ma mau tu (The mother code) - Carole Stivers - NguyÃªn NguyÃªn (1).epub', 0.00, 0);
INSERT INTO public.books VALUES (98, 'Mẹ Ơi Mẹ Có Hành Phúc Không?', 'Takeshi Moriya', 'Bố Mẹ', '“Mẹ Ơi, Mẹ Có Hạnh Phúc Không?” là một cuốn sách của tác giả Takeshi Moriya, tập trung vào mối quan hệ sâu sắc và những suy tư về hạnh phúc của người mẹ trong gia đình. Tác phẩm có thể khám phá những hy sinh thầm lặng, những gánh nặng và cả những niềm vui giản dị của người mẹ qua góc nhìn của người con. ', 2014, 0, '../images/cover-13.jpg', '2025-04-23 04:02:38.869', '2025-04-23 04:02:53.581', '/bookcontent/Me oi, me co hanh phuc khong_ - Moriya Takeshi - NguyÃªn NguyÃªn.epub', 0.00, 0);
INSERT INTO public.books VALUES (111, 'Ta Tại Tận Thế Nhặt Bảo Rương', 'Tử Vong Chàng Kích', 'Viễn Tưởng', '“Ta Tại Tận Thế Nhặt Bảo Rương” là một tiểu thuyết thuộc thể loại mạt thế, do tác giả Tử Vong Chàng Kích sáng tác. Câu chuyện diễn ra trong bối cảnh tận thế, nơi mà nhân vật chính, Chu Dương, có khả năng nhặt được các bảo rương đặc biệt trong thế giới đầy hỗn loạn này.', 2020, 0, '../images/ta-tai-tan-the-nhat-bao-ruong-tu-vong-chang-kich.jpg', '2025-06-05 14:53:18.859', '2025-06-05 14:53:18.859', '/bookcontent/Ta Táº¡i Táº­n Tháº¿ Nháº·t Báº£o RÆ°Æ¡ng - Tá»­ Vong ChÃ ng KÃ­ch.epub', 0.00, 0);
INSERT INTO public.books VALUES (12, 'Đọc Vị Bất Kì Ai', 'Thiên Hương', 'Tâm Linh', 'Đọc Vị Bất Kỳ Ai là một cuốn sách đầy triết lý và sự thông minh của tác giả David J. Lieberman. Cuốn sách này không chỉ đưa ra những phân tích sâu sắc về tâm lý con người mà còn cung cấp cho độc giả những phương pháp thực tế để hiểu rõ hơn về người khác và cách tương tác với họ.', 2012, 3, '../images/DOCVI.png', '2025-03-25 04:28:27.951', '2025-04-17 08:33:47.911', '/bookcontent/Doc Vi Bat Ky Ai - David J. Lieberman.epub', 5.00, 1);
INSERT INTO public.books VALUES (100, 'Đạo Phật Đi Vào Cuộc Đời', 'Thích Nhất Hạnh', 'Phật Pháp', 'Nguồn suối của đạo Phật mở ra từ sự giác ngộ về sự thật của cuộc sống, nổi lên từ Tứ Diệu Đế. Điều này làm cho đạo Phật có đặc tính vượt lên trên cuộc sống. Sự vượt lên ở đây không chỉ là kết quả tự nhiên của giác ngộ mà còn là sự thức tỉnh và giải phóng. Người giác ngộ không còn là người bị sai sử, chìm đắm trong cuộc đời. Người giác ngộ là người tự do, vượt lên trên những tối tăm, quên lãng và phó mặc của cuộc đời.', 2001, 0, '../images/dao-phat-di-vao-cuoc-doi.jpg', '2025-04-23 04:14:50.375', '2025-04-23 04:14:50.375', '/bookcontent/ÄaÌ£o PhaÌ£Ìt Äi VaÌo CuoÌ£Ìc ÄoÌÌi - ThiÌch NhaÌÌt HaÌ£nh.epub', 0.00, 0);
INSERT INTO public.books VALUES (1, 'Đắc Nhân Tâm', 'Dale Carnegie', 'Phát Triển Bản Thân', 'Một trong những cuốn sách nổi tiếng nhất về phát triển bản thân', 1936, 1, '../images/DACNHANTAM1.png', '2025-03-19 16:26:30.809781', '2025-04-18 03:07:54.187', '/bookcontent/Dac nhan tam - DALE CARNEGIE.epub', 0.00, 0);
INSERT INTO public.books VALUES (92, 'Hội Vệ Nhân – John Grisham', 'John Grisham', 'Kỹ Năng Sống', 'Hội Vệ Nhân (The Guardians) là một tiểu thuyết trinh thám pháp lý xuất sắc của John Grisham, xuất bản năm 2019. Câu chuyện xoay quanh Cullen Post – một luật sư đồng thời là linh mục, thành viên của Hội Vệ Nhân, một tổ chức phi lợi nhuận chuyên bào chữa miễn phí cho những người bị kết án oan tại Mỹ.', 1980, 0, '../images/cover-56.jpg', '2025-04-18 03:42:32.299', '2025-06-03 15:36:05.919', '/bookcontent/Hoi ve nhan - John Grisham - NguyÃªn NguyÃªn.epub', 0.00, 0);
INSERT INTO public.books VALUES (115, 'Tư Duy Logic – Minori Kanbe', 'Minori Kanbe', 'Phát Triển Bản Thân', 'Tư Duy Logic là cuốn sách kỹ năng sống nổi bật của Minori Kanbe, được trình bày dưới dạng truyện tranh sinh động, kể về hành trình của chính tác giả – một cô gái Nhật Bản 28 tuổi – từng bước vượt qua giới hạn bản thân để tìm thấy hướng đi mới trong cuộc sống và sự nghiệp. ', 2001, 0, '../images/cover-63.jpg', '2025-06-05 15:16:20.426', '2025-06-05 15:16:20.426', '/bookcontent/Tu duy logic - Minori Kanbe - NguyÃªn NguyÃªn.epub', 0.00, 0);
INSERT INTO public.books VALUES (4, 'Phật Đà Pháp Ngữ', 'Sharavasti Dhammika', 'Phật Pháp', 'Pháp sư Shravasti Dhammika sinh năm 1951 tại Australia. Pháp sư xuất gia tại Ấn Độ từ khi còn trẻ, sau đó ngài đến Srilanka tu hành. Ngài nổi tiếng với những cống hiến to lớn trong việc truyền bá và phát triển Phật giáo ở Srilanka.', 1951, 5, '../images/phat-da-phap-ngu-phap-su-sharavasti-dhammika.jpg', '2025-03-20 16:46:33.675664', '2025-06-03 07:06:23.482', '/bookcontent/Pháº­t ÄÃ  PhÃ¡p Ngá»¯ - PhÃ¡p sÆ° Sharavasti Dhammika.epub', 0.00, 0);
INSERT INTO public.books VALUES (113, 'Bùng Nổ Doanh Số Với Google Ads', 'MediaZ', 'Giáo Dục', 'Google Ads là chương trình quảng cáo trực tuyến của Google cho phép người dùng mua những vị trí quảng cáo bằng văn bản, danh sách sản phẩm, hình ảnh hoặc nội dung video tại các kết quả tìm kiếm hoặc trang web do Google cung cấp để tạo và thực hiện chiến dịch quảng cáo sản phẩm của mình. ', 2023, 0, '../images/bung-no-doanh-so-voi-google-ads-mediaz.jpg', '2025-06-05 15:04:11.849', '2025-06-05 15:04:11.849', '/bookcontent/BuÌng NoÌÌ Doanh SoÌÌ VoÌÌi Google Ads - MediaZ.epub', 0.00, 0);
INSERT INTO public.books VALUES (96, 'Chỉ Về Nhà Để Ngủ', 'Minh Nhật', 'Tâm Lý Học', '“Chỉ Về Nhà Để Ngủ” là một tác phẩm  của tác giả Minh Nhật, mang đến những câu chuyện và suy tư về khái niệm “nhà” không chỉ là một nơi để ở mà còn là chốn bình yên, là nơi để trở về sau những bộn bề của cuộc sống.', 2017, 0, '../images/Chi-Ve-Nha-De-Ngu.jpg', '2025-04-22 10:26:04.539', '2025-04-22 10:26:04.539', '/bookcontent/Chi Ve Nha De Ngu - Minh Nhat - NguyÃªn NguyÃªn.epub', 5.00, 3);
INSERT INTO public.books VALUES (119, 'AI 5.0 – Nhanh Hơn, Dễ Hơn, Rẻ Hơn, Chính Xác Hơn', 'Ajay Agrawal, Avi Goldfarb, Joshua Gans', 'Kỹ Năng Sống', '“AI 5.0 – Nhanh Hơn, Dễ Hơn, Rẻ Hơn, Chính Xác Hơn” của Ajay Agrawal, Joshua Gans, và Avi Goldfarb là một cuốn sách hướng dẫn cách tận dụng trí tuệ nhân tạo (AI) để nâng cao hiệu suất và độ chính xác trong việc đưa ra quyết định kinh doanh.', 2023, 0, '../images/ai-5-0-nhanh-hon-de-hon-re-hon-chinh-xac-hon.jpg', '2025-06-05 15:28:07.804', '2025-06-05 15:28:07.804', NULL, 0.00, 0);
INSERT INTO public.books VALUES (97, 'Khó Mà Tìm Được Một Người Tốt', 'Flannery O''Connor', 'Tiểu Thuyết', 'Khó Mà Tìm Được Một Người Tốt (A Good Man Is Hard to Find) là tuyển tập truyện ngắn xuất sắc của Flannery O’Connor, xuất bản lần đầu năm 1955. Cuốn sách gồm 10 truyện ngắn, mỗi câu chuyện đều mang phong cách văn chương Gothic miền Nam nước Mỹ, khai thác sâu sắc những vấn đề đạo đức, tôn giáo, và bản chất con người.', 1955, 0, '../images/cover-47.jpg', '2025-04-23 03:53:57.672', '2025-04-23 03:53:57.672', '/bookcontent/Kho ma tim duoc mot nguoi tot - Flannery O''Connor - NguyÃªn NguyÃªn.epub', 0.00, 0);
INSERT INTO public.books VALUES (99, 'Từ Vựng Tiếng Trung', 'Pinhok Languages', 'Giáo Dục', 'Sách từ vựng này chứa hơn 3.000 từ và cụm từ tiếng Trung được phân nhóm theo chủ đề để giúp bạn chọn nội dung học đầu tiên dễ dàng hơn. Hơn nữa, nửa còn lại của cuốn sách chứa hai phần chỉ mục có thể dùng làm từ điển cơ bản để tra cứu từ trong hai ngôn ngữ đó.', 1980, 0, '../images/sach-tu-vung-tieng-trung-pinhok-languages.jpg', '2025-04-23 04:08:23.428', '2025-04-23 04:08:23.428', '/bookcontent/SÃ¡ch Tá»« Vá»±ng Tiáº¿ng Trung - Pinhok Languages.epub', 0.00, 0);
INSERT INTO public.books VALUES (101, 'An Lạc Từng Bước Chân', 'Thích Nhất Hạnh', 'Tâm Lý Học', 'Cuốn sách “An Lạc Từng Bước Chân” của Thiền sư Thích Nhất Hạnh là kim chỉ nam dẫn dắt mỗi chúng ta trên con đường tìm kiếm hạnh phúc trong cuộc sống đầy cam go. Giống như một viên kim cương lấp lánh, hạnh phúc ẩn chứa nhiều khía cạnh khác nhau, và mỗi khía cạnh đều góp phần tạo nên viên kim cương hoàn chỉnh.', 2011, 0, '../images/An-Lac-Tung-Buoc-Chan.jpg', '2025-04-23 04:17:57.727', '2025-04-23 04:17:57.727', '/bookcontent/An Lac Tung Buoc Chan - Thich Nhat Hanh.epub', 5.00, 1);
INSERT INTO public.books VALUES (91, 'Dưới Cánh Cửa Thầm Thì', 'T. J. Klune', 'Viễn Tưởng', '“Dưới Cánh Cửa Thầm Thì” của T.J. Klune là một tiểu thuyết giả tưởng lãng mạn, xoay quanh câu chuyện của Wallace Price, một luật sư thành công nhưng lạnh lùng và ích kỷ. Sau khi đột ngột qua đời vì một cơn đau tim, linh hồn của Wallace được Thần Chết Mei đưa đến Tiệm Trà và Bến Đò Charon, nơi anh gặp Hugo Freeman, người lái đò giúp những linh hồn sang thế giới bên kia.', 1990, 0, '../images/duoi-canh-cua-tham-thi-t-j-klune-jack-frogg-dich.jpg', '2025-04-18 03:18:37.28', '2025-04-18 03:18:37.28', '/bookcontent/DÆ°á»i CÃ¡nh Cá»­a Tháº§m ThÃ¬ - T. J. Klune & Jack Frogg (dá»ch).epub', 0.00, 0);
INSERT INTO public.books VALUES (93, 'Bóng Ma Trong Nhà Hát', 'Gaston Leroux', 'Tâm Linh', '“Bóng Ma Trong Nhà Hát” của Gaston Leroux là một tiểu thuyết kinh điển thuộc thể loại lãng mạn, huyền bí và kinh dị. Câu chuyện xoay quanh một hồn ma bí ẩn tại Nhà hát Opera Garnier ở Paris. Tuy nhiên, “hồn ma” này thực chất là một con người tên Erik, người bị xã hội ruồng bỏ vì vẻ ngoài xấu xí. Erik sống trong bóng tối của nhà hát, sử dụng tài năng âm nhạc để gây ảnh hưởng và kiểm soát.', 1999, 0, '../images/bong-ma-trong-nha-hat.jpg', '2025-04-18 03:47:22.39', '2025-04-18 03:47:22.39', '/bookcontent/BÃ³ng Ma Trong NhÃ  HÃ¡t - Gaston Leroux & Louise Benette & David Hwang & Thunderstorm (dá»ch).epub', 0.00, 0);
INSERT INTO public.books VALUES (116, 'Lãn Ông – Yveline Féray', 'Yveline Féray', 'Tiểu Thuyết', '“Lãn Ông” là tiểu thuyết lịch sử đặc sắc của nữ văn sĩ Pháp Yveline Féray, được dịch sang tiếng Việt bởi Lê Trọng Sâm. Tác phẩm lấy cảm hứng từ cuộc đời và sự nghiệp của đại danh y Hải Thượng Lãn Ông – Lê Hữu Trác, một trong những tượng đài y học và văn hóa lớn của Việt Nam thế kỷ XVIII. ', 1988, 0, '../images/lan-ong-yveline-feray.jpg', '2025-06-05 15:18:42.079', '2025-06-05 15:18:42.079', '/bookcontent/LÃ£n Ãng - Yveline FÃ©ray.epub', 0.00, 0);
INSERT INTO public.books VALUES (95, 'Chú Chó Hộ Mệnh', 'Seishū Hase', 'Tâm Lý Học', 'Chú Chó Hộ Mệnh (Shonen to Inu – A Boy and Dog) là tiểu thuyết nổi tiếng của Seishū Hase, lấy bối cảnh nước Nhật sau thảm họa kép động đất – sóng thần năm 2011. ', 2011, 0, '../images/cover-68.jpg', '2025-04-22 10:20:29.764', '2025-04-22 10:20:29.764', '/bookcontent/CHU CHO HO MENH - Hase Seishu - NguyÃªn NguyÃªn.epub', 0.00, 0);
INSERT INTO public.books VALUES (110, 'Bá Võ', 'Khai Hoang', 'Viễn Tưởng', '“Bá Võ” của tác giả Khai Hoang là một tiểu thuyết huyền huyễn hấp dẫn, kể về hành trình của nhân vật chính Sở Hi Thanh, người đã xuyên không vào một thế giới mới mang tên Đại Ninh. Câu chuyện bắt đầu khi Sở Hi Thanh khởi tử hồi sinh bên trong lăng mộ của vị vua Bá Vũ.', 1988, 0, '../images/ba-vo-khai-hoang.jpg', '2025-06-05 14:50:59.961', '2025-06-05 14:50:59.961', '/bookcontent/BÃ¡ VÃµ - Khai Hoang.epub', 0.00, 0);
INSERT INTO public.books VALUES (112, 'Chuyện Chữ Nghĩa Tiếng Anh', 'Nguyễn Vạn Phú', 'Giáo Dục', 'Bạn từng học tiếng Anh vài ba năm trở lên, đã lấy chứng chỉ B, thi TOEIC, thi cả Toefl nữa. Bạn sử dụng tiếng Anh khá thông thạo trong hầu như mọi tình huống bình thường, nhưng đôi lúc bạn vẫn cảm thấy mình thiếu một cái gì đó, một kỹ năng nào đó có thể giúp bạn nắm bắt được toàn bộ ý nghĩa của những câu nói hay bài viết bạn gặp phải hàng ngày.', 2001, 0, '../images/chuyen-chu-nghia-tieng-anh-nguyen-van-phu.jpg', '2025-06-05 15:01:28.424', '2025-06-05 15:01:28.424', '/bookcontent/Chuyen Chu Nghia Tieng Anh - Nguyen Van Phu.mobi', 0.00, 0);
INSERT INTO public.books VALUES (114, 'Marketing Là Gì?', 'MediaZ', 'Giáo Dục', 'Bạn thân mến, dưới đây là một bài chia sẻ kiến thức chuyên sâu về chủ đề Marketing. Với nội dung này bạn sẽ hiểu rõ Marketing là gì, và các định nghĩa về marketing 4P, marketing 3c, cùng với các thời kỳ của Marketing trong từng giai đoạn phát triển của xã hội.', 2023, 0, '../images/marketing-la-gi_-mo-hinh-3c2c-4p-va-cac-thoi-ky-marketing-can-biet-mediaz.jpg', '2025-06-05 15:13:16.589', '2025-06-05 15:13:16.589', '/bookcontent/Marketing LÃ  GÃ¬_ MÃ´ HÃ¬nh 3C, 4P vÃ  CÃ¡c Thá»i Ká»³ Marketing Cáº§n Biáº¿t - MediaZ.epub', 0.00, 0);
INSERT INTO public.books VALUES (117, 'Làm Cha Mẹ Cũng Cần Phải Học', 'Liệu Khang Cường', 'Bố Mẹ', 'Tác phẩm “Làm Cha Mẹ Cũng Cần Phải Học: 7 Bài Học Dành Cho Cha Mẹ” là một cuốn sách rất đáng đọc dành cho những người đang làm cha mẹ hoặc sắp trở thành cha mẹ. Cuốn sách này được viết bởi hai tác giả nổi tiếng trong lĩnh vực giáo dục và nuôi dạy con cái, Trương Hoành Vũ và Liệu Khang Cường.', 2024, 0, '../images/36415854764_1597e7255c_o.jpg', '2025-06-05 15:22:44.489', '2025-06-05 15:22:44.489', '/bookcontent/Lam Cha Me Cung Can Phai Hoc - Lieu Khang Cuong & Truong Hoanh Vu.epub', 0.00, 0);
INSERT INTO public.books VALUES (118, 'Marketing Giỏi Phải Kiếm Được Tiền', 'Sergio Zyman', 'Kỹ Năng Sống', '“Marketing Giỏi Phải Kiếm Được Tiền” của Sergio Zyman là một cuốn sách kinh doanh nổi tiếng, tập trung vào việc biến marketing từ một hoạt động sáng tạo thành một công cụ chiến lược để tạo ra lợi nhuận. Zyman nhấn mạnh rằng marketing không chỉ là việc tạo dựng hình ảnh thương hiệu hay sản xuất các chiến dịch quảng cáo đẹp mắt, mà cốt lõi là phải bán được nhiều sản phẩm hơn và kiếm được nhiều tiền hơn.', 2015, 0, '../images/marketing-gioi-phai-kiem-duoc-tien-sergio-zyman-ai-dich.jpg', '2025-06-05 15:25:35.632', '2025-06-05 15:25:35.632', '/bookcontent/Marketing Giá»i Pháº£i Kiáº¿m ÄÆ°á»£c Tiá»n - Sergio Zyman & AI (dá»ch).epub', 0.00, 0);


--
-- TOC entry 4936 (class 0 OID 16542)
-- Dependencies: 222
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES (126, 12, 3, 5, 'hayyy', '2025-04-17 08:16:08.868', 'Admin', 'Đọc Vị Bất Kì Ai');
INSERT INTO public.reviews VALUES (132, 101, 3, 5, 'sách hay', '2025-05-15 07:40:52.277', 'Admin', 'An Lạc Từng Bước Chân');
INSERT INTO public.reviews VALUES (133, 96, 3, 5, 'hay', '2025-06-05 09:56:47.035', 'Admin', 'Chỉ Về Nhà Để Ngủ');
INSERT INTO public.reviews VALUES (134, 96, 3, 5, 'hay', '2025-06-05 09:56:47.038', 'Admin', 'Chỉ Về Nhà Để Ngủ');
INSERT INTO public.reviews VALUES (135, 96, 3, 5, 'quá hay', '2025-06-05 09:57:01.153', 'Admin', 'Chỉ Về Nhà Để Ngủ');


--
-- TOC entry 4932 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (7, 'tranminh01@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Trần Minh', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (9, 'lethanh03@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Lê Thành', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (10, 'phamquynh04@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Phạm Quỳnh', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (11, 'dangkhoa05@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Đặng Khoa', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (13, 'hoangnam07@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Hoàng Nam', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (14, 'doanhthu08@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Doanh Thư', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (15, 'ngocanh09@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Ngọc Ánh', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (16, 'huynhphuc10@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Huỳnh Phúc', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (17, 'tienlinh11@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Tiến Linh', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (18, 'vuthao12@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Vũ Thảo', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (20, 'dinhhieu14@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Đinh Hiếu', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (21, 'ngoctram15@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Ngọc Trâm', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (22, 'kiencuong16@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Kiên Cường', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (23, 'myhanh17@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Mỹ Hạnh', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (24, 'quochung18@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Quốc Hưng', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (25, 'lethuy19@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Lê Thúy', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (26, 'truonggiang20@example.com', '$2b$10$XNRAs6TWQxiK8z.XfpjF0uI4I6KkI6ZGxFqMJ0UKqxiyI1BoDyMnm', 'Trường Giang', 'user', '2025-04-18 14:48:34.483238', '2025-04-18 14:48:34.483238', true);
INSERT INTO public.users VALUES (6, 'Nvutanie161206@gmail.com', '$2b$10$8GJO95dn12ylF.W1RiAyneh9msvRdFy4/xbQ.wqAu408L3i4L9Ej.', 'Tâm Niệm', 'user', '2025-03-23 07:16:38.052615', '2025-04-23 08:55:15.184', true);
INSERT INTO public.users VALUES (30, 'adf1@gmail.com', '$2b$10$ugL8huphLLaWs3LV61jr1ejNZq.La.k7jn3P4ux2C5DBMsJD0b9Su', 'đăng', 'user', '2025-06-05 05:00:09.028189', NULL, true);
INSERT INTO public.users VALUES (31, 'quocdat123@gmail.com', '$2b$10$pSWY/tNdx7jfjTXyThdR0OBsdfae7VzF4ddPKtHc/.ganLjQr8RVu', 'Quốc Đạt', 'user', '2025-06-05 05:11:48.129653', NULL, true);
INSERT INTO public.users VALUES (32, 'quocdat02@gmail.com', '$2b$10$3GucE6moqEPq5sRn0DI/feO/z0qijFi59bH.bGbxyQeP4r522BHMK', 'Quốc Đạt', 'user', '2025-06-05 05:12:18.095597', NULL, true);
INSERT INTO public.users VALUES (3, 'admin@gmail.com', '$2b$10$MJci4RUKjbh.Ll7P4LESYuH8yklMJVhLV30Q/eVv9KrLcjd8a2yvO', 'Admin', 'admin', '2025-03-21 10:11:08.347091', '2025-06-05 10:16:12.674', true);
INSERT INTO public.users VALUES (27, 'minhan@gmail.com', '$2b$10$Ndy/Rm78g24x0/o1NKMv5e4njNz6A1nb3uxx2k7BE7.LMq2UFsCse', 'Minh An', 'user', '2025-04-22 08:28:04.564258', NULL, true);
INSERT INTO public.users VALUES (28, 'trungquan11@gmail.com', '$2b$10$JCUa04HL0Krpl0MGFlIoI.03Ud1uU6/KKIUoSM18TOLxFSWIF.ETe', 'Trung Quân', 'user', '2025-04-22 08:29:07.197442', NULL, true);
INSERT INTO public.users VALUES (29, 'quocdat02@gmal.com', '$2b$10$ekJDfHHxzC6wEcVj2hD/yeW5mgc4qQ6zAQCeoe71Y95B3zf6QMBhC', 'Quốc Đạt', 'user', '2025-04-22 08:29:35.272685', '2025-04-22 08:30:27.737', true);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 223
-- Name: audiobooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audiobooks_id_seq', 23, true);


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 219
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_book_id_seq', 119, true);


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 221
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 135, true);


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 32, true);


--
-- TOC entry 4783 (class 2606 OID 16618)
-- Name: audiobooks audiobooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audiobooks
    ADD CONSTRAINT audiobooks_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16454)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- TOC entry 4781 (class 2606 OID 16551)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4775 (class 2606 OID 16402)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4777 (class 2606 OID 16400)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4773 (class 1259 OID 16403)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4784 (class 2606 OID 16552)
-- Name: reviews reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 16557)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-06-06 11:32:10

--
-- PostgreSQL database dump complete
--

