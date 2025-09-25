export default interface Repository<T, K = string> {
    create(item: Partial<T>): Promise<T>;
    update(id: K, item: Partial<T>): Promise<T | null>;
    find(id: K): Promise<T | null>;
    exists(id: K): Promise<boolean>;
    findAll(): Promise<T[]>;
    delete(id: K): Promise<boolean>;

    findBy(query: Partial<Record<keyof T, unknown>>) : Promise<T[] | null>
    findOneBy(query: Partial<Record<keyof T, unknown>>) : Promise<T | null>
}