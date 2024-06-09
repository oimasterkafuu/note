import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Note } from './notes';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    registerTime: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    lastLoginTime: Date;

    @OneToMany(() => Note, note => note.user)
    notes: Note[];
}
