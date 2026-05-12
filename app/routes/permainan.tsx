import { redirect, useFetcher } from 'react-router-dom';

import type { ActionFunction, MetaFunction } from '@remix-run/node';

import type { GameOption } from '~/api/service';
import { createGame } from '~/api/service';
import HeaderNav from '~/components/HeaderNav';

export const meta: MetaFunction = () => {
  return [{ title: 'Sa-Kata | Permainan' }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const option: GameOption = Object.fromEntries(
    formData
  ) as unknown as GameOption;
  const game = createGame(option);
  return redirect(`/permainan/${game.id}`);
};

export default function Index() {
  const fetcher = useFetcher();

  return (
    <div className="container">
      <HeaderNav to="/" text="Aturan Bermain" />
      <div className="play-options__wrapper ml-4">
        <fetcher.Form method="post">
          <div className="option-section">
            <h2>Durasi Permainan</h2>
            <label htmlFor="duration-30">
              <input
                className="radio-option"
                id="duration-30"
                type="radio"
                name="duration"
                value="30"
              />
              <span>30 detik</span>
            </label>
            <br />
            <label htmlFor="duration-60">
              <input
                className="radio-option"
                id="duration-60"
                type="radio"
                name="duration"
                value="60"
                defaultChecked
              />
              <span>60 detik</span>
            </label>
            <br />
            <label htmlFor="duration-90">
              <input
                className="radio-option"
                id="duration-90"
                type="radio"
                name="duration"
                value="90"
              />
              <span>90 detik</span>
            </label>
          </div>
          <div className="option-section">
            <h2>Dapat Melewati Kata</h2>
            <label htmlFor="allowSkip-yes">
              <input
                className="radio-option"
                id="allowSkip-yes"
                type="radio"
                name="allowSkip"
                value="yes"
                defaultChecked
              />
              <span>Ya</span>
            </label>
            <br />
            <label htmlFor="allowSkip-no">
              <input
                className="radio-option"
                id="allowSkip-no"
                type="radio"
                name="allowSkip"
                value="no"
              />
              <span>Tidak</span>
            </label>
          </div>
          <input type="submit" value="Mulai" className="btn mt-5" />
        </fetcher.Form>
      </div>
    </div>
  );
}
