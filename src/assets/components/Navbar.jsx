import logo from '../images/logo.png';

function Navbar() {
    return (
        <nav className="w-full font-inter h-20 sticky top-0 z-10 bg-red-800 text-white shadow-md">
            <div className="flex py-4 justify-between items-center sm:mx-20">
                <div className="logo flex flex-row text-left">
                    <img src={logo} alt="Logo" className="h-14" />
                    <div className="logo-name text-wrap ml-0 py-1">Dinas Tenaga Kerja
                        <br />Kota Semarang</div>
                </div>
                <div className="flex space-x-4 mr-4 text-lg">
                    <a href="https://www.facebook.com/disnakersmg" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                    </a>

                    {/* Ikon Website */}
                    <a href="https://disnaker.semarangkota.go.id/" target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-globe"></i>
                    </a>

                    {/* Ikon Instagram */}
                    <a href="https://www.instagram.com/disnakersmg" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;