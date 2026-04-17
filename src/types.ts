export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

export type Point = { x: number; y: number };

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
