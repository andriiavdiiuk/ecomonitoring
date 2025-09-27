import {Model} from 'mongoose';
import Repository from "backend/dal/repositories/Repository";

export abstract class MongoCrudRepository<T, K = string> implements Repository<T, K> {
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        return await this.model.create(item);
    }

    async update(id: K, item: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate({id}, item, {new: true}).exec();
    }

    async find(id: K): Promise<T | null> {
        return await this.model.findOne({id}).exec();
    }

    async exists(id: K): Promise<boolean> {
        const result = await this.model.exists({id}).exec();
        return !!result;
    }

    async findAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async delete(id: K): Promise<boolean> {
        const res = await this.model.deleteOne({id}).exec();
        return res.deletedCount === 1;
    }

    async count(query: Partial<{ [P in keyof T]: T[P] }>): Promise<number> {
        return await this.model.countDocuments(query).exec();
    }

    async findBy(query: Partial<{ [P in keyof T]: T[P] }>): Promise<T[]> {
        return await this.model.findOne(query as never).exec() as T[];
    }

    async findOneBy(query: Partial<{ [P in keyof T]: T[P] }>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    async updateBy(query: Partial<{ [P in keyof T]: T[P] }>, item: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(query, item).exec();
    }

    async deleteBy(query: Partial<{ [P in keyof T]: T[P] }>): Promise<boolean> {
        const res = await this.model.deleteOne(query).exec();
        return res.deletedCount === 1;
    }
}
