import '@do-while-for-each/test'
import {capitalize} from '../../ungrouped';

const immutableString = '0123456789%!?,.:; @#№()[]{}<>-=+*/\\"\'`_~&|^'
const alphabetLowerCase = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя'
const alphabetUpperCase = alphabetLowerCase.toUpperCase()

describe('capitalize', () => {

  test('Should not be changed', () => {
    for (let char of immutableString) {
      expect(capitalize(char)).toEqual(char)
      expect(capitalize(char + 'a')).toEqual(char + 'a')
      expect(capitalize(char + 'A')).toEqual(char + 'A')
      expect(capitalize(char + 'A', {from: 0, quantity: 0})).toEqual(char + 'A')
    }
  });

  test('First letter should not be changed. The rest of string should be capitalized', () => {
    for (let char of immutableString) {
      expect(capitalize(char + 'a', {from: 0, quantity: 0})).toEqual(char + 'A')
    }
  })

  test('Should be capitalized', () => {

    expect(capitalize(alphabetLowerCase, {from: 0, quantity: 0})).toEqual(alphabetUpperCase)
    expect(capitalize(alphabetUpperCase, {from: 0, quantity: 0})).toEqual(alphabetUpperCase)

    for (let i = 0; i < alphabetLowerCase.length; i++) {
      expect(capitalize(alphabetLowerCase[i])).toEqual(alphabetUpperCase[i])
      expect(capitalize(alphabetLowerCase, {from: i, quantity: 0}).slice(i)).toEqual(alphabetUpperCase.slice(i))
      expect(capitalize(alphabetLowerCase, {
        from: 0,
        quantity: i || undefined
      }).slice(0, i)).toEqual(alphabetUpperCase.slice(0, i))
    }
  })

  test('Should not generate an error', () => {
    expect(capitalize(immutableString, {from: 0, quantity: immutableString.length + 1000})).toEqual(immutableString)
    expect(capitalize(immutableString, {from: 0, quantity: -1})).toEqual(immutableString)
    expect(capitalize(alphabetLowerCase, {
      from: 0,
      quantity: alphabetLowerCase.length + 1000
    })).toEqual(alphabetUpperCase)
  })

  test('i symbol should be capitalized', () => {
    for (let i = 0; i < alphabetLowerCase.length; i++) {
      expect(capitalize(alphabetLowerCase, {from: 0, quantity: i + 1})[i]).toEqual(alphabetUpperCase[i])
      expect(capitalize(alphabetLowerCase, {from: i, quantity: 1})[i]).toEqual(alphabetUpperCase[i])
      expect(capitalize(alphabetLowerCase, {from: i})[i]).toEqual(alphabetUpperCase[i])
      expect(capitalize(alphabetLowerCase, {from: i, quantity: 0})[i]).toEqual(alphabetUpperCase[i])
    }
  })

  test('-i symbol should be capitalized', () => {
    for (let i = 1; i < alphabetLowerCase.length + 1; i++) {
      expect(capitalize(alphabetLowerCase, {
        from: -i,
        quantity: 0
      })[alphabetLowerCase.length - i]).toEqual(alphabetUpperCase[alphabetLowerCase.length - i])

      expect(capitalize(alphabetLowerCase, {
        from: -i,
        quantity: 1,
      })[alphabetLowerCase.length - i]).toEqual(alphabetUpperCase[alphabetLowerCase.length - i])

    }
  })

  test('Negative Quantity param is reduced to zero', () => {
    const from = 0
    const quantity = -4
    expect(capitalize(alphabetLowerCase, {from, quantity})).not.toEqual(alphabetLowerCase)
    expect(capitalize(alphabetLowerCase, {from, quantity})).toEqual(alphabetUpperCase)
  })

});
