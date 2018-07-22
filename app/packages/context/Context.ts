import { User } from "../../model/entities/User";
import { Task } from '../../model/entities/Task';

export interface Context { 
    user?: User;
    task?: Task;
};