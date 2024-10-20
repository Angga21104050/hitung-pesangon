/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

function PesangonCalculator() {
    const [gaji, setGaji] = useState();
    const [masaKerja, setMasaKerja] = useState();
    const [cutiDiambil, setCutiDiambil] = useState('');
    const [jumlahCuti, setJumlahCuti] = useState('');
    // id berisi data yang diambil dari api yaitu data content atau data alasan phk
    const [id, setId] = useState('');
    const [uangPesangon, setUangPesangon] = useState('');
    const [umpk, setUmpk] = useState('');
    const [uangPisah, setUangPisah] = useState('');
    const [data, setData] = useState([]);
    const [hasilPKWTT, setHasilPKWTT] = useState([]);
    const [lamaBekerja, setLamaBekerja] = useState('');
    const [upahTerakhir, setUpahTerakhir] = useState('');
    const [hasilPKWT, setHasilPKWT] = useState('');
    const [showHasilPKWTT, setShowHasilPKWTT] = useState(false);
    const [showHasilPKWT, setShowHasilPKWT] = useState(false);
    const [selectedForm, setSelectedForm] = useState("PKWTT");

    // fetch data alasan phk get data from api
    useEffect(() => {
        fetch("https://siker.semarangkota.go.id/APP/kalpesangon/alasanPHK-DATA", {
            method: "GET",
            headers: {},
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data) {
                    console.error("Data is empty");
                    return;
                }
                // akses data yang diinginkan yaitu data content
                const content = data.content;
                console.log(content);
                setData(content);
            })
            .catch((error) => console.error("Error fetching data:", error));

    }, []);

    // handle show and hide form
    const handleFormPesangon = (e) => {
        setSelectedForm(e.target.value);
    };

    // handle change alasan phk
    const handleAlasanChange = (e) => {
        const selectedId = e.target.value;
        setId(selectedId);

        // Find the selected item from the data
        const selectedData = data.find(item => item.id === selectedId);
        if (selectedData) {

            setUangPesangon(selectedData.pesangon);
            setUmpk(selectedData.upmk);
            setUangPisah(selectedData.uangpisah);
        }
    };
    // handle submit form
    const handleSubmitPKWT = (e) => {
        e.preventDefault();

        const hasilPKWT = Math.floor((lamaBekerja / 2) * upahTerakhir)

        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        });

        setHasilPKWT(formatter.format(hasilPKWT));
        setShowHasilPKWT(true);
    };
    const handleSubmitPKWTT = (e) => {
        e.preventDefault();

        console.log(uangPisah);
        fetch("https://siker.semarangkota.go.id/APP/kalpesangon/Proses", {
            method: "POST",
            body: "gaji=" + gaji + "&masakerja=" + masaKerja + "&cutidiambil=" + cutiDiambil + "&jumlahcuti=" + jumlahCuti + "&id=" + id + "&uangpesangon=" + uangPesangon + "&umpk=" + umpk + "&uangpisah=" + uangPisah,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data) {
                    console.error("Data is empty");
                    return;
                }
                setHasilPKWTT(data);
                console.log(data);
                setShowHasilPKWTT(true);
            })
            .catch((error) => console.error("Error fetching data:", error));
    };
    // handle download pdf
    const handleDownloadPdfPKWTT = () => {
        const doc = new jsPDF();

        // Mengatur margin, lebar halaman, dan jarak baris awal
        const marginLeft = 10;
        const pageWidth = 210; // Lebar halaman A4 dalam mm
        const marginRight = 200; // Margin kanan (untuk rata kanan)
        const lineHeight = 10;
        let currentLine = marginLeft;

        // Mengatur font dan ukuran font
        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        // Mendapatkan data dari elemen HTML
        const h1 = document.getElementById("heading").innerText;
        const title = document.getElementById("title").innerText;
        const alasan = document.getElementById("alasan").innerText;
        const pesangon = document.getElementById("pesangon").innerText;
        const umpk = document.getElementById("umpk").innerText;
        const uangpisah = document.getElementById("uangpisah").innerText;
        const total = document.getElementById("totalPKWTT").innerText;
        const pajak = document.getElementById("pajak").innerText;
        const netto = document.getElementById("netto").innerText;

        // Menambahkan judul dengan ukuran font lebih besar
        doc.setFontSize(20);
        doc.text(h1, marginLeft, currentLine);
        currentLine += lineHeight + 5; // Menambah jarak ekstra setelah judul

        // Menambahkan subjudul dengan ukuran font yang lebih kecil
        doc.setFontSize(16);
        doc.text("Detail Perhitungan PKWTT", marginLeft, currentLine);
        currentLine += lineHeight;

        // Mengatur kembali ukuran font untuk isi detail
        doc.setFontSize(12);

        // Menambahkan detail dengan label dan konten
        const details = [
            { label: "Title", value: title },
            { label: "Alasan PHK", value: alasan },
            { label: "Pesangon", value: pesangon },
            { label: "UMPK", value: umpk },
            { label: "Uang Pisah", value: uangpisah },
            { label: "Total", value: total },
            { label: "Pajak", value: pajak }
        ];

        // Loop untuk menambahkan detail dengan format rapi
        details.forEach((detail) => {
            doc.setFont("helvetica", "bold");
            doc.text(detail.label, marginLeft, currentLine);
            doc.setFont("helvetica", "normal");
            // Mengatur value menjadi rata kanan
            doc.text(detail.value, marginRight, currentLine, { align: "right" });
            currentLine += lineHeight;
        });

        // Menambahkan jarak ekstra sebelum garis
        currentLine += lineHeight;

        // Menambahkan garis sebelum item "Netto"
        doc.line(marginLeft, currentLine, pageWidth - 10, currentLine);
        currentLine += lineHeight; // Menambah jarak setelah garis

        // Menambahkan "Netto" dengan format yang sama
        doc.setFont("helvetica", "bold");
        doc.text("Netto:", marginLeft, currentLine);
        doc.setFont("helvetica", "normal");
        // Mengatur netto menjadi rata kanan
        doc.text(netto, marginRight, currentLine, { align: "right" });
        currentLine += lineHeight;

        // Simpan dokumen
        doc.save("hasil-pkwtt.pdf");
    };
    const handleDownloadPdfPKWT = () => {
        const doc = new jsPDF();

        // Mengatur margin, lebar halaman, dan jarak baris awal
        const marginLeft = 10;
        const pageWidth = 210; // Lebar halaman A4 dalam mm
        const marginRight = 200; // Margin kanan (untuk rata kanan)
        const lineHeight = 10;
        let currentLine = marginLeft;

        // Mengatur font dan ukuran font
        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        // Mendapatkan data dari elemen HTML
        const h1 = document.getElementById("headingPKWT").innerText;
        const gaji = document.getElementById("gaji").innerText;
        const masaKerja = document.getElementById("masaKerja").innerText;
        const total = document.getElementById("totalPKWT").innerText;

        // Menambahkan judul dengan ukuran font lebih besar
        doc.setFontSize(20);
        doc.text(h1, marginLeft, currentLine);
        currentLine += lineHeight + 5; // Menambah jarak ekstra setelah judul

        // Menambahkan subjudul dengan ukuran font yang lebih kecil
        doc.setFontSize(16);
        doc.text("Detail Perhitungan PKWT", marginLeft, currentLine);
        currentLine += lineHeight;

        // Mengatur kembali ukuran font untuk isi detail
        doc.setFontSize(12);

        // Menambahkan detail dengan label dan konten
        const details = [
            { label: "Gaji Terakhir", value: gaji },
            { label: "Masa Kerja", value: masaKerja }
        ];

        // Loop untuk menambahkan detail dengan format rapi
        details.forEach((detail) => {
            doc.setFont("helvetica", "bold");
            doc.text(detail.label, marginLeft, currentLine);
            doc.setFont("helvetica", "normal");
            // Mengatur value menjadi rata kanan
            doc.text(detail.value, marginRight, currentLine, { align: "right" });
            currentLine += lineHeight;
        });

        // Menambahkan garis di atas total
        currentLine += 2; // Menambahkan jarak sebelum garis
        doc.line(marginLeft, currentLine, marginRight, currentLine); // Garis horizontal
        currentLine += 5; // Menambahkan jarak setelah garis

        // Menambahkan label Total
        doc.setFont("helvetica", "bold");
        doc.text("Total", marginLeft, currentLine);
        doc.setFont("helvetica", "normal");
        // Mengatur value menjadi rata kanan
        doc.text(total, marginRight, currentLine, { align: "right" });

        // Simpan dokumen
        doc.save("hasil-pkwt.pdf");
    };

    return (
        <div className="card backdrop-blur-lg bg-opacity-20 bg-white mt-20 mb-20 shadow-lg rounded-lg mx-6 sm:mx-24 flex flex-col md:flex-row">
            <div className="calucalte m-4 p-3 md:w-1/2 font-inter">
                <h1 className="text-4xl font-semibold text-start my-1 text-white">Hitung Pesangon</h1>
                <hr className="my-3 border border-red-700" />
                <form action="" className="menu-pesangon flex mt-3">
                    <label htmlFor="" className="my-1">
                        <select
                            name=""
                            id=""
                            className=" px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                            value={selectedForm}
                            onChange={handleFormPesangon}>
                            <option value="PKWTT">PKWTT</option>
                            <option value="PKWT">PKWT</option>
                        </select>
                        <span className="px-3 text-sm text-slate-200">Silhakan pilih jenis pesangon</span>
                    </label>
                </form>

                {selectedForm === "PKWTT" && (
                    <div className="menu-pkwtt font-inter">
                        <h1 className="text-start my-1 p-1 font-semibold text-white">Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)</h1>
                        <form className="flex flex-col text-start"
                            onSubmit={handleSubmitPKWTT}
                            method="POST" >
                            <label htmlFor="" className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Gaji"
                                    onChange={(e) => setGaji(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Masukan nominal tanpa titik koma</span>
                            </label>
                            <label htmlFor="" className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Masa Kerja (Tahun)"
                                    onChange={(e) => setMasaKerja(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Gunakan titik sebagai pengganti koma</span>
                            </label>
                            <label className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Cuti Diambil"
                                    value={cutiDiambil}
                                    onChange={(e) => setCutiDiambil(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Cuti yang sudah di ambil</span>
                            </label>
                            <label className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Jumlah Cuti"
                                    value={jumlahCuti}
                                    onChange={(e) => setJumlahCuti(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Jumlah cuti sampai dengan ter-PHK</span>
                            </label>

                            {/* menampilkan data alasan phk */}
                            <label className="my-1">
                                <h1 className="my-1 font-semibold text-white">Alasan PHK</h1>
                                <select
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    name=""
                                    id="alasan_phk"
                                    onChange={handleAlasanChange}>
                                    {data.map((item) => (
                                        <option
                                            className=""
                                            key={item.id}
                                            value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                                <span className="px-3 text-sm text-slate-200">Silahkan pilih alasan PHK</span>
                            </label>
                            <label className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Uang Pesangon"
                                    value={uangPesangon}
                                    id="uang_pesangon" />
                                <span className="px-3 text-sm text-slate-200">Ditentukan berdasarkan alasan PHK</span>
                            </label>
                            <label className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Umpk"
                                    value={umpk}
                                    id="umpk" />
                                <span className="px-3 text-sm text-slate-200">Ditentukan berdasarkan alasan PHK</span>
                            </label>
                            <label className="my-1">
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500peer"
                                    type="text"
                                    placeholder="Uang Pisah"
                                    value={uangPisah}
                                    id="uang_pisah" />
                                <span className="px-3 text-sm text-slate-200">Ditentukan berdasarkan alasan PHK</span>
                            </label>
                            <button
                                className="my-1 mr-0 bg-red-600 px-5 py-2 rounded-lg text-white font-semibold font-inter block mx-auto hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500"
                                type="submit">
                                Hitung
                            </button>
                        </form>
                    </div>
                )}

                {selectedForm === "PKWT" && (
                    <div className="menu-pkwt font-inter">
                        <h1 className="text-start my-1 p-1 font-semibold text-white">Perjanjian Kerja Waktu Tertentu(PKWT)</h1>
                        <form className="flex flex-col text-start mt-3" method="POST" onSubmit={handleSubmitPKWT}>
                            <label>
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 peer"
                                    type="text"
                                    placeholder="Lama Bekerja (Bulan)"
                                    value={lamaBekerja}
                                    onChange={(e) => setLamaBekerja(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Masukan jumlah bulan anda bekerja</span>
                            </label>

                            <label>
                                <input
                                    className="px-3 py-2 border shadow rounded w-full block text-sm placeholder:text-slate-800
                                focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500peer"
                                    type="text"
                                    placeholder="Upah Terakhir"
                                    value={upahTerakhir}
                                    onChange={(e) => setUpahTerakhir(e.target.value)} />
                                <span className="px-3 text-sm text-slate-200">Masukan nominal tanpa titik dan koma</span>
                            </label>
                            <button
                                className="my-1 mr-0 bg-red-600 px-5 py-2 rounded-lg text-white font-semibold font-inter block mx-auto hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500"
                                type="submit">
                                Hitung
                            </button>
                        </form>
                    </div>
                )}


            </div>
            <div className="hasil m-4 p-3 md:w-1/2">
                <h1 className="text-4xl font-semibold text-start text-white my-1 font-inter">Hasil Hitung</h1>
                <hr className="my-3 border border-red-700" />
                {showHasilPKWTT && (
                    <div className="">
                        <div id="hasil-pkwtt" className="flex text-start text-wrap text-white font-inter">
                            <ul className="font-semibold w-full">
                                <div id="heading" className="my-3 p-2 text-center text-xl font-semibold text-white">
                                    Perjanjian Kerja Waktu Tidak Tertentu
                                </div>
                                <li id="title" className="my-1 text-lg">
                                    Alasan PHK {hasilPKWTT.title}
                                </li>
                                <li id="alasan" className="my-1">
                                    <p id="" className="text-slate-300 text-sm">{hasilPKWTT.alasanphk}</p>
                                </li>
                                <li id="pesangon" className="mt-3 mb-1 flex justify-between">
                                    <span>Pesangon</span>
                                    <span>Rp {hasilPKWTT.pesangon}</span>
                                </li>
                                <li id="umpk" className="my-1 flex justify-between">
                                    <span>UMPK</span>
                                    <span>Rp {hasilPKWT.umpk}</span>
                                </li>
                                <li id="uangpisah" className="my-1 flex justify-between">
                                    <span>Uang Pisah</span>
                                    <span>Rp {hasilPKWTT.uangpisah}</span>
                                </li>
                                <hr className="my-3 border border-red-700" />
                                <li id="totalPKWTT" className="my-1 flex justify-between">
                                    <span>Total Pesangon</span>
                                    <span>Rp {hasilPKWTT.total}</span>
                                </li>
                                <li id="pajak" className="my-1 flex justify-between">
                                    <span>Pajak</span>
                                    <span>Rp {hasilPKWTT.pph21}</span>
                                </li>
                                <li id="netto" className="my-1 flex justify-between">
                                    <span>Netto Diterima</span>
                                    <span>Rp {hasilPKWTT.netto}</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            className="my-1 mr-0 bg-red-600 px-5 py-2 rounded-lg text-white font-semibold font-inter block mx-auto hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500"
                            onClick={handleDownloadPdfPKWTT}>
                            Download PDF
                        </button>
                    </div>
                )}
                {showHasilPKWT && (
                    <div className="">
                        <div id="hasil-pkwt" className="flex text-start font-inter">
                            <ul className="font-semibold w-full text-white">
                                <div id="headingPKWT" className="my-3 p-2 text-center text-lg font-semibold">
                                    Perjanjian Kerja Waktu Tertentu
                                </div>
                                <li id="gaji" className="my-1 flex justify-between">
                                    <span id="gajiHeading">Gaji Terakhir</span>
                                    <span>Rp {upahTerakhir}</span>
                                </li>
                                <li id="masaKerja" className="my-1 flex justify-between">
                                    <span id="masaKerjaHeading">Masa Kerja</span>
                                    <span>{lamaBekerja} Bulan</span>
                                </li>
                                <hr className="my-3 border border-red-700" />
                                <li id="totalPKWT" className="my-1 flex justify-between">
                                    <span id="totalHeading">Total Pesangon</span>
                                    <span>{hasilPKWT}</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            className="my-1 mr-0 bg-red-600 px-5 py-2 rounded-lg text-white font-semibold font-inter block mx-auto hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500"
                            onClick={handleDownloadPdfPKWT}>
                            Download PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PesangonCalculator;