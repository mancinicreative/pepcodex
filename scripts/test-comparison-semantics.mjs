import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectComparisonSemantics} from './lib/comparison-semantics.mjs';
const A = {name:'Fixture A',sources:{human:4}}, B = {name:'Fixture B',sources:{human:7}};
const inspect = (answer,a=A,b=B) => inspectComparisonSemantics({peptideA:'a',peptideB:'b',faqs:[{question:'Evidence?',answer}]},a,b).map(x=>x.code);
test('rank-order reversals and ties are rejected even when printed counts match metadata',()=>{
  for (const counts of ['4 human studies compared to 7','7 human studies compared to 7']) {
    assert.deepEqual(inspect(`Fixture A has more clinical evidence with ${counts} for Fixture B.`),['COUNT_BASED_CLINICAL_WINNER_TEMPLATE','PRINTED_MORE_RELATION_FALSE']);
  }
  assert.deepEqual(inspect('Fixture B has more clinical evidence with 7 human studies compared to 4 for Fixture A.'),['COUNT_BASED_CLINICAL_WINNER_TEMPLATE']);
});
test('stale equal-count sentences cannot evade the numeric count gate',()=>{
  assert.deepEqual(inspect('Both have similar numbers of human studies (9 each).'),['EACH_COUNT_DISAGREES_WITH_DOSSIERS']);
  assert.deepEqual(inspect('Both have similar numbers of human studies (4 each).',A,{...B,sources:{human:4}}),[]);
  assert.deepEqual(inspect('Both have similar numbers of human studies (4 each).',A,{name:'Fixture B'}),['HUMAN_COUNT_UNAVAILABLE']);
});
test('grade contradiction uses printed labels, preserving wrapping and escaped names',()=>{
  const a={...A,name:'Fixture (A)'}, b={...B,name:'Fixture B+'};
  const template='Both are categorized under Metabolic, but they differ in evidence strength. Fixture (A) has Very\r\n Low evidence (4 sources), while Fixture B+ has Very Low evidence (7 sources).';
  assert.deepEqual(inspect(template,a,b),['DIFFERENCE_WITH_EQUAL_PRINTED_GRADES']);
  assert.deepEqual(inspect(template.replace('B+ has Very Low','B+ has Moderate'),a,b),[]);
});
test('neutral inventories and distinct outcome claims are outside these templates',()=>{
  assert.deepEqual(inspect('Fixture A has 4 human-tagged identifiers and Fixture B has 7. Counts do not establish comparative efficacy.'),[]);
  assert.deepEqual(inspect('The endpoint was observed more often in one arm than the other.'),[]);
  assert.equal(inspectComparisonSemantics({peptideA:'a',peptideB:'b',faqs:[]},A,undefined)[0].code,'MISSING_DOSSIER');
  assert.equal(inspectComparisonSemantics({faqs:[]},undefined,undefined)[0].code,'INVALID_PAIR_METADATA');
});
