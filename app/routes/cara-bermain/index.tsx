import type { MetaFunction } from '@remix-run/node';

import HeaderNav from '~/components/HeaderNav';
import WordChainExample from '~/components/WordChainExample';

export const meta: MetaFunction = () => {
  return [{ title: 'Sa-Kata | Cara Bermain' }];
};

export default function Index() {
  return (
    <div className="container">
      <HeaderNav to="/" text="Cara Bermain" />
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
