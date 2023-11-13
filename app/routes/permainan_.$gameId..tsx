import { useEffect, useState } from 'react';

import { type LoaderFunction, json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';

import { type Game, getGame } from '~/api/game';
import CornerDownLeftIcon from '~/components/icon/CornerDownLeftIcon';
import NextIcon from '~/components/icon/NextIcon';

export const loader: LoaderFunction = async ({ params }) => {
  const gameId = params.gameId;
  const game = getGame(gameId!);
  console.log({ game });
  if (!game) {
    return redirect('/permainan');
  }
  return json({ game });
};

export default function NewGame() {
  const { game }: { game: Game } = useLoaderData<typeof loader>();
  const { option, startAt } = game;

  const initialDuration = Math.ceil(
    parseInt(option.duration) - (Date.now() - startAt) / 1000
  );

  const [duration, setDuration] = useState<number>(
    initialDuration > 0 ? initialDuration : 0
  );

  useEffect(() => {
    console.log({ option });
    if (duration <= 0) return;

    const timer = () => {
      setDuration((prevDuration) => prevDuration - 1);
    };

    const interval = setInterval(timer, 1000);
    setTimeout(() => {
      clearInterval(interval);
    }, duration * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetcher = useFetcher();

  return (
    <div className="container">
      <div className="game__wrapper">
        <h1 className="timer">{duration}</h1>
        <div className="game__current">
          <p>
            <div className="current-word">
              <span>masyara</span>
              <span>.</span>
              <span>kat</span>
            </div>{' '}
            {option.allowSkip === 'yes' && (
              <div className="skip-icon">
                <NextIcon size={42} />
              </div>
            )}
          </p>
        </div>
        <div className="text-input mt-5">
          <fetcher.Form method="post">
            <div className="nes-field input-enter__wrapper">
              <input
                type="text"
                id="answer"
                className="nes-input input-enter__form"
              />
              <span className="input-enter__icon">
                <CornerDownLeftIcon size={42} />
              </span>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
