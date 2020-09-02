import { Controller, Get, Post, Body, Param, Delete, Put, Patch,Query, UsePipes, ValidationPipe, ParseIntPipe, NotImplementedException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {Task} from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
@Controller('tasks')
@UseGuards(AuthGuard()) // protegendo todas as chamadas desse endpoint pra precisar de token
export class TasksController {
    constructor(private tasksService:TasksService){}
    @Get()
    getTasks(@Query(ValidationPipe) filterDto:GetTasksFilterDto):Promise<Task[]>{
        // if(!Object.entries(filterDto).length){
        //     return this.tasksService.getAllTasks()
        // }else{
        //     throw new NotImplementedException()
        // }
        return this.tasksService.getTasks(filterDto)
    }
    @Get('/:id')
    getTaskById(@Param('id',ParseIntPipe) id:number):Promise<Task>{
        console.log('id',id)
        let res = this.tasksService.getTaskById(id)
        // console.log('a retornar:',res)
        return res
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body()createTaskDto:CreateTaskDto
    ):Promise<Task>{
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id',ParseIntPipe) id:number):Promise<void>{
        return this.tasksService.deleteTaskById(id)
    }

    // @Put('/:id')
    // updateTaskById(@Param('id') id:string,@Body() taskDto:CreateTaskDto):Task{
    //     return this.tasksService.updateTaskById(id,taskDto)
    // }

    @Patch(':id/status')
    updateStatus(
        @Param('id',ParseIntPipe) id:number,
        @Body('status',TaskStatusValidationPipe) status:TaskStatus):Promise<Task>{
        return this.tasksService.updateTaskStatus(id,status)
    }
}
