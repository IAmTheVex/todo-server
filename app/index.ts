import { AuthedGraphQLController, Bootstrap, ZuuOptions } from "@zuu/bootstrap";
import { Action } from '@zuu/mink';
import { Debugger, Runtime } from "@zuu/vet";
import { AuthController } from './controllers/AuthController';
import { ResponseFormatter } from './interceptors/ResponseFormatter';
import { ListeningEventListener } from './listeners/ListeningEventListener';
import { ResponseTime } from "./middlewares/ResponseTime";
import { User } from './model/entities/User';
import { AuthContextChecker } from './packages/context/AuthContextChecker';
import { HeadersContextFiller } from './packages/context/HeadersContextFiller';
import { Timer } from './packages/timer/Timer';
import { MeResolver } from './resolvers/MeResolver';
import { TaskResolver } from './resolvers/TaskResolver';

Debugger.deafults();

let tag = Debugger.tag("app-index");

let options: ZuuOptions = {
    server: {
        port: parseInt(process.env["PORT"]) || 4100
    },
    currentUserChecker: async (action: Action): Promise<User> => {
        let token = action.request.headers["x-access-token"];
        return await AuthContextChecker.check(token);
    },
    graph: {
        contextFiller: async (user: User, headers: any): Promise<any> =>{
            return await HeadersContextFiller.fill(user, headers);
        }
    },
    listeners: [
        new ListeningEventListener
    ],
    middlewares: [
        ResponseTime
    ],
    interceptors: [
        ResponseFormatter
    ],
    controllers: [
        AuthController,
        AuthedGraphQLController
    ],
    resolvers: [
        MeResolver,
        TaskResolver
    ],
    cors: true
};

let timer = new Timer().reset();
Runtime.scoped(null, async _ => {
    Debugger.log(tag`Initialization began!`);
    let { app } = await Bootstrap.scope(options).run();
    return (typeof app != "undefined" && app != null);
})
.then(async result => {
    Debugger.log(tag`Initialization succeeded! Took ${timer.stop().diff()}ms!`);
})
.catch(Debugger.error);