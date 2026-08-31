export function ClinicMark() {
  return (
    <div className="clinic-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path d="M5 24c4.8-8 11.2-12 19-12s14.2 4 19 12c-4.8 8-11.2 12-19 12S9.8 32 5 24Z" />
        <circle cx="24" cy="24" r="6.5" />
        <circle cx="26" cy="22" r="2" className="clinic-mark-highlight" />
      </svg>
    </div>
  );
}
