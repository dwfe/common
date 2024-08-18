import '@do-while-for-each/test'
import {handleTemplate} from '../../ungrouped';

describe('handleTemplate', () => {

  test(`check`, () => {
    expect(handleTemplate('Поле "{{field}}": {{error}}', {field: 'hello', error: 123})).not.eq(`Поле hello: 123`);

    expect(handleTemplate('Поле "{{field}}": {{error}}', {field: 'hello', error: 123})).eq(`Поле "hello": 123`);

    expect(handleTemplate('Поле "{{field}}": {{error}}', {field: 'hello'})).eq(`Поле "hello": undefined`);

    expect(handleTemplate('Поле "{{field}}": {{error}}', {})).eq(`Поле "undefined": undefined`);
  });

});
