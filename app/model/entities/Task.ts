import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from '@zuu/ferret';
import { ObjectType, Field } from '@zuu/owl';
import { Lazy } from '../../packages/async/Lazy';
import { User } from './User';

@ObjectType()
@Entity()
export class Task extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Field()
    @CreateDateColumn()
    public created: Date;

    @Field()
    @Column()
    public text: string;

    @Field()
    @Column({ default: false })
    public state: boolean;

    @Field(type => User)
    @ManyToOne(type => User, user => user.tasks, {lazy: true})
    public user: Lazy<User>;
}