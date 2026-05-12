import { Fragment, useEffect, useRef, useState } from 'react';

import {
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
  redirect
} from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit
} from '@remix-run/react';

import {
  type Game,
  type GameAnswer,
  getCurrentGameAnswer,
  getGame,
  getWordStartsWith
} from '~/api/service';
import { postAnswer } from '~/api/service/game/answer.api';
import {
  countAnswersAccuracy,
  countCorrectAnswers,
  getPerformance
} from '~/api/service/game/game-report';
import AlertIcon from '~/components/icon/AlertIcon';
import CornerDownLeftIcon from '~/components/icon/CornerDownLeftIcon';
import NextIcon from '~/components/icon/NextIcon';

export const meta: MetaFunction = () => {
  return [{ title: 'Sa-Kata | Permainan' }];
};

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
  const isFromSkip = formData.get('is-from-skip')?.toString() === 'true';
  const gameId = params.gameId;
  const answer = postAnswer(gameId!, word!, isFromSkip);
  return json({ answer });
};

export default function NewGame() {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (duration <= 0) {
      answerInputRef.current!.blur();
      setShowGameOver(true);
    }
  }, [duration]);

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

  const [showGameOver, setShowGameOver] = useState(false);

  const submit = useSubmit();
  const onSkipClick = () => {
    const { syllables } = currentAnswer;
    const word = getWordStartsWith(syllables[syllables.length - 1]);
    answerInputRef.current!.value = word;
    answerInputRef.current!.focus();
    const formData = new FormData();
    formData.append('answer-word', word);
    formData.append('is-from-skip', 'true');

    submit(formData, { method: 'post' });
  };

  return (
    <div className="container">
      {showGameOver && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              {/* <Link to="/permainan"> */}
              <span className="close" onClick={() => navigate('/permainan')}>
                &times;
              </span>
              {/* </Link> */}
              <h2>Waktu Habis</h2>
            </div>
            <div className="modal-body">
              <p>
                Anda menunjukkan performa permainan yang {getPerformance(game)}.
              </p>
              <p>
                Dalam waktu{' '}
                <span className="modal-body__highlight">
                  {option.duration} detik
                </span>
                , Anda berhasil menyambungkan{' '}
                <span className="modal-body__highlight">
                  {countCorrectAnswers(answers)} kata
                </span>{' '}
                dengan{' '}
                <span className="modal-body__highlight">
                  akurasi {countAnswersAccuracy(answers)}%
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      )}
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
                <NextIcon size={42} onClick={onSkipClick} />
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
