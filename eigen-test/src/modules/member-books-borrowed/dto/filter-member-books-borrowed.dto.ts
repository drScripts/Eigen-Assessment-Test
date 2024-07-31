import { ApiProperty } from "@nestjs/swagger";

export class FilterMemberBooksBorrowed {
    @ApiProperty()
    returnedAt?: Date | null
}