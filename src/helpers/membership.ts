import { Membership } from "../providers/DataProvider";

export function membershipIsActive(membership: Membership): boolean {
    return new Date(membership.start) > new Date(Date.now());
}
