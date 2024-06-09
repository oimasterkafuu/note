import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './users';

@Entity()
export class Note {
    @PrimaryColumn({
        length: 8,
        unique: true
    })
    id: string;

    @Column({
        type: 'text'
    })
    content: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.notes)
    user: User;
}
