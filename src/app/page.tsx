import EducationBar from "@/components/EducationBar";
import Experience from "@/components/Experience";
import FieldNotes from "@/components/FieldNotes";
import FromTheDesk from "@/components/FromTheDesk";
import Masthead from "@/components/Masthead";
import Projects from "@/components/Projects";
import QuadRow from "@/components/QuadRow";
import SiteHeader from "@/components/SiteHeader";
import TechStack from "@/components/TechStack";
import ThisIssue from "@/components/ThisIssue";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <div className="relative z-2 px-[clamp(18px,2.4vw,34px)] pt-[26px] pb-[30px]">
        <div className="mx-auto max-w-[1360px]">
          <Masthead />

          {/* Main body: broadsheet column + sidebar */}
          <div className="grid grid-cols-1 p1080:grid-cols-[minmax(0,1fr)_clamp(268px,26.5%,352px)]">
            <main className="min-w-0 pt-[18px] p1080:pr-7">
              <FromTheDesk />
              <Experience />
              <Projects />
            </main>

            <aside className="mt-6 min-w-0 border-t border-rule-60 pt-5 p1080:mt-0 p1080:border-t-0 p1080:border-l p1080:pt-[18px] p1080:pl-7">
              <ThisIssue />
              <TechStack />
              <FieldNotes />
            </aside>
          </div>

          <EducationBar />
          <QuadRow />

          <footer className="mt-4 border-t border-ink pt-[10px] text-center font-mono text-[11.5px] tracking-[0.02em] text-ink-mute">
            &copy; 2025 Mihir Jataniya. All thoughts are my own.
          </footer>
        </div>
      </div>
    </>
  );
}
