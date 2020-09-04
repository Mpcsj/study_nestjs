import { Repository, EntityRepository } from "typeorm"
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository')
    async getTasks(filterDto:GetTasksFilterDto,user:User):Promise<Task[]>{
        const {search,status} = filterDto
        const query = this.createQueryBuilder('task')
        query.where('task.userId= :userId',{userId:user.id})
        if(status){
            query.andWhere('task.status= :status',{status})
        }
        if(search){
            query.andWhere('task.title like :search or task.description like :search',{search:`%${search}%`})
        }
        // query.andWhere('task.user=:user',{user})
        try {
            const res = await query.getMany()
            return res
        } catch (error) {
            this.logger.error(`Erro ao fazer consulta de tarefas no banco:${JSON.stringify(error)}::user:${JSON.stringify(user)}`,error.stack)
            throw new InternalServerErrorException(error)
        }
    }
    async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task>{
        const {title,description} = createTaskDto
        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user  // pq senao, o user sera exposto pela api
        return task
    }
}