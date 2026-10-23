import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Slot } from "../../slots/entities/slot.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { BookingStatus } from "../../utils/enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(["slot", "userId"]) // Ensure that a user can only book a specific slot once
export class Booking {

    @ApiProperty({ description: 'Unique identifier for the booking (UUID)', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ description: 'User identifier who made the reservation', example: 'user_456' })
    @Column()
    userId: string;

    @ApiProperty({ enum: BookingStatus, enumName: 'BookingStatus', description: 'Current status of the booking', example: BookingStatus.CONFIRMED })
    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.CONFIRMED
    })
    status: BookingStatus;

    @ApiProperty({ type: () => Slot, description: 'The booked slot details' })
    @ManyToOne(() => Slot, slot => slot.bookings)
    slot: Slot;

    @ApiProperty({ description: 'Creation timestamp', example: '2026-10-22T10:00:00.000Z' })
    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2026-10-22T10:00:00.000Z' })
    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

}

