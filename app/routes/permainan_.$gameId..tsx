import { useEffect, useRef, useState } from 'react';

import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import {
  type Game,
  type GameAnswer,
  getCurrentGameAnswer,
  getGame
} from '~/api/service';
import { postAnswer } from '~/api/service/game/answer.api';
import CornerDownLeftIcon from '~/components/icon/CornerDownLeftIcon';
import NextIcon from '~/components/icon/NextIcon';

export const loader: LoaderFunction = async ({ params }) => {
  const gameId = params.gameId;
  const game = getGame(gameId!);
  if (!game) {
    return redirect('/permainan');
  }
  return json({ game });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const word = formData.get('answer-word')?.toString();
  const gameId = params.gameId;
  const answer = postAnswer(gameId!, word!);
  return json({ answer });
};

export default function NewGame() {
  const { game }: { game: Game } = useLoaderData<typeof loader>();
  const { option, startAt, answers } = game;

  const initialDuration = Math.ceil(
    parseInt(option.duration) - (Date.now() - startAt) / 1000
  );

  const [duration, setDuration] = useState<number>(
    initialDuration > 0 ? initialDuration : 0
  );

  useEffect(() => {
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

  const actionData: { answer: GameAnswer } = useActionData<typeof action>();
  const [currentAnswer, setCurrentAnswer] = useState(
    getCurrentGameAnswer(answers)
  );
  const answerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!actionData) {
      return;
    }
    const { answer } = actionData;
    if (!answer.isCorrect) {
      alert('salah');
      return;
    }
    setCurrentAnswer(answer);
    const { syllables } = answer;
    answerInputRef.current!.value = syllables[syllables.length - 1];
    answerInputRef.current!.focus();
  }, [actionData]);

  return (
    <div className="container">
      <div className="game__wrapper">
        <h1 className="timer">{duration}</h1>
        <div className="game__current">
          <p>
            <div className="current-word">
              {currentAnswer.syllables.map((syllable, index) => (
                <>
                  {index !== currentAnswer.syllables.length - 1 ? (
                    <span key={index}>{syllable}</span>
                  ) : (
                    <span key={index} className="last-syllables">
                      {syllable}
                    </span>
                  )}
                </>
              ))}
            </div>{' '}
            {option.allowSkip === 'yes' && (
              <div className="skip-icon">
                <NextIcon size={42} />
              </div>
            )}
          </p>
        </div>
        <div className="text-input mt-5">
          <Form method="post">
            <div className="nes-field input-enter__wrapper">
              <input
                autoFocus
                autoComplete="off"
                type="text"
                id="answer-word"
                name="answer-word"
                className="nes-input input-enter__form"
                ref={answerInputRef}
                defaultValue={
                  currentAnswer.syllables[currentAnswer.syllables.length - 1]
                }
              />
              <button className="input-enter__icon" type="submit">
                <CornerDownLeftIcon size={42} />
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
