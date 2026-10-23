import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { Booking } from "../../booking/entities/booking.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Slot {
    @ApiProperty({ description: 'Unique identifier for the slot (UUID)', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ description: 'Title or name of the slot', example: 'General Consultation' })
    @Column()
    title: string;

    @ApiProperty({ description: 'Start time of the slot (timestamptz)', example: '2026-11-01T09:00:00.000Z' })
    @Column({ type: 'timestamptz' })
    startTime: Date;

    @ApiProperty({ description: 'End time of the slot (timestamptz)', example: '2026-11-01T10:00:00.000Z' })
    @Column({ type: 'timestamptz' })
    endTime: Date;

    @ApiProperty({ description: 'Total booking capacity for the slot', example: 5, default: 1 })
    @Column({
        default: 1
    })
    capacity: number;

    @ApiProperty({ description: 'Optimistic lock version', example: 1 })
    @VersionColumn()
    version: number;

    @ApiProperty({ description: 'Number of confirmed bookings', example: 0, default: 0 })
    @Column({
        default: 0
    })
    bookedCount: number;

    @OneToMany(() => Booking, booking => booking.slot)
    bookings: Booking[];

    @ApiProperty({ description: 'Creation timestamp', example: '2026-10-22T10:00:00.000Z' })
    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2026-10-22T10:00:00.000Z' })
    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

}
