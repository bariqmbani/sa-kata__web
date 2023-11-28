import { identifyLastSyllable } from '../app/api/service/word/syllabify.api';
import {
  type TestData,
  endsWithCC,
  endsWithCCC,
  endsWithCV,
  endsWithVC,
  endsWithVV,
  endsWithVVV,
  khLastSyllables,
  ngLastSyllables,
  syLastSyllables
} from './syllabify.test.data';

describe('breaking word into two syllables', () => {
  testsLastSyllables('ends with -ng', ngLastSyllables);
  testsLastSyllables('ends with -kh', khLastSyllables);
  testsLastSyllables('ends with -sy', syLastSyllables);
  testsLastSyllables('ends with CCC', endsWithCCC);
  testsLastSyllables('ends with CC', endsWithCC);
  testsLastSyllables('ends with VC', endsWithVC);
  testsLastSyllables('ends with CV', endsWithCV);
  testsLastSyllables('ends with VVV', endsWithVVV);
  testsLastSyllables('ends with VV', endsWithVV);
});

function testsLastSyllables(name: string, data: TestData): void {
  for (const [word, expected] of Object.entries(data)) {
    test(`${name}: ${word} -> ${expected}`, () => {
      expect(identifyLastSyllable(word)).toEqual(expected);
    });
  }
}
