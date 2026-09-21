export function calculateExpression(expr) {
  if (typeof expr !== 'string') {
    throw new TypeError('Аргумент должен быть строкой');
  }

  const cleanExpr = expr.replace(/\s+/g, '');

  if (cleanExpr.length === 0) {
    throw new Error('Выражение не может быть пустым');
  }

  if (!/^[\d+\-*/().%]+$/.test(cleanExpr)) {
    throw new Error('Выражение содержит недопустимые символы');
  }

  try {
    const result = new Function(`return ${cleanExpr}`)();

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error('Результат не является числом');
    }

    return result;
  } catch (error) {
    throw new Error(`Ошибка вычисления: ${error.message}`, {cause: error});
  }
}
