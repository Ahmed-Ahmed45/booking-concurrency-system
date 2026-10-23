import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../utils/enum';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiPropertyOptional({
        enum: BookingStatus,
        enumName: 'BookingStatus',
        description: 'New booking status',
        example: BookingStatus.CANCELLED
    })
    @IsOptional()
    @IsEnum(BookingStatus)
    status?: BookingStatus;
}
