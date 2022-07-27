import '@do-while-for-each/test';
import {getPropDescriptor, PropType, recognizePropType} from '../..';

class A {
  constructor(private name: string) {
  }

  fullName() {
  }

  get age() {
    return 10;
  }

  set age(value) {
  }

  set about(value) {
  }

  get nick() {
    return '123';
  }
}

const a = new A('hi');

describe('recognizePropType, object', () => {

  test('method', () => {
    const obj = {
      fullName() {
      }
    }
    expect(getPropType(obj, 'fullName')).eq('method');
  });

  test('value', () => {
    const obj = {
      fullName: 'Alex 007',
    }
    expect(getPropType(obj, 'fullName')).eq('value');
  });

  test('accessor', () => {
    const obj = {
      get fullName() {
        return 'Alex 007';
      },
      set fullName(value) {
      }
    }
    expect(getPropType(obj, 'fullName')).eq('accessor');
  });

  test('getter', () => {
    const obj = {
      get fullName() {
        return 'Alex 007';
      },
    }
    expect(getPropType(obj, 'fullName')).eq('getter');
  });

  test('setter', () => {
    const obj = {
      set fullName(value) {
      }
    }
    expect(getPropType(obj, 'fullName')).eq('setter');
  });

});

describe('recognizePropType, instance', () => {

  test('method', () => {
    expect(getPropType(a, 'fullName')).eq('method');
  });

  test('value', () => {
    expect(getPropType(a, 'name')).eq('value');
  });

  test('accessor', () => {
    expect(getPropType(a, 'age')).eq('accessor');
  });

  test('getter', () => {
    expect(getPropType(a, 'nick')).eq('getter');
  });

  test('setter', () => {
    expect(getPropType(a, 'about')).eq('setter');
  });

});

function getPropType(obj: any, prop: any): PropType {
  return recognizePropType(getPropDescriptor(obj, prop));
}
