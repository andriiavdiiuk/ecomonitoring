export default interface Repository<T, K = string> {
    create(item: Partial<T>): Promise<T>;
    update(id: K, item: Partial<T>): Promise<T | null>;
    find(id: K): Promise<T | null>;
    exists(id: K): Promise<boolean>;
    findAll(): Promise<T[]>;
    delete(id: K): Promise<boolean>;
    count(query: Partial<{ [P in keyof T]: T[P] }>): Promise<number>;

    findBy(query: Partial<{ [P in keyof T]: T[P] }>) : Promise<T[]>
    findOneBy(query:Partial<{ [P in keyof T]: T[P] }>) : Promise<T | null>
    updateBy(query: Partial<{ [P in keyof T]: T[P] }>, item: Partial<T>): Promise<T | null>
    deleteBy(query: Partial<{ [P in keyof T]: T[P] }>): Promise<boolean>
}