import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {

    @ApiProperty({ description: 'UUID of the slot to reserve', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    slotId: string;

    @ApiProperty({ description: 'User identifier making the booking', example: 'user_456' })
    @IsString()
    @IsNotEmpty()
    userId: string; 
}
