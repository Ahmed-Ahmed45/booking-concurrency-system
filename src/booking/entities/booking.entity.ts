import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Slot } from "../../slots/entities/slot.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { BookingStatus } from "../../utils/enum";

@Entity()
@Unique(["slot", "userId"]) // Ensure that a user can only book a specific slot once
export class Booking {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.CONFIRMED
    })
    status: BookingStatus;

    @ManyToOne(() => Slot, slot => slot.bookings)
    slot: Slot; // Assuming slot is a string identifier for the booking slot

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

}

