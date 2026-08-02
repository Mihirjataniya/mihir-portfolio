import EducationBar from "@/components/EducationBar";
import Experience from "@/components/Experience";
import FieldNotes from "@/components/FieldNotes";
import FromTheDesk from "@/components/FromTheDesk";
import JsonLd from "@/components/JsonLd";
import Masthead from "@/components/Masthead";
import Projects from "@/components/Projects";
import QuadRow from "@/components/QuadRow";
import QuickLinks from "@/components/QuickLinks";
import SiteHeader from "@/components/SiteHeader";
import Sudoku from "@/components/Sudoku";
import ThisIssue from "@/components/ThisIssue";
import { contact, education, experience } from "@/data/issue";
import { SITE, absUrl, sameAs } from "@/data/site";

/** `experience.role` reads "Title, Employer"; the employer is the tail. */
const employer = experience.role.split(", ").slice(1).join(", ");

/**
 * `sameAs` is the part that earns its keep: it is how a search engine ties this
 * site to the GitHub and LinkedIn profiles it already knows about, instead of
 * treating the name as an unrelated string.
 */
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": absUrl("/#person"),
  name: SITE.author,
  url: SITE.url,
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  image: absUrl("/Mihir-img.webp"),
  email: `mailto:${contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: employer },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  sameAs,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absUrl("/#website"),
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en",
  author: { "@id": absUrl("/#person") },
  publisher: { "@id": absUrl("/#person") },
};

export default function Home() {
  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      <SiteHeader />

      <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
        <div className="mx-auto max-w-[1444px]">
          <Masthead />

          {/* Main body: broadsheet column + sidebar, with the education band
              spanning both underneath. Stacked below p1080, where `order` pulls
              the band above the sidebar; on the grid the explicit row/column
              placement takes over and the band drops back to the bottom. */}
          <div className="flex flex-col p1080:grid p1080:grid-cols-[minmax(0,1fr)_clamp(calc(268px*var(--ts)),26.5%,calc(352px*var(--ts)))]">
            <main className="order-1 min-w-0 pt-[18px] p1080:col-start-1 p1080:row-start-1 p1080:pr-[28px]">
              <FromTheDesk />
              <Experience />
              <Projects />
            </main>

            <div className="order-2 p1080:col-span-2 p1080:col-start-1 p1080:row-start-2">
              <EducationBar />
            </div>

            <aside className="order-3 mt-[24px] min-w-0 border-t border-rule-60 pt-[20px] p1080:col-start-2 p1080:row-start-1 p1080:mt-0 p1080:border-t-0 p1080:border-l p1080:pt-[18px] p1080:pl-[28px]">
              <ThisIssue />
              <FieldNotes />
              <QuickLinks />
              <Sudoku />
            </aside>
          </div>

          <QuadRow />

          <footer className="mt-[16px] border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
            &copy; 2026 Mihir Jataniya. All thoughts are my own.
          </footer>
        </div>
      </div>
    </>
  );
}
