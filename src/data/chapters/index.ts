import { ChapterContent } from '../../types/chapters';
export type { ChapterContent, ChapterSection, TerminalBlock, Callout } from '../../types/chapters';

// Foundational Chapters
import { ch01Content } from './foundational/ch01/content';
import { ch02Content } from './foundational/ch02/content';
import { ch03Content } from './foundational/ch03/content';
import { ch04Content } from './foundational/ch04/content';
import { ch05Content } from './foundational/ch05/content';
import { ch06Content } from './foundational/ch06/content';
import { ch07Content } from './foundational/ch07/content';
import { ch08Content } from './foundational/ch08/content';
import { ch09Content } from './foundational/ch09/content';
import { ch10Content } from './foundational/ch10/content';
import { ch11Content } from './foundational/ch11/content';
import { ch12Content } from './foundational/ch12/content';
import { ch13Content } from './foundational/ch13/content';
import { ch14Content } from './foundational/ch14/content';
import { ch15Content } from './foundational/ch15/content';

// Advanced Chapters
import { t2ch01Content } from './advanced/ch01/content';
import { t2ch02Content } from './advanced/ch02/content';

export const chapterContents: Record<string, ChapterContent> = {
    // Foundational
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
    'track1-ch11': ch11Content,
    'track1-ch12': ch12Content,
    'track1-ch13': ch13Content,
    'track1-ch14': ch14Content,
    'track1-ch15': ch15Content,
    
    // Advanced
    'track2-ch01': t2ch01Content,
    'track2-ch02': t2ch02Content,
};
