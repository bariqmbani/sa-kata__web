import type { MetaFunction } from '@remix-run/node';
import { useLocation, useNavigate } from '@remix-run/react';

import WordChainExample from '~/components/WordChainExample';
import ArrowLeft from '~/components/icon/ArrowLeft';

export const meta: MetaFunction = () => {
  return [{ title: 'Sa-Kata | Cara Bermain' }];
};

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log({ location });

  const toMainMenu = () => {
    if (location.state?.from === '/') {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="container">
      <div className="header-nav">
        <span onClick={toMainMenu}>
          <ArrowLeft className="mr-1" />
        </span>
        <h1>Cara Bermain</h1>
      </div>
      <div className="how-to-play__wrapper mt-2 mb-5 scrollable">
        <section>
          <p>
            Sa-Kata adalah permainan menyambung kata bahasa Indonesia dengan
            objektif membuat rantai kata yang terbentuk berdasarkan suku kata
            terakhir kata sebelumnya.
          </p>
          <p>
            <WordChainExample />
          </p>
          <p>Kata pertama akan ditentukan secara acak.</p>
          <p>
            Mata rantai tidak akan terbentuk jika kata tidak valid atau tidak
            terdapat dalam entri KBBI.
          </p>
          <p>
            Permainan berlangsung sesuai dengan durasi waktu yang dipilih
            sebelum memulai permainan.
          </p>
          <p>Kata yang Anda pilih menentukan langkah selanjutnya.</p>
          <p>Selamat bermain!</p>
        </section>
      </div>
    </div>
  );
}
