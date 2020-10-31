import {Test} from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
const mockUser = {
    username:'Test user',
    id:123
}
const mockTaskRepository = ()=>({
    getTasks:jest.fn(),
    findOne:jest.fn(),
    createTask:jest.fn(),
    delete:jest.fn(),
    update:jest.fn()
})
describe('TasksService',()=>{
    let tasksService;
    let tasksRepository;

    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            providers:[
                TasksService,
                {provide:TaskRepository,useFactory:mockTaskRepository}
            ]
        }).compile()

        tasksService = await module.get<TasksService>(TasksService)
        tasksRepository = await module.get<TaskRepository>(TaskRepository)
    })
    describe('getTasks',()=>{
        it('gets all tasks from the repository',async()=>{
            tasksRepository.getTasks.mockResolvedValue('Some value')

            expect(tasksRepository.getTasks).not.toHaveBeenCalled()
            const filters:GetTasksFilterDto ={// fake data
                status:TaskStatus.IN_PROGRESS,
                search:'Anything'
            }
            // call tasks service
            const result = await tasksService.getTasks(filters,mockUser )
            // expect taskRepository TO HAVE BEEN CALLED
            expect(tasksRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('Some value')
        })
    })
    // cada describe, eu testo uma função.
    describe('getTaskById',()=>{
        it('call taskRepository.findOne() and successfully retrieve and return the task',async()=>{
            const mockTask = {
                title:'Test task',
                description:'Test desc'
            }
            tasksRepository.findOne.mockResolvedValue(mockTask)
            const result = await tasksService.getTaskById(1,mockUser)
            expect(result).toEqual(mockTask)

            expect(tasksRepository.findOne).toHaveBeenCalledWith({
                where:{
                    id:1,
                    userId:mockUser.id
                }
            })
        })
        it('throws an error when task is not found',()=>{
            tasksRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById(1,mockUser)).rejects.toThrow(NotFoundException)
        })
    })
    describe('createTask',()=>{
        const createTaskDto:CreateTaskDto = {
            description:'Test description',
            title:'Test title'
        }
        const mockTask= {
            ...createTaskDto,
            user:mockUser,
            status:TaskStatus.OPEN
        }
        it('resolves when create a new task',async()=>{
            expect(tasksRepository.createTask).not.toHaveBeenCalled()
            tasksRepository.createTask.mockResolvedValue(mockTask)
            let result = await tasksService.createTask(createTaskDto,mockUser)
            expect(tasksRepository.createTask).toHaveBeenCalledWith(createTaskDto,mockUser)
            expect(result).toEqual(mockTask)
        })
    })

    describe('deleteTask',()=>{
        it('calls tasksRepository.deleteTask() to delete a task',async()=>{
            tasksRepository.delete.mockResolvedValue({affected:1})
            expect(tasksRepository.delete).not.toHaveBeenCalled()
            await tasksService.deleteTaskById(1,mockUser)
            expect(tasksRepository.delete).toHaveBeenCalledWith({
                id:1,
                userId:mockUser.id
            })
        })
        it('throws an error as task could not be found',()=>{
            tasksRepository.delete.mockResolvedValue({affected:0})
            expect(tasksRepository.delete).not.toHaveBeenCalled()
            expect(tasksService.deleteTaskById(1,mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateTaskById',()=>{
        const createTaskDto:CreateTaskDto = {
            description:'Test description',
            title:'Test title'
        }
        const mockTask= {
            ...createTaskDto,
            user:mockUser,
            status:TaskStatus.OPEN,
            id:123
        }
        it('update a taskById',async()=>{
            tasksRepository.findOne.mockResolvedValue(mockTask)
            let newStatus = TaskStatus.DONE
            const mockTaskWithNewStatus= {
                ...createTaskDto,
                user:mockUser,
                status:newStatus,
                id:123
            }   
            let res = await tasksService.updateTaskStatus(mockTask['id'],newStatus,mockUser)
            expect(res).toEqual(mockTaskWithNewStatus)
            expect(res['status']).toEqual(newStatus)
        })
        it('throws an error for id not being found',async()=>{
            tasksRepository.findOne.mockResolvedValue(null)
            let newStatus = TaskStatus.DONE
            expect(tasksService.updateTaskStatus(mockTask['id'],newStatus,mockUser)).rejects.toThrow()
        })
    })  
})