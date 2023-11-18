import { games } from '..';

export const getGame = (id: string) => {
  return games.find((game) => game.id === id);
};
