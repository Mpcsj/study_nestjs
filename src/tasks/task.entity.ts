import { BaseEntity,PrimaryGeneratedColumn, Entity, Column } from "typeorm"
// const {BaseEntity,PrimaryGeneratedColumn, Entity, Column} = require('typeorm')
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status:TaskStatus;
}