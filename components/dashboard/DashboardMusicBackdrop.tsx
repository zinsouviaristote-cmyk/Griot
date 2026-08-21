"use client";

import { Music2, Music3 } from "lucide-react";

export function DashboardMusicBackdrop() {
  return (
    <div className="dashboard-music-backdrop" aria-hidden="true">
      <div className="music-staff music-staff-top" />
      <div className="music-staff music-staff-bottom" />
      <Music2 className="music-note music-note-top" strokeWidth={1.2} />
      <Music3 className="music-note music-note-bottom" strokeWidth={1.2} />
    </div>
  );
}