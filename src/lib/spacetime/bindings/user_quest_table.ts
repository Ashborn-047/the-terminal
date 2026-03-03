/* eslint-disable */
/* tslint:disable */
import {
    t as __t,
} from "spacetimedb";

export default __t.row({
    identity: __t.identity().primaryKey(),
    activeQuestIds: __t.array(__t.u64()).name("active_quest_ids"),
    completedQuestIds: __t.array(__t.u64()).name("completed_quest_ids"),
    lastQuestRefreshAt: __t.timestamp().name("last_quest_refresh_at"),
});
