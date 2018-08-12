import differ from 'deep-diff';

// https://github.com/flitbit/diff#differences
const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
  },
};

export function style(kind) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case 'E':
      return [path.join('.'), lhs, '→', rhs];
    case 'N':
      return [path.join('.'), rhs];
    case 'D':
      return [path.join('.')];
    case 'A':
      return [`${path.join('.')}[${index}]`, item];
    default:
      return [];
  }
}

export default function diffLogger(prevState, newState, logger, isCollapsed) {
  const diff = differ(prevState, newState);

  try {
    if (isCollapsed) {
      logger.send('groupCollapsed', 'diff');
    } else {
      logger.send('group', 'diff');
    }
  } catch (e) {
    logger.info('diff');
  }

  if (diff) {
    diff.forEach((elem) => {
      const { kind } = elem;
      const output = render(elem);

      logger.info(`%c ${dictionary[kind].text}`, style(kind), ...output);
    });
  } else {
    logger.info('—— no diff ——');
  }

  try {
    logger.send('groupEnd');
  } catch (e) {
    logger.info('—— diff end —— ');
  }
}
