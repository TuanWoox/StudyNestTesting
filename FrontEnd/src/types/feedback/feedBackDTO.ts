import { EFeedBackStatus } from "@/utils/enums/EFeedBackStatus";
import { BaseEntity } from "../common/baseEntity";

export interface FeedBackDTO extends BaseEntity<string> {
    rating: number;
    category: string;
    description: string;
    userId: string;
    status: EFeedBackStatus;
    rejectedReason?: string;
}