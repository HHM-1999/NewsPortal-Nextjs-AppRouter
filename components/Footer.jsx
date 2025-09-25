import Image from 'next/image';
import Link from 'next/link';
import Logo from "../public/assets/media/common/logoWhiteNews.png";
const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-4 mt-5">
            <div className="container">
                <div className="row">
                    {/* Logo and About */}
                    <div className="col-md-6 mb-4">
                        {/* <h5>News Portal</h5> */}
                        <Link href="/">
                            <div className="Logo-area2">
                                <Image
                                    src={Logo}
                                    alt="News Portal.com"
                                    title="News Portal.com"
                                    className="img-fluid"
                                    style={{ width: "240px" }}
                                />
                            </div>
                        </Link>
                        <div className="site-desc">
                            <p>
                                Trusted source for breaking news, analysis,<br /> and features in Bangladesh and beyond.
                            </p>
                        </div>

                    </div>


                    {/* Contact Info */}
                    <div className="col-md-6 mb-4 d-flex justify-content-center">
                        <div className="contact-area">
                            <h2>Contact Us</h2>
                            <p>Email: <a href='mail:info@newsportal.com'>info@newsportal.com</a></p>
                            <p>Phone: <a href="tel:+880-123-456789">+880-123-456789</a></p>
                            <p>Address: Dhaka, Bangladesh</p>
                        </div>

                    </div>
                </div>

                {/* Footer bottom */}
                <div className="text-center border-top border-secondary pt-3 pb-2">
                    <small>&copy; {new Date().getFullYear()} News Portal. All rights reserved.</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
