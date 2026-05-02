import { ChapterAssessment } from '../../features/lab-engine/providers/QuestionProvider';

// Foundational Assessments
import { ch01Assessment } from './foundational/ch01/assessment';
import { ch02Assessment } from './foundational/ch02/assessment';
import { ch03Assessment } from './foundational/ch03/assessment';
import { ch04Assessment } from './foundational/ch04/assessment';
import { ch05Assessment } from './foundational/ch05/assessment';
import { ch06Assessment } from './foundational/ch06/assessment';
import { ch07Assessment } from './foundational/ch07/assessment';
import { ch08Assessment } from './foundational/ch08/assessment';
import { ch09Assessment } from './foundational/ch09/assessment';
import { ch10Assessment } from './foundational/ch10/assessment';
import { ch11Assessment } from './foundational/ch11/assessment';
import { ch12Assessment } from './foundational/ch12/assessment';
import { ch13Assessment } from './foundational/ch13/assessment';
import { ch14Assessment } from './foundational/ch14/assessment';
import { ch15Assessment } from './foundational/ch15/assessment';

// Advanced Assessments
import { t2ch01Assessment } from './advanced/ch01/assessment';

export const staticQuestionBank: ChapterAssessment[] = [
    // Foundational
    ...ch01Assessment,
    ...ch02Assessment,
    ...ch03Assessment,
    ...ch04Assessment,
    ...ch05Assessment,
    ...ch06Assessment,
    ...ch07Assessment,
    ...ch08Assessment,
    ...ch09Assessment,
    ...ch10Assessment,
    ...ch11Assessment,
    ...ch12Assessment,
    ...ch13Assessment,
    ...ch14Assessment,
    ...ch15Assessment,

    // Advanced
    ...t2ch01Assessment,
];
