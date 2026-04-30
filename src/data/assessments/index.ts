import { ChapterAssessment } from '../../features/lab-engine/providers/QuestionProvider';
import { ch01Assessment } from './ch01';
import { ch02Assessment } from './ch02';
import { ch03Assessment } from './ch03';
import { ch04Assessment } from './ch04';
import { ch05Assessment } from './ch05';
import { ch06Assessment } from './ch06';

import { ch07Assessment } from './ch07';

export const staticQuestionBank: ChapterAssessment[] = [
    ...ch01Assessment,
    ...ch02Assessment,
    ...ch03Assessment,
    ...ch04Assessment,
    ...ch05Assessment,
    ...ch06Assessment,
    ...ch07Assessment,
];
