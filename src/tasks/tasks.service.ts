import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { title } from 'process';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
const TAG = 'tasks.service'
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository
    ){}
    // private tasks:Task[] = []
    async getAllTasks():Promise<Task[]>{
        let res = await this.taskRepository.find()
        return res
    }
    async getTaskById(id:number,user:User):Promise<Task>{
        const found = await this.taskRepository.findOne({where:{id,userId:user.id}})
        if(!found){
            throw new NotFoundException(`Task with id ${id} not found`)
        }
        return found
    }
    async getTasks(filterDto:GetTasksFilterDto,user:User):Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto,user)
    }
    // getTasksWithFilters(filter:GetTasksFilterDto):Task[]{
    //     let res = this.getAllTasks()
    //     const {search,status}  = filter
    //     const hasData=(el=>el['description'].includes(search) || el['title'].includes(search))
    //     if(status){
    //         res = res.filter(el=>{
    //             let includeQuery = true
    //             if(search){
    //                 includeQuery = false
    //                 if(hasData(el)){
    //                     includeQuery = true
    //                 }
    //             }
    //             return includeQuery && el['status'] === status
    //         })
    //     }else{
    //         res = res.filter(el=>hasData(el))
    //     }
    //     return res
    // }
    async createTask(
        createTaskDto:CreateTaskDto,
        user:User
        ):Promise<Task>{
        const task = await this.taskRepository.createTask(createTaskDto,user)
        return task
    }
    async deleteTaskById(id:number,user:User):Promise<void>{
        console.log(TAG,`deleteTaskById::id:${id}::user:${JSON.stringify(user)}`)
        // let res = await this.getTaskById(id)
        let res = await this.taskRepository.delete({id,userId:user.id})
        if(!res.affected){
            throw new NotFoundException(`Task with id ${id} not found`)
        }
        // return res
    }

    // updateTaskById(id:string,taskDto:CreateTaskDto):Task{
    //     console.log(TAG,'::updateTaskById::id:',id,'::taskDto:',taskDto)
    //     let res = this.getTaskById(id)
    //     if(res){
    //         res.title= taskDto.title
    //         res.description= taskDto.description
    //     }
    //     return res
    // }
    async updateTaskStatus(id:number,status:TaskStatus,user:User):Promise<Task>{
        let res = await this.getTaskById(id,user)
        await this.taskRepository.update({id:id},{status})
        res.status = status
        // await res.save()
        return res
    }
}
