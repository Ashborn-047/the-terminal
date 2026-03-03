/* eslint-disable */
/* tslint:disable */
import {
    t as __t,
} from "spacetimedb";

export default __t.row({
    id: __t.u64().primaryKey(),
    title: __t.string(),
    description: __t.string(),
    xpReward: __t.u64().name("xp_reward"),
});
