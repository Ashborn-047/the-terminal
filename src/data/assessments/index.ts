import { ChapterAssessment } from '../../features/lab-engine/providers/QuestionProvider';
import { ch01Assessment } from './ch01/assessment';
import { ch02Assessment } from './ch02/assessment';
import { ch03Assessment } from './ch03/assessment';
import { ch04Assessment } from './ch04/assessment';
import { ch05Assessment } from './ch05/assessment';
import { ch06Assessment } from './ch06/assessment';

import { ch07Assessment } from './ch07/assessment';
import { ch08Assessment } from './ch08/assessment';
import { ch09Assessment } from './ch09/assessment';

export const staticQuestionBank: ChapterAssessment[] = [
    ...ch01Assessment,
    ...ch02Assessment,
    ...ch03Assessment,
    ...ch04Assessment,
    ...ch05Assessment,
    ...ch06Assessment,
    ...ch07Assessment,
    ...ch08Assessment,
    ...ch09Assessment,
];
