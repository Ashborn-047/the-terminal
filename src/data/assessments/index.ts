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
import { t2ch02Assessment } from './advanced/ch02/assessment';
import { t2ch03Assessment } from './advanced/ch03/assessment';
import { t2ch04Assessment } from './advanced/ch04/assessment';
import { t2ch05Assessment } from './advanced/ch05/assessment';
import { t2ch06Assessment } from './advanced/ch06/assessment';
import { t2ch07Assessment } from './advanced/ch07/assessment';
import { t2ch08Assessment } from './advanced/ch08/assessment';
import { t2ch09Assessment } from './advanced/ch09/assessment';
import { t2ch10Assessment } from './advanced/ch10/assessment';
import { t2ch11Assessment } from './advanced/ch11/assessment';
import { t2ch12Assessment } from './advanced/ch12/assessment';

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
    ...t2ch02Assessment,
    ...t2ch03Assessment,
    ...t2ch04Assessment,
    ...t2ch05Assessment,
    ...t2ch06Assessment,
    ...t2ch07Assessment,
    ...t2ch08Assessment,
    ...t2ch09Assessment,
    ...t2ch10Assessment,
    ...t2ch11Assessment,
    ...t2ch12Assessment,
];
