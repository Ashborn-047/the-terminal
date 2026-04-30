import { ChapterContent } from '../../types/chapters';
export type { ChapterContent, ChapterSection, TerminalBlock, Callout } from '../../types/chapters';
import { ch01Content } from './ch01/content';
import { ch02Content } from './ch02/content';
import { ch03Content } from './ch03/content';
import { ch04Content } from './ch04/content';
import { ch05Content } from './ch05/content';
import { ch06Content } from './ch06/content';

import { ch07Content } from './ch07/content';
import { ch08Content } from './ch08/content';
import { ch09Content } from './ch09/content';
import { ch10Content } from './ch10/content';

export const chapterContents: Record<string, ChapterContent> = {
    'track1-ch01': ch01Content,
    'track1-ch02': ch02Content,
    'track1-ch03': ch03Content,
    'track1-ch04': ch04Content,
    'track1-ch05': ch05Content,
    'track1-ch06': ch06Content,
    'track1-ch07': ch07Content,
    'track1-ch08': ch08Content,
    'track1-ch09': ch09Content,
    'track1-ch10': ch10Content,
};
