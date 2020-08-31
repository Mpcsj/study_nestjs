import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

}