import {readFile, writeFile, mkdir, rename} from 'node:fs/promises';
import path from 'node:path';
import type {NewOrder, Order} from '../shared/types.js';

export function createOrderStore(filename: string) {
  let queue: Promise<unknown> = Promise.resolve();
  async function read(): Promise<Order[]> {
    try {
      const data: unknown = JSON.parse(await readFile(filename, 'utf8'));
      if (!Array.isArray(data)) {
        throw new Error('Invalid order database.');
      }
      return data as Order[];
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return [];
      }
      throw error;
    }
  }
  return {
    async list(userId: string): Promise<Order[]> {
      await queue;
      return (await read())
        .filter((order) => order.userId === userId)
        .reverse();
    },
    async add(data: NewOrder): Promise<Order> {
      const operation = queue.then(async () => {
        const orders = await read();
        const existing = orders.find(
          (order) =>
            order.userId === data.userId && order.requestId === data.requestId,
        );
        if (existing) {
          return existing;
        }
        const id =
          orders.reduce(
            (maximum, order) => Math.max(maximum, order.id),
            10000,
          ) + 1;
        const order: Order = {...data, id, createdAt: new Date().toISOString()};
        orders.push(order);
        await mkdir(path.dirname(filename), {recursive: true});
        await writeFile(
          `${filename}.tmp`,
          `${JSON.stringify(orders, null, 2)}\n`,
          'utf8',
        );
        await rename(`${filename}.tmp`, filename);
        return order;
      });
      queue = operation.catch(() => {});
      return operation;
    },
  };
}
