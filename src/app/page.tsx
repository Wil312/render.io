import TopBar from "@/components/TopBar";
import Rail from "@/components/Rail";
import PreviewPane from "@/components/PreviewPane";
import PromptPane from "@/components/PromptPane";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Rail />
        <PreviewPane />
        {/* Draggable-looking 1px divider */}
        <div className="group relative w-px shrink-0 cursor-col-resize bg-[var(--line)] transition-colors hover:bg-[var(--accent)]">
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>
        <PromptPane />
      </div>
    </div>
  );
}
