import { Membership } from "../providers/DataProvider";

export function membershipIsActive(membership: Membership): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(membership.start);
    expirationDate.setDate(expirationDate.getDate() + membership.duration);

    const exceededLimit = membership.classes.reduce((totalVisits, membershipClass) => {
        return totalVisits + membershipClass.visits.length;
    }, 0) >= membership.limit;

    return currentDate < expirationDate && !exceededLimit;
}

export function getExpirationDate(membership: Membership): Date {
    const expirationDate = new Date(membership.start);
    expirationDate.setDate(expirationDate.getDate() + membership.duration);
    return expirationDate;
}
