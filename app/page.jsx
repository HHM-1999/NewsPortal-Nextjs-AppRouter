// import Footer from "@/components/Footer";
import Lead from "@/components/HomeContent/Lead";
import SpecialLead from "@/components/HomeContent/SpecialLead";


export default function HomePage() {
  return (
    <>
      <main className="page-bangla" >
        <Lead />
        <div className="card-news-area">
          <SpecialLead />
        </div>
      </main>
    </>
  );
}
