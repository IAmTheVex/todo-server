import { Resolver, Query, Ctx, Arg, Mutation } from "@zuu/owl";
import { Task } from '../model/entities/Task';
import { User } from '../model/entities/User';
import { RequiredResourceNotProvidedError } from "../errors/RequiredResourceNotProvidedError";
import { Stats } from "../model/entities/Stats";

@Resolver()
export class TaskResolver {

    @Query(returns => Task)
    public async task(
        @Ctx("task") task: Task
    ): Promise<Task> {
        if(!task) throw new RequiredResourceNotProvidedError("task");

        return task;
    }

    @Query(returns => Stats)
    public async stats(
        @Ctx("user") user: User
    ): Promise<Stats> {
        return await user.stats(user);
    }

    @Query(returns => [Task])
    public async tasks(
        @Ctx("user") user: User
    ): Promise<Task[]> {
        return (await user.tasks) || [];
    }

    @Mutation(returns => Task)
    public async createTask(
        @Ctx("user") user: User,
        @Arg("text") text: string
    ): Promise<Task> {
        let task = new Task();
        task.text = text;
        task.user = user;
        await task.save();
        
        await user.save();

        return task;
    }

    @Mutation(returns => Boolean)
    public async removeTask(
        @Ctx("task") task: Task
    ): Promise<boolean> {
        if(!task) throw new RequiredResourceNotProvidedError("task");

        await task.remove();
        return true;
    }

    @Mutation(returns => Task)
    public async editTask(
        @Ctx("task") task: Task,
        @Arg("text") text: string
    ): Promise<Task> {
        if(!task) throw new RequiredResourceNotProvidedError("task");
        
        task.text = text;
        await task.save();
        
        return task;
    }

    @Mutation(returns => Task)
    public async markTask(
        @Ctx("task") task: Task,
        @Arg("state") state: boolean
    ): Promise<Task> {
        if(!task) throw new RequiredResourceNotProvidedError("task");

        task.state = state;
        await task.save();

        return task;
    }
}