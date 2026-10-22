import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { Booking } from "../../booking/entities/booking.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";

@Entity()
export class Slot {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ type: 'timestamptz' })
    startTime: Date;

    @Column({ type: 'timestamptz' })
    endTime: Date;

    @Column({
        default: 1
    })
    capacity: number;

    @VersionColumn()
    version: number;

    @Column({
        default: 0
    })
    bookedCount: number;

    @OneToMany(() => Booking, booking => booking.slot)
    bookings: Booking[]; // This will hold the bookings associated with this slot

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

}
