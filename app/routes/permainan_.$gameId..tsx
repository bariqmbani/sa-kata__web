import { Fragment, useEffect, useRef, useState } from 'react';

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

import AlertIcon from '../components/icon/AlertIcon';

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
  const word = formData.get('answer-word')?.toString().toLowerCase().trim();
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
    answerInputRef.current!.classList.remove('wrong-answer');
    const { answer } = actionData;
    if (!answer.isCorrect) {
      setTimeout(() => {
        answerInputRef.current!.classList.add('wrong-answer');
      }, 1);
      setShowAlert(true);
      setAlertMessage(answer.note!);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 2000);
      return;
    }
    setAlertMessage('');
    setShowAlert(false);
    setCurrentAnswer(answer);
    const { syllables } = answer;
    answerInputRef.current!.value = syllables[syllables.length - 1];
    answerInputRef.current!.focus();
  }, [actionData]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <div className="container">
      <div className="game__wrapper">
        <h1 className="timer">{duration}</h1>
        <div className="game__current">
          <div className="current">
            <div className="current-word">
              {currentAnswer.syllables.map((syllable, index) => (
                <Fragment key={index}>
                  {index !== currentAnswer.syllables.length - 1 ? (
                    <span>{syllable}</span>
                  ) : (
                    <span className="last-syllable">{syllable}</span>
                  )}
                </Fragment>
              ))}
            </div>
            {option.allowSkip === 'yes' && (
              <div className="skip-icon">
                <NextIcon size={42} />
              </div>
            )}
          </div>
        </div>
        <div className="text-input mt-5">
          <Form method="post">
            <div className="nes-field input-enter__wrapper">
              <input
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                autoCorrect="off"
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
        {showAlert && (
          <div className="alert__wrapper">
            <div className="alert__content pixel-corners">
              <AlertIcon size={20} />
              <span>{alertMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
