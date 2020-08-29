import { Controller, Get, Post, Body, Param, Delete, Put, Patch,Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto:GetTasksFilterDto):Task[]{
        if(Object.entries(filterDto).length){
            return this.tasksService.getAllTasks()
        }else{
            return this.tasksService.getTasksWithFilters(filterDto)
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string):Task{
        console.log('id',id)
        let res = this.tasksService.getTaskById(id)
        console.log('a retornar:',res)
        return res
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body()createTaskDto:CreateTaskDto
    ):Task{
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string):Task{
        return this.tasksService.deleteTaskById(id)
    }

    @Put('/:id')
    updateTaskById(@Param('id') id:string,@Body() taskDto:CreateTaskDto):Task{
        return this.tasksService.updateTaskById(id,taskDto)
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id:string,
        @Body('status',TaskStatusValidationPipe) status:TaskStatus):Task{
        return this.tasksService.updateTaskStatus(id,status)
    }
}
