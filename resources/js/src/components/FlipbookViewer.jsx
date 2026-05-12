import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden relative border border-slate-200 flex flex-col" ref={ref} style={{ padding: '0', backgroundColor: '#fff' }}>
            {/* Watermark / Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                 {props.bgImage && <img src={props.bgImage} alt="watermark" className="w-[80%] h-auto object-contain" />}
            </div>
            
            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col p-8">
                {props.children}
            </div>
            
            {/* Page number */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-medium z-10">
                - {props.number} -
            </div>
            
            {/* Book Spine Shadow Effect */}
            <div className={`absolute top-0 bottom-0 w-8 z-20 pointer-events-none ${props.isLeft ? 'right-0 bg-gradient-to-l from-black/10 to-transparent' : 'left-0 bg-gradient-to-r from-black/10 to-transparent'}`}></div>
        </div>
    );
});

export default function FlipbookViewer({ title, pages, onClose, bgImage }) {
    const book = useRef();
    const [page, setPage] = useState(0);

    const nextButtonClick = () => {
        book.current.pageFlip().flipNext();
    };

    const prevButtonClick = () => {
        book.current.pageFlip().flipPrev();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500">
            {/* Header / Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-50 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black tracking-widest uppercase text-white drop-shadow-md">{title}</h2>
                    <p className="text-sky-300 text-xs font-bold tracking-widest uppercase mt-1">Mode Buku Digital</p>
                </div>
                <button onClick={onClose} className="p-3 bg-white/10 hover:bg-rose-500/80 rounded-full transition-all duration-300 backdrop-blur-md hover:rotate-90 group" title="Tutup Flipbook">
                    <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            {/* Flipbook Container */}
            <div className="flex-1 flex items-center justify-center w-full relative px-2 sm:px-12">
                
                {/* Prev Button */}
                <button onClick={prevButtonClick} className="hidden sm:block absolute left-2 md:left-8 z-50 p-3 md:p-4 bg-white/5 hover:bg-sky-500 rounded-full text-white backdrop-blur-md transition-all duration-300 border border-white/10 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] group" title="Halaman Sebelumnya">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="shadow-2xl">
                    <HTMLFlipBook 
                        width={450} 
                        height={650} 
                        size="stretch"
                        minWidth={315}
                        maxWidth={550}
                        minHeight={420}
                        maxHeight={750}
                        maxShadowOpacity={0.6}
                        showCover={true}
                        mobileScrollSupport={true}
                        usePortrait={true}
                        onFlip={(e) => setPage(e.data)}
                        className="mx-auto"
                        ref={book}
                    >
                        {/* COVER PAGE */}
                        <Page number={1} bgImage={bgImage} isLeft={false}>
                            <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
                               <img src={bgImage} alt="logo" className="w-32 h-32 object-contain mb-8 drop-shadow-xl" />
                               <h1 className="text-4xl font-black text-slate-800 uppercase leading-tight mb-6 px-4">{title}</h1>
                               <div className="w-20 h-1.5 bg-sky-500 mx-auto mb-8 rounded-full"></div>
                               <p className="text-slate-600 font-bold tracking-widest uppercase text-sm">Kementerian Luar Negeri</p>
                               <p className="text-slate-400 font-medium text-xs mt-2 tracking-widest">Republik Indonesia</p>
                            </div>
                        </Page>

                        {/* DATA PAGES */}
                        {pages.map((pageData, index) => (
                            <Page key={index} number={index + 2} bgImage={bgImage} isLeft={(index + 2) % 2 === 0}>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-center font-bold text-slate-800 text-lg uppercase mb-1 border-b-2 border-slate-100 pb-2">{pageData.unitName}</h3>
                                    {pageData.kontak && <p className="text-center text-[10px] text-slate-500 mb-4 bg-slate-50 py-1 rounded-lg leading-relaxed">{pageData.kontak}</p>}
                                    
                                    <div className="flex-1 overflow-hidden mt-2">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-600">
                                                    <th className="py-2 font-bold w-8">No.</th>
                                                    <th className="py-2 font-bold w-1/2">Nama Lengkap</th>
                                                    <th className="py-2 font-bold">Jabatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {pageData.pejabat.map((p, i) => (
                                                    <tr key={i} className="text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <td className="py-2.5 align-top">{pageData.startIndex + i + 1}.</td>
                                                        <td className="py-2.5 align-top font-medium pr-2 leading-relaxed">{p.nama}</td>
                                                        <td className="py-2.5 align-top italic text-slate-500 leading-relaxed">{p.jabatan}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Page>
                        ))}

                        {/* BACK COVER */}
                        <Page number={pages.length + 2} bgImage={bgImage} isLeft={(pages.length + 2) % 2 === 0}>
                            <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
                               <img src={bgImage} alt="logo" className="w-16 h-16 object-contain mb-6 opacity-30" />
                               <h1 className="text-xl font-bold text-slate-400 uppercase leading-tight mb-4 tracking-widest">Akhir Dokumen</h1>
                               <div className="w-12 h-1 bg-slate-200 mx-auto mb-6 rounded-full"></div>
                               <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Buku Pejabat Kemenlu RI</p>
                            </div>
                        </Page>
                    </HTMLFlipBook>
                </div>

                {/* Next Button */}
                <button onClick={nextButtonClick} className="hidden sm:block absolute right-2 md:right-8 z-50 p-3 md:p-4 bg-white/5 hover:bg-sky-500 rounded-full text-white backdrop-blur-md transition-all duration-300 border border-white/10 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] group" title="Halaman Selanjutnya">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
            
            {/* Footer / Controls */}
            <div className="absolute bottom-6 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-medium text-sm flex items-center gap-4">
                 <span className="uppercase tracking-wider text-xs text-slate-300">Halaman</span>
                 <span className="bg-sky-500/80 px-3 py-1 rounded-md shadow-inner">{page === 0 ? 1 : page} / {pages.length + 2}</span>
            </div>
        </div>
    );
}
