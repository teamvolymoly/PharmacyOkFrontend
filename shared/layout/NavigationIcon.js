const paths = {
  home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6"/></>,
  sale: <><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h3"/></>,
  purchase: <><path d="M4 6h2l2 9h9l2-6H7"/><circle cx="10" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></>,
  inventory: <><path d="m4 8 8-4 8 4-8 4-8-4Z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/></>,
  book: <><path d="M4 5c3-.7 5.7 0 8 2v13c-2.3-2-5-2.7-8-2V5Z"/><path d="M20 5c-3-.7-5.7 0-8 2v13c2.3-2 5-2.7 8-2V5Z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.8-1.8l1-1.8-2.1-2.1-1.8 1a7 7 0 0 0-1.8-.8L11 2.5H8l-.6 1.9a7 7 0 0 0-1.8.8l-1.8-1-2.1 2.1 1 1.8a7 7 0 0 0-.8 1.8l-2 .6v3l2 .6c.2.7.5 1.3.8 1.8l-1 1.8 2.1 2.1 1.8-1c.6.4 1.2.6 1.8.8l.6 2h3l.6-2c.7-.2 1.3-.5 1.8-.8l1.8 1 2.1-2.1-1-1.8c.4-.6.6-1.2.8-1.8l1.9-.6Z" transform="translate(2.5 0) scale(.8)"/></>,
};

export default function NavigationIcon({ name }) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
