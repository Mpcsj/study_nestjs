import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";
import { type } from "os";
const TAG = 'tasks-status-validation.pipe'
export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatuses = [
        ...Object.keys(TaskStatus)
    ]
    transform(value:any,metadata:ArgumentMetadata){
        console.log(TAG,'::value:',value)
        console.log(TAG,'::metadata:',metadata)
        if(!this.isValidStatus(value)){
            throw new BadRequestException(`status ${value} not valid!`)
        }
        return value
    }
    private isValidStatus(status:any):boolean{
        if(status && typeof status === 'string'){
            return this.allowedStatuses.includes(status.toUpperCase())
        }else{
            return false
        }
    }

}