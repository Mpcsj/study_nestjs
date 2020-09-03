import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';
import { type } from "os";
@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number
    @Column({unique:true})
    username:string
    @Column()
    password:string
    @Column()
    salt:string

    @OneToMany(type=>Task,task=>task.user,{eager:true})
    tasks:Task[]
    validatePassword=async(password:string):Promise<boolean>=>{
        const hash = await bcrypt.hash(password,this.salt)
        return hash === this.password
    }
}