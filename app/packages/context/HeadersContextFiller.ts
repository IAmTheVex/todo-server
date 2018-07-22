import { UnresolvableResourceAccessError } from '../../errors/UnresolvableResourceAccessError';
import { UnauthorizedResourceAccessAttemptError } from "../../errors/UnauthorizedResourceAccessAttemptError";
import { User } from "../../model/entities/User";
import { Context } from "./Context";
import { Task } from "../../model/entities/Task";

export class HeadersContextFiller {
    public static async fill(user: User, headers: any): Promise<Object> {
        let context: Context = { user };
        
        let taskId = headers["x-resource-task"];

        if(typeof taskId != "undefined") {
            let task = await Task.findOne(taskId);
            if(!task) throw new UnresolvableResourceAccessError("task", taskId);
            if((await task.user).id != user.id) throw new UnauthorizedResourceAccessAttemptError("task", taskId);
            context.task = task;
        }

        return context;
    }
}