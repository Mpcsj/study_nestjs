import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, NotImplementedException, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {Task} from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { userInfo } from 'os';
const TAG = 'tasks.controller'
@Controller('tasks')
@UseGuards(AuthGuard()) // protegendo todas as chamadas desse endpoint pra precisar de token
export class TasksController {
    private logger = new Logger(TAG+'::TasksController')
    constructor(private tasksService:TasksService){}
    @Get()
    getTasks(
        @GetUser()user:User,
        @Query(ValidationPipe) filterDto:GetTasksFilterDto
        ):Promise<Task[]>{
        // if(!Object.entries(filterDto).length){
        //     return this.tasksService.getAllTasks()
        // }else{
        //     throw new NotImplementedException()
        // }
        this.logger.verbose(`getTasks::user:${JSON.stringify(user)}::filters:${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto,user)
    }
    @Get('/:id')
    getTaskById(
        @Param('id',ParseIntPipe) id:number,
        @GetUser() user:User
        ):Promise<Task>{
        console.log('id',id)
        let res = this.tasksService.getTaskById(id,user)
        // console.log('a retornar:',res)
        return res
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body()createTaskDto:CreateTaskDto,
        @GetUser() user:User
    ):Promise<Task>{
        this.logger.verbose(`createTasks::user:${JSON.stringify(user)}::createTaskDto:${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto,user)
    }

    @Delete('/:id')
    deleteTaskById(
        @GetUser() user:User,
        @Param('id',ParseIntPipe) id:number):Promise<void>{
        return this.tasksService.deleteTaskById(id,user)
    }

    // @Put('/:id')
    // updateTaskById(@Param('id') id:string,@Body() taskDto:CreateTaskDto):Task{
    //     return this.tasksService.updateTaskById(id,taskDto)
    // }

    @Patch(':id/status')
    updateStatus(
        @GetUser() user:User,
        @Param('id',ParseIntPipe) id:number,
        @Body('status',TaskStatusValidationPipe) status:TaskStatus):Promise<Task>{
        return this.tasksService.updateTaskStatus(id,status,user)
    }
}
