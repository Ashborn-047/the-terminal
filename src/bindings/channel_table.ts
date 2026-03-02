/* eslint-disable */
/* tslint:disable */
import {
    t as __t,
} from "spacetimedb";

export default __t.row({
    name: __t.string().primaryKey(),
    description: __t.option(__t.string()),
    createdBy: __t.identity().name("created_by"),
    isPrivate: __t.bool().name("is_private"),
    members: __t.array(__t.identity()),
});
