import {Test} from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
const mockUser = {
    username:'Test user'
}
const mockTaskRepository = ()=>({
    getTasks:jest.fn()
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
})