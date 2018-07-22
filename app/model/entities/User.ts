import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, OneToMany } from '@zuu/ferret';
import { Field, ID, ObjectType, Ctx } from "@zuu/owl";
import { Lazy } from '../../packages/async/Lazy';
import { Task } from './Task';
import { Stats } from './Stats';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    public id: string;

    @Field()
    @CreateDateColumn()
    public created: Date;

    @Field()
    @Column({
        unique: true
    })
    @Index()
    public email: string;

    @Column()
    public password: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public fullName: string;

    @Field(type => [Task])
    @OneToMany(type => Task, task => task.user, {lazy: true})
    public tasks: Lazy<Task[]>;

    @Field(type => Stats)
    public async stats(
        @Ctx("user") user: User
    ): Promise<Stats> {
        let allCount = await Task.count({ user });
        let doneCount = await Task.count({ state: true, user });
        
        return new Stats(allCount, doneCount);
    }

    public constructor(email: string, password: string) {
        super();
        
        this.email = email;
        this.password = password;
    }
}