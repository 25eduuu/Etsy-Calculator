const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const calculateOrder = require('../calculator.js');

function runApp(search = '', affiliateLinks = []) {
  const defaults = {
    price:'32', shipping:'4.9', gift:'0', discount:'0', cogs:'8', postage:'5.2', other:'1',
    listing:'0.18', transaction:'6.5', processing:'4', fixed:'0.3', regulatory:'0.8', feeVat:'22', offsite:'0'
  };
  const elements = new Map();
  for (const [id, value] of Object.entries(defaults)) elements.set(id, {value, events:{}, addEventListener(type, fn){this.events[type]=fn;}});
  for (const id of ['vatOnFees','net','margin','breakEven','feeList','copy','share','resources','affiliateLinks']) {
    elements.set(id, {checked:id==='vatOnFees', hidden:true, textContent:'', innerHTML:'', value:'', events:{}, classList:{toggle(){}}, addEventListener(type, fn){this.events[type]=fn;}});
  }
  const context = vm.createContext({
    window:{calculateOrder,APP_CONFIG:{affiliateLinks}},
    document:{getElementById:id=>elements.get(id)},
    location:{href:`https://margine.test/${search}` ,search},
    navigator:{clipboard:{writeText:async()=>{}}},
    history:{replaceState(){}},
    URL,URLSearchParams,Intl,Number,Math,Object,String,Array,Promise,setTimeout
  });
  vm.runInContext(fs.readFileSync(require.resolve('../app.js'),'utf8'),context);
  return elements;
}

test('page initializes the expected example and sanitizes shared values', () => {
  const elements = runApp('?price=100&discount=150&transaction=150');
  assert.equal(elements.get('price').value, '100');
  assert.equal(elements.get('discount').value, '100');
  assert.equal(elements.get('transaction').value, '100');
  assert.match(elements.get('net').textContent, /-16,15/); // Discount and fee rates from the URL are capped.
  const initial = runApp();
  assert.match(initial.get('net').textContent, /17,03/);
  assert.match(initial.get('breakEven').textContent, /12,25/);
});

test('only HTTPS affiliate destinations are rendered', () => {
  const elements = runApp('', [
    {label:'eRank',url:'https://erank.com/affiliate?ref=sample'},
    {label:'unsafe',url:'javascript:alert(1)'}
  ]);
  assert.equal(elements.get('resources').hidden, false);
  assert.match(elements.get('affiliateLinks').innerHTML, /https:\/\/erank\.com/);
  assert.doesNotMatch(elements.get('affiliateLinks').innerHTML, /javascript:/);
});
