import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { title } from 'process';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
const TAG = 'tasks.service'
@Injectable()
export class TasksService {
    private tasks:Task[] = []
    getAllTasks():Task[]{
        return this.tasks
    }
    getTasksWithFilters(filter:GetTasksFilterDto):Task[]{
        let res = this.getAllTasks()
        const {search,status}  = filter
        const hasData=(el=>el['description'].includes(search) || el['title'].includes(search))
        if(status){
            res = res.filter(el=>{
                let includeQuery = true
                if(search){
                    includeQuery = false
                    if(hasData(el)){
                        includeQuery = true
                    }
                }
                return includeQuery && el['status'] === status
            })
        }else{
            res = res.filter(el=>hasData(el))
        }
        return res
    }
    getTaskById(id:string):Task{
        const res  = this.tasks.find(el=>el['id']===id)
        if(!res){
            throw new NotFoundException(`Task with id ${id} not found`)
        }
        return res
    }
    createTask(createTaskDto:CreateTaskDto):Task{
        const {title,description} = createTaskDto
        const task:Task = {
            title,
            description,
            status:TaskStatus.OPEN,
            id:uuid.v4()
        }
        this.tasks.push(task)
        return task
    }

    deleteTaskById(id:string):Task{
        this.getTaskById(id)
        let res = null
        this.tasks = this.tasks.filter(el=>{
            if(el['id']===id){
                res = el
            }
            return el['id']!==id
        })
        return res
    }

    updateTaskById(id:string,taskDto:CreateTaskDto):Task{
        console.log(TAG,'::updateTaskById::id:',id,'::taskDto:',taskDto)
        let res = this.getTaskById(id)
        if(res){
            res.title= taskDto.title
            res.description= taskDto.description
        }
        return res
    }
    updateTaskStatus(id:string,status:TaskStatus):Task{
        let res = this.getTaskById(id)
        if(res){
            res.status = status
        }
        return res
    }
}
