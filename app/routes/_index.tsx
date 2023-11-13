import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="container is-centered">
      <div className="main-menu__wrapper">
        <div className="title mb-5">
          <h1>Sa-Kata</h1>
          <div className="tag">
            <span>versi alpha</span>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => navigate('/permainan', { state: { from: '/' } })}
        >
          Mulai Permainan
        </button>
        <button
          className="btn"
          onClick={() => navigate('/cara-bermain', { state: { from: '/' } })}
        >
          Cara Bermain
        </button>
        <button className="btn is-disabled">Papan Peringkat</button>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => [{ title: 'Sa-Kata | Menu Utama' }];
