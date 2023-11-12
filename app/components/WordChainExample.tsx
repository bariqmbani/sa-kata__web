import { Link } from '@remix-run/react';

export default function ChainExample() {
  return (
    <div className="how-to-play__example">
      <Link
        target="_blank"
        to="https://kbbi.kemdikbud.go.id/entri/sifat"
        rel="noreferrer"
        className="tooltip"
      >
        sifat <span className="tooltip-text">si.fat</span>
      </Link>
      &nbsp;-&gt;&nbsp;
      <Link
        target="_blank"
        to="https://kbbi.kemdikbud.go.id/entri/fatwa"
        rel="noreferrer"
        className="tooltip"
      >
        fatwa <span className="tooltip-text">fat.wa</span>
      </Link>
      &nbsp;-&gt;&nbsp;
      <Link
        target="_blank"
        to="https://kbbi.kemdikbud.go.id/entri/wanita"
        rel="noreferrer"
        className="tooltip"
      >
        wanita <span className="tooltip-text">wa.ni.ta</span>
      </Link>
      &nbsp;-&gt;&nbsp;
      <div className="tooltip">
        ta...{' '}
        <span className="tooltip-text">
          ta.hu
          <br />
          ta.kut
          <br />
          tam.bang
        </span>
      </div>
    </div>
  );
}
