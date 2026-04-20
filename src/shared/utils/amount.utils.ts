export function convertNumberToVietnameseWords(amount: number): string {
  if (amount === 0) return 'Không đồng';

  const numberWords = [
    'không',
    'một',
    'hai',
    'ba',
    'bốn',
    'năm',
    'sáu',
    'bảy',
    'tám',
    'chín',
  ];
  const unitWords = [
    '',
    'nghìn',
    'triệu',
    'tỷ',
    'nghìn tỷ',
    'triệu tỷ',
    'tỷ tỷ',
  ];

  function readThreeDigits(number: number): string {
    const hundreds = Math.floor(number / 100);
    const tens = Math.floor((number % 100) / 10);
    const units = number % 10;
    let str = '';

    if (hundreds > 0) {
      str += numberWords[hundreds] + ' trăm';
    }

    if (tens === 0 && units > 0) {
      if (hundreds > 0) {
        str += ' linh ' + numberWords[units];
      } else {
        str += numberWords[units];
      }
    } else if (tens === 1) {
      str += ' mười';
      if (units > 0) {
        str +=
          ' ' +
          (units === 1
            ? 'một'
            : units === 4
              ? 'bốn'
              : units === 5
                ? 'lăm'
                : numberWords[units]);
      }
    } else if (tens > 1) {
      str += ' ' + numberWords[tens] + ' mươi';
      if (units > 0) {
        str +=
          ' ' +
          (units === 1
            ? 'mốt'
            : units === 4
              ? 'tư'
              : units === 5
                ? 'lăm'
                : numberWords[units]);
      }
    }

    return str.trim();
  }

  const parts: string[] = [];
  let unitIndex = 0;
  let temp = amount;

  while (temp > 0) {
    const threeDigits = temp % 1000;

    if (threeDigits > 0) {
      const str = readThreeDigits(threeDigits);
      if (str) {
        parts.unshift(
          str + (unitWords[unitIndex] ? ' ' + unitWords[unitIndex] : ''),
        );
      }
    }

    temp = Math.floor(temp / 1000);
    unitIndex++;
  }

  let result = parts.join(' ').replace(/\s+/g, ' ');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result ? result + ' đồng.' : '';
}
