import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto{
    @IsOptional()
    @IsIn(Object.keys(TaskStatus))
    status:TaskStatus

    @IsOptional()
    @IsNotEmpty()
    search:string
}