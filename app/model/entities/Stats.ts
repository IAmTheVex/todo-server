import { ObjectType, Field } from "@zuu/owl";

@ObjectType()
export class Stats {
    @Field()
    public done: number;
    
    @Field()
    public remaining: number;
    
    @Field()
    public total: number;

    public constructor(total: number, done: number) {
        this.total = total;
        this.done = done;
        this.remaining = this.total - this.done;

        this.remaining = Math.max(this.remaining, 0);
    }
}