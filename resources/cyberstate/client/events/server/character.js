import alt from 'alt';
import game from 'natives';

function wait(ms) {
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

const player = alt.Player.local
let mainMenuIndex = 0;
let sceneMenuIndex = 0;
let animMenuIndex = 0;
alt.keyDownIsAtive = false;
player.throwAttachedObject = null;

var animationInfo = [{
        dict: "anim@mp_player_intcelebrationfemale@air_guitar",
        name: "air_guitar",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@air_shagging",
        name: "air_shagging",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@air_synth",
        name: "air_synth",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@blow_kiss",
        name: "blow_kiss",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@bro_love",
        name: "bro_love",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@chicken_taunt",
        name: "chicken_taunt",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@dj",
        name: "dj",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@face_palm",
        name: "face_palm",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@finger",
        name: "finger",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@finger_kiss",
        name: "finger_kiss",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@jazz_hands",
        name: "jazz_hands",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@knuckle_crunch",
        name: "knuckle_crunch",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@no_way",
        name: "no_way",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@nose_pick",
        name: "nose_pick",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@peace",
        name: "peace",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@raining_cash",
        name: "raining_cash",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@slow_clap",
        name: "slow_clap",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@chumb_on_ears",
        name: "thumb_on_ears",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@thumbs_up",
        name: "thumbs_up",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@v_sign",
        name: "v_sign",
        speed: 8,
        flag: 0
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@you_loco",
        name: "you_loco",
        speed: 8,
        flag: 0
    },
    {
        dict: "rcmnigel1bnmt_1b",
        name: "dance_loop_tyler",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@black_madonna_entourage@",
        name: "hi_dance_facedj_09_v2_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v1_male^2",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v1_male^1",
        speed: 8,
        flag: 1
    },
    {

        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_13_v1_male^4",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_17_v1_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_17_v1_male^6",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_17_v1_male^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "mi_dance_facedj_17_v1_male^1",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@lap_dance@ld_girl_a_song_a_p1",
        name: "ld_girl_a_song_a_p1_f",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@lap_dance_2g@ld_2g_p1",
        name: "ld_2g_p1_s2",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@lap_dance_2g@ld_2g_p2",
        name: "ld_2g_p2_s2",
        speed: 8,
        flag: 1
    },
    {
        dict: "mp_am_stripper",
        name: "lap_dance_girl",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@pole_dance@pole_dance1",
        name: "pd_dance_01",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@pole_dance@pole_dance2",
        name: "pd_dance_02",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@pole_dance@pole_dance3",
        name: "pd_dance_03",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@private_dance@part1",
        name: "priv_dance_p1",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@private_dance@part2",
        name: "priv_dance_p2",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip_club@private_dance@part3",
        name: "priv_dance_p3",
        speed: 8,
        flag: 1
    },
    {
        dict: "misschinese2_crystalmazemcs1_cs",
        name: "dance_loop_tao",
        speed: 8,
        flag: 1
    },
    {
        dict: "oddjobs@assassinate@multi@yachttarget@lapdance",
        name: "yacht_ld_f",
        speed: 8,
        flag: 1
    },
    {
        dict: "special_ped@mountain_dancer@monologue_3@monologue_3a",
        name: "mnt_dnc_buttwag",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@peds@",
        name: "amb_world_human_partying_female_partying_beer_base",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_podium@",
        name: "danceidle_mi_15_robot_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_podium@",
        name: "danceidle_mi_15_shimmy_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_podium@",
        name: "danceidle_hi_11_buttwiggle_f_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_podium@",
        name: "danceidle_hi_11_turnaround_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_podium@",
        name: "danceidle_hi_17_spiderman_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v1_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_13_v2_female^1",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_13_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_15_v2_female^1",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_15_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "li_dance_facedj_13_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "li_dance_facedj_13_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "mi_dance_facedj_09_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "mi_dance_facedj_11_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "mi_dance_facedj_13_v2_female^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "mi_dance_facedj_15_v1_female^1",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_09_v1_male^2",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_09_v1_male^4",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_09_v1_male^6",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v1_male^4",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v2_male^1",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_11_v2_male^4",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_13_v2_male^3",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_13_v2_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_15_v1_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_15_v2_male^2",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_15_v2_male^6",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_17_v2_male^4",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "hi_dance_facedj_17_v2_male^6",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@crowddance_facedj@",
        name: "li_dance_facedj_13_v1_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@podium_dancers@",
        name: "hi_dance_facedj_17_v2_female^2",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@dancers@podium_dancers@",
        name: "hi_dance_facedj_17_v2_male^5",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@lazlow@hi_dancefloor@",
        name: "crowddance_hi_06_base_laz",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_a@",
        name: "high_center_down",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_a@",
        name: "low_center_down",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_a@",
        name: "low_right",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_b@",
        name: "high_center",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_b@",
        name: "med_center_down",
        speed: 8,
        flag: 1
    },
    {
        dict: "missfbi3_sniping",
        name: "dance_m_default",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@banging_tunes",
        name: "banging_tunes",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@cats_cradle",
        name: "cats_cradle",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@dj",
        name: "dj",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@heart_pumping",
        name: "heart_pumping",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@oh_snap",
        name: "oh_snap",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@raise_the_roof",
        name: "raise_the_roof",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@salsa_roll",
        name: "salsa_roll",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@mp_player_intcelebrationfemale@uncle_disco",
        name: "uncle_disco",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_7@idle_a",
        name: "idle_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@jimmy@doorknock@",
        name: "knockdoor_idle",
        speed: 8,
        flag: 0
    },
    {
        dict: "reaction@male_stand@big_variations@a",
        name: "react_big_variations_a",
        speed: 8,
        flag: 0
    },
    {
        dict: "reaction@shake_it_off@",
        name: "dustoff",
        speed: 8,
        flag: 0
    },
    {
        dict: "timetable@floyd@calling",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmnigel3",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmnigel1a",
        name: "idle_c_2",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmminute2",
        name: "handsup",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmme_tracey1",
        name: "nervous_loop",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmbarry",
        name: "m_cower_01",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmbarry",
        name: "bar_1_teleport_mic",
        speed: 8,
        flag: 1
    },
    {
        dict: "misscarsteal2peeing",
        name: "peeing_loop",
        speed: 8,
        flag: 1
    },
    {
        dict: "random@street_race",
        name: "grid_girl_race_start",
        speed: 8,
        flag: 0
    },
    {
        dict: "random@prisoner_lift",
        name: "arms_waving",
        speed: 8,
        flag: 1
    },
    {
        dict: "random@burial",
        name: "b_burial",
        speed: 8,
        flag: 1
    },
    {
        dict: "pro_mcs_7_concat-0",
        name: "cs_priest_dual-0",
        speed: 8,
        flag: 1
    },
    {
        dict: "mini@strip@lap_dance@ld_girl_a_invite",
        name: "ld_girl_a_invite",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@move_hostages@male",
        name: "male_idle",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@heists@ornate_bank@hostages@cashier_b",
        name: "flinch_loop_underfire",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@heists@ornate_bank@hostages@hit",
        name: "hit_loop_ped_b",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@heists@ornate_bank@hostages@hit",
        name: "hit_loop_ped_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "anim@heists@ornate_bank@ig_4_grab_gold",
        name: "idle_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_b",
        name: "idle_d",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_b",
        name: "idle_e",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_b",
        name: "idle_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_a",
        name: "idle_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_a",
        name: "idle_b",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_5@idle_a",
        name: "idle_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmfanatic1maryann_strechidle_b",
        name: "idle_e",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_yoga@female@base",
        name: "base_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_yoga@female@base",
        name: "base_b",
        speed: 8,
        flag: 1
    },
    {
        dict: "amb@world_human_yoga@female@base",
        name: "base_c",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@denice@ig_1",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmtmom_2leadinout",
        name: "tmom_2_leadout_loop",
        speed: 8,
        flag: 1
    },
    {
        dict: "missfbi3_sniping",
        name: "prone_dave",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@trevor@on_the_toilet",
        name: "trevonlav_backedup",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@tracy@ig_2@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@ron@ig_3_couch",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@reunited@ig_10",
        name: "base_amanda",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@amanda@ig_12",
        name: "amanda_base",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcm_barry3",
        name: "barry_3_sit_loop",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@ron@ig_1",
        name: "ig_1_idle_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@jimmy@ig_5@base",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@reunited@ig_6",
        name: "base_amanda",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@mime@01_gc",
        name: "base",
        speed: 8,
        flag: 1
    },
    {
        dict: "re@construction",
        name: "out_of_breath",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@amanda@ig_4",
        name: "ig_4_base",
        speed: 8,
        flag: 1
    },
    {
        dict: "timetable@trevor@skull_loving_bear",
        name: "skull_loving_bear",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmpaparazzo_2",
        name: "shag_action_a",
        speed: 8,
        flag: 1
    },
    {
        dict: "rcmpaparazzo_2",
        name: "shag_action_poppy",
        speed: 8,
        flag: 1
    },
    {
        dict: "misscarsteal2pimpsex",
        name: "shagloop_hooker",
        speed: 8,
        flag: 1
    },
    {
        dict: "misscarsteal2pimpsex",
        name: "pimpsex_hooker",
        speed: 8,
        flag: 1
    },
    {
        dict: "misscarsteal2pimpsex",
        name: "shagloop_pimp",
        speed: 8,
        flag: 1
    },
    {
        dict: "misscarsteal2pimpsex",
        name: "pimpsex_punter",
        speed: 8,
        flag: 1
    },
];
var scenarioInfo = [{
        name: "WORLD_HUMAN_DRINKING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SMOKING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BINOCULARS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BUM_WASH",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BUM_FREEWAY",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BUM_STANDING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BUM_WASH",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_CHEERING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SMOKING_POT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_MOBILE_FILM_SHOCKING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STAND_FIRE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_HANG_OUT_STREET",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STAND_MOBILE_UPRIGHT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STRIP_WATCH_STAND",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STUPOR",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_TOURIST_MAP",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_TOURIST_MOBILE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_BUM_BIN",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_PARKING_METER",
        delay: 0,
        enterAnim: false
    },
    {
        name: "CODE_HUMAN_CROSS_ROAD_WAIT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PARTYING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_CAR_PARK_ATTENDANT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_CONST_DRILL",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_HAMMERING ",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_GARDENER_LEAF_BLOWER",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_GARDENER_PLANT",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_GUARD_PATROL",
        delay: 0,
        enterAnim: false
    },
    {
        name: "CODE_HUMAN_MEDIC_TIME_OF_DEATH",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_CLIPBOARD",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_GUARD_STAND",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SECURITY_SHINE_TORCH",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_COP_IDLES",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_JANITOR",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_MAID_CLEAN",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_MUSICIAN",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PAPARAZZI",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PROSTITUTE_LOW_CLASS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STAND_FISHING﻿",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_VEHICLE_MECHANIC",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_BUM_BIN",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_BBQ",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_WELDING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_HUMAN_STATUE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_MUSCLE_FLEX",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_MUSCLE_FREE_WEIGHTS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PUSH_UPS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SIT_UPS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_MUSCLE_CHIN_UPS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_SEAT_MUSCLE_BENCH_PRESS",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_JOG_STANDING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_BUM_SLUMPED",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SUNBATHE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SUNBATHE_BACK ",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_COP_IDLES",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_HANG_OUT_STREET",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_HUMAN_STATUE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_LEANING",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_STAND_FIRE",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_PICNIC",
        delay: 0,
        enterAnim: false
    },
    {
        name: "WORLD_HUMAN_SEAT_LEDGE",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "WORLD_HUMAN_SEAT_STEPS",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "WORLD_HUMAN_SEAT_WALL",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "WORLD_HUMAN_STUPOR",
        delay: 0,
        enterAnim: false
    },
    {
        name: "PROP_HUMAN_SEAT_ARMCHAIR",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_BAR",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_BENCH",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_BUS_STOP_WAIT",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_CHAIR",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_COMPUTER",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_DECKCHAIR",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_SUNLOUNGER",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
    {
        name: "PROP_HUMAN_SEAT_STRIP_WATCH",
        delay: 0,
        enterAnim: false,
        offsetY:-20
    },
];

alt.on(`Client::init`, (view) => {
    let mainTimerId;
    var followPlayer;
    let isEngineToggleEnabled = true;
    let interectionMenu = 0;

    alt.on(`update`, () => {
        game.disableControlAction(0, 140, true);
        if (game.isPedInAnyVehicle(game.getPlayerPed(-1), false)) {
            if (game.getPedInVehicleSeat(game.getVehiclePedIsIn(game.getPlayerPed(-1), false), 0) == game.getPlayerPed(-1)) {
                if (game.getIsTaskActive(game.getPlayerPed(-1), 165)) {
                    game.setPedIntoVehicle(game.getPlayerPed(-1), game.getVehiclePedIsIn(game.getPlayerPed(-1), false), 0);
                }
            }
        }
    });

    alt.onServer("authCharacter.success", (inHospital = false) => {
        game.displayRadar(true);
        view.emit(`selectorCharactersHide`);
        alt.emit(`Cursor::show`, false);
        alt.emit(`effect`, 'MP_job_load', 1);
        view.emit(`authCharacterSuccess`);
        game.setPedConfigFlag(player.scriptID, 429, true);

        if (!inHospital) {
            game.setPlayerHealthRechargeMultiplier(0); //Disable regeneration
            alt.emit("inventory.enable", true);
        }

        alt.emit(`tablet.police.setEnable`, true);
        alt.emit(`tablet.medic.setEnable`, true);
        alt.emit(`chat.enable`, true);
        view.emit(`userInterface::render`);
        view.emit('authentication::stop');
        alt.emit("hudControl.enable", true);
        alt.emit("playerMenu.enable", true);
        view.emit(`telePhone.enable`, true);

        alt.setInterval(() => {
            if (alt.chatActive || alt.consoleActive || alt.inventoryActive || /*alt.tradeActive*/ alt.playerMenuActive || game.isControlPressed(0, 32) || game.isControlPressed(0, 33) || game.isControlPressed(0, 321) || game.isControlPressed(0, 34) || game.isControlPressed(0, 35) || game.isControlPressed(0, 24) || player.getSyncedMeta('knockDown') == true) {
                alt.emit("setLocalVar", "afkTimer", 0);
            } else if (player.vehicle && game.getEntitySpeed(player.vehicle.scriptID) != 0) {
                alt.emit("setLocalVar", "afkTimer", 0);
            } else {
                alt.emit("setLocalVar", "afkTimer", alt.clientStorage['afkTimer'] + 1);
                if (alt.clientStorage['afkTimer'] >= 900) {
                    alt.emitServer('kickOfAfk', alt.clientStorage['afkTimer']);
                }
            }
        }, 1000);

        alt.on('keyup', (key) => {
            if (key === 0x12) alt.emit(`Cursor::show`, !alt.cursorState);
        });

        alt.on(`keydown`, (key) => {
            if (key === 50) {
                if (
                    !isEngineToggleEnabled || alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive ||
                    alt.inventoryActive /* TODO:|| alt.tradeActive*/ || alt.playerMenuActive || alt.enableTelephone || !player.vehicle
                ) {
                    return;
                }

                alt.emit("vehicleEngineHandler");
            }
        });

        alt.on("vehicle::engineToggleEnable", (state) => {
            isEngineToggleEnabled = state;
        });

        alt.on(`keyup`, (key) => {
            if (key === 69) {
                if (alt.interactionEntity) alt.interactionEntity = null;
                alt.emit("interactionMenu.hide");
                if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone) return;
                alt.emit(`Cursor::show`, false);
            }
        });

        alt.on(`keydown`, (key) => {
            if (key === 71) {
                if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone || alt.clientStorage.hasCuffs || alt.isBarberStarted) return;
                if (player.getSyncedMeta("knockDown") === true || player.vehicle) return;
                if (alt.keyDownIsAtive) {
                    alt.keyDownIsAtive = false;
                    alt.emit(`selectMenu.hide`);
                } else {
                    alt.keyDownIsAtive = true;
                    alt.emit("selectMenu.show", "actions_list");
                }
            }
        });

        view.on(`selectMenu.backspacePressed`, (menuName) => {
            if (
                menuName === "sit"
                || menuName === "stand"
                || menuName === "lay"
                || menuName === "sport"
                || menuName === "works"
                || menuName === "social"
            ) {
                alt.emit("selectMenu.show", "actions_scenarios", sceneMenuIndex);
            } else if (
                menuName === "anim_sex"
                || menuName === "anim_gesture"
                || menuName === "anim_dance1"
                || menuName === "anim_dance2"
                || menuName === "anim_actions"
                || menuName === "anim_sport"
                || menuName === "anim_lay"
                || menuName === "anim_sit"
                || menuName === "anim_stand"
            ) {
                alt.emit("selectMenu.show", "actions_anims", animMenuIndex);
            } else if (menuName === "actions_scenarios" || menuName === "actions_anims") {
                alt.emit("selectMenu.show", "actions_list", mainMenuIndex);
            }
        });

        view.on("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
            if (menuName === "actions_list") mainMenuIndex = itemIndex;
            if (menuName === "actions_scenarios") sceneMenuIndex = itemIndex;
            if (menuName === "actions_anims") animMenuIndex = itemIndex;
        });

        alt.on(`keyup`, (key) => {
            if (key === 71) {
                if (interectionMenu == 2) {
                    alt.emit("interactionMenu.hide");
                    interectionMenu = 0;
                    if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || /*|| alt.tradeActive*/ alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone) return;
                    alt.emit(`Cursor::show`, false);
                }
            }
        });

        alt.on(`keydown`, (key) => {
            if (key === 0x4C) {
                if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || /*|| alt.tradeActive*/ alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone) return;
                var pos = player.pos;
                var entity = alt.getNearVehicle(pos, 10);
                if (!entity) return;
                const entityPos = entity.pos;
                var dist = alt.vdist(pos, entityPos);
                if (dist < 2) alt.emitServer("item.lockCar", entity.id);
            } else if (key === 0x45) {
                if (alt.tabletActive || alt.chatActive || alt.autoSaloonActive || alt.consoleActive || alt.inventoryActive || /*|| alt.tradeActive*/ alt.playerMenuActive || alt.documentsActive || alt.houseMenuActive || alt.enableTelephone || player.vehicle) return;
                /* Поднятие предмета с земли. */
                var pos = player.pos;
                var itemObj, minDist = 9999;
                alt.objects.forEach((obj) => {
                    var objPos = obj.pos;
                    let dist = alt.vdist(pos, objPos);
                    if (dist < alt.clientStorage.maxPickUpItemDist && obj.sqlId) {
                        if (dist < minDist) {
                            minDist = dist;
                            itemObj = obj;
                        }
                    }
                });
                if (itemObj && !alt.isFlood() && !player.getSyncedMeta("attachedObject")) {
                    alt.emitServer("item.pickUp", itemObj.sqlId);
                    return;
                }

                /* Показ меню взаимодействия. */

                var entity = alt.getNearPlayerOrVehicle(pos, 10);

                if (entity) {
                    const entityPos = entity.pos;
                    var dist = alt.vdist(pos, entityPos);
                    if (dist < 10) {
                        if (dist < 2 && entity instanceof alt.Player) {
                            interectionMenu = 2;
                            var attachedObject = player.getSyncedMeta("attachedObject");
                            var haveProducts = (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4");
                            alt.emit("interactionMenu.showPlayerMenu", entity, {
                                showTransferProducts: haveProducts
                            });
                        } else if (entity instanceof alt.Vehicle) {
                            interectionMenu = 2;
                            if (dist < 2) alt.emit("interactionMenu.showVehicleMenu", entity, {
                                action: 'showDoors'
                            });
                            else {
                                var bootPos = alt.getBootPosition(entity);

                                // debug(`vdist(pos, bootPos): ${vdist(pos, bootPos)}`);
                                if (bootPos && alt.vdist(pos, bootPos) < 1) alt.emit("interactionMenu.showVehicleMenu", entity, {
                                    action: 'showBoot',
                                    showProducts: true,
                                });
                                else {
                                    var hoodPos = alt.getHoodPosition(entity);
                                    // debug(`vdist(pos, hoodPos): ${vdist(pos, hoodPos)}`);
                                    if (hoodPos && alt.vdist(pos, hoodPos) < 1) alt.emit("interactionMenu.showVehicleMenu", entity, {
                                        action: 'showHood'
                                    });
                                }
                            }
                        }
                    }
                }

                var attachedObject = player.getSyncedMeta("attachedObject");

                /* Кладём товар. */
                if (alt.clientStorage.insideWarehouseProducts && (attachedObject == "prop_box_ammo04a" || attachedObject == "ex_office_swag_pills4") && !alt.isFlood()) alt.emitServer("warehouse.push");

                /* Берем товар.*/
                if (!attachedObject && alt.clientStorage.insideProducts && !alt.isFlood()) alt.emitServer("products.take");

                /* Сбор урожая. */
                if (!attachedObject && alt.clientStorage.farmJobType != null && !alt.isFlood()) {
                    if (alt.isCropping) return alt.emit(`nError`, "Вы уже собираете урожай!");
                    if (player.getSyncedMeta("knockDown")) return;
                    var object = alt.getNearObject(pos, 3);
                    if (object) alt.emitServer("farm.field.takeCrop", object.scriptID);
                }
            }
        });

        if (mainTimerId) alt.clearInterval(mainTimerId);

        alt.onServer("startFollowToPlayer", (playerId) => {
            var player = alt.Player.atRemoteId(playerId);
            if (!player) return;
            followPlayer = player;
        });

        alt.onServer("stopFollowToPlayer", () => {
            followPlayer = null;
        });

        mainTimerId = alt.setInterval(() => {
            alt.emit("inventory.setHealth", game.getEntityHealth(player.scriptID) - 100);
            alt.emit("inventory.setArmour", game.getPedArmour(player.scriptID));

            var weaponHash = game.getSelectedPedWeapon(player.scriptID);
            var ammo = game.getAmmoInPedWeapon(player.scriptID, weaponHash);
            var ammoType = game.getMaxAmmoInClip(player.scriptID, player.currentWeapon);
            var weaponSlot = game.getWeapontypeSlot(player.scriptID, weaponHash);

            var data = {
                ammo: ammo,
                ammoType: ammoType,
                weaponHash: player.currentWeapon
            };

            //TODO: menu.execute(`alt.emit('hudControl', { data: ${JSON.stringify(data)}, event: 'setDataWeapon' })`);

            if (followPlayer) {
                var pos = followPlayer.pos;
                var localPos = player.pos;
                var dist = alt.vdist(new alt.Vector3(pos.x, pos.y, pos.z), new alt.Vector3(localPos.x, localPos.y, localPos.z));
                if (dist > 30) {
                    followPlayer = null;
                    return;
                }
                var speed = 3;
                if (dist < 10) speed = 2;
                if (dist < 5) speed = 1;
                game.taskFollowNavMeshToCoord(player.scriptID, pos.x, pos.y, pos.z, speed, -1, 1, true, 0);
            }

            var entity = alt.getNearPlayerOrVehicle(player.pos, 10);
            if (entity && entity instanceof alt.Vehicle && entity.getSyncedMeta("boot")) {
                var bootPos = alt.getBootPosition(entity);
                var distToBoot = alt.vdist(player.pos, bootPos);
                if (distToBoot < 1) {
                    if (alt.clientStorage.bootVehicleId == -1) {
                        alt.emitServer(`vehicle.requestItems`, entity.id);
                        alt.emit("setLocalVar", "bootVehicleId", entity.id);
                    }
                } else {
                    if (alt.clientStorage.bootVehicleId != -1) {
                        alt.emitServer(`vehicle.requestClearItems`, alt.clientStorage.bootVehicleId);
                        alt.emit("setLocalVar", "bootVehicleId", -1);
                    }
                }
            } else if (alt.clientStorage.bootVehicleId != -1) {
                alt.emitServer(`vehicle.requestClearItems`, alt.clientStorage.bootVehicleId);
                alt.emit("setLocalVar", "bootVehicleId", -1);
            }

            if (alt.clientStorage.faction >= 7 && alt.clientStorage.faction !== 9 && alt.clientStorage.faction <= 11) {
                alt.emit("bandZones.setPlayerPos", player.pos.x, player.pos.y);
                if (player.getSyncedMeta("gangwar")) alt.emit("bandZones.checkInZone", player);
            }

        }, 1000);

        alt.requestAnimDicts();
    });

    alt.attachInfo = {
        "prop_box_ammo04a": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "ex_office_swag_pills4": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "hei_prop_heist_wooden_box": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.3,
                rX: -45.0,
                rY: 20.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_bucket_01a": {
            offset: {
                x: 0.2,
                y: -0.37,
                z: 0.2,
                rX: -85.0,
                rY: 0,
                rZ: 20.0
            },
            bone: 44,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_feed_sack_01": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.075,
                rX: -45.0,
                rY: 20.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_pizza_box_02": {
            //   offset: {x: 0.0, y: -0.3, z: 0.1, rX: -45.0, rY: 10.0, rZ: 120.0},
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.0,
                rX: -45.0,
                rY: 0.0,
                rZ: 100.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        // take_object 0 hei_prop_heist_binbag
        "hei_prop_heist_binbag": {
            offset: {
                x: 0,
                y: 0,
                z: -0.05,
                rX: -60.0,
                rY: -60.0,
                rZ: 0
            },
            bone: 73,
            anim: {
                dict: "anim@move_m@trash",
                name: "pickup",
                speed: 8,
                flag: 49
            }
        },
        "v_ind_cs_box02": {
            offset: {
                x: 0.0,
                y: -0.3,
                z: 0.3,
                rX: -45.0,
                rY: 10.0,
                rZ: 120.0
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_veg_crop_03_pump": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_veg_crop_03_cab": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_weed_02": {
            offset: {
                x: 0.2,
                y: -0.3,
                z: 0.1,
                rX: -45,
                rY: 20,
                rZ: 120
            },
            bone: 48,
            anim: {
                dict: "anim@heists@box_carry@",
                name: "idle",
                speed: 8,
                flag: 49
            }
        },
        "prop_cs_trowel": {
            offset: {
                x: 0.01,
                y: 0.03,
                z: 0,
                rX: -119,
                rY: 10,
                rZ: 90
            },
            bone: 77,
            anim: {
                dict: "amb@world_human_gardener_plant@female@base",
                name: "base_female",
                speed: 8,
                flag: 1
            }
        },
    };

    var vehAttachedObjects = {};

    alt.on(`syncedMetaChange`, async (entity, key, value) => {
        if (entity instanceof alt.Player) {
            if (entity.id === player.id) {
                if (key === "attachedObject") {
                    if (!value) {
                        //alt.putObject(entity, entity.getSyncedMeta("attachedObject"));
                    } else {
                        //alt.takeObject(entity, value);
                    }

                    if (player.id == entity.id) player.throwAttachedObject = false;
                } else if (entity instanceof alt.Player || entity instanceof alt.Vehicle) {
                    if (key === "passive") setPassiveMode(entity, value);
                } else if (key === "gangwar") gangwarDataHandler(entity, value);
            }
        }
    });


    alt.on("syncedMetaChange", async (entity, key, value) => {
        if (entity instanceof alt.Player) {
            if (entity.id === player.id) {
                if (key === "animation") {
                    game.clearPedTasksImmediately(entity.scriptID);
                    if (value === null) return;
                    value = Math.clamp(value, 0, animationInfo.length - 1);
                    var a = animationInfo[value];

                    if (!game.doesAnimDictExist(a.dict)) return;

                    game.requestAnimDict(a.dict);

                    while (!game.hasAnimDictLoaded(a.dict)) {
                        await wait(0);
                    }

                    game.taskPlayAnim(entity.scriptID, a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
                } else if (key === "scene") {
                    game.clearPedTasksImmediately(entity.scriptID);
                    if (value === null) return;
                    value = Math.clamp(value, 0, scenarioInfo.length - 1);
                    var a = scenarioInfo[value];

                    game.taskStartScenarioInPlace(entity.scriptID, a.name, a.delay, a.enterAnim);
                }
            }
        }
    });

    function gangwarDataHandler(entity, zoneId) {
        if (entity instanceof alt.Player || entity instanceof alt.Vehicle) {
            if (entity instanceof alt.Player && entity.getSyncedMeta("id") == player.getSyncedMeta("id")) {
                if (zoneId) {
                    alt.Player.all.forEach((rec) => {
                        if (rec.getSyncedMeta("gangwar") != zoneId) setPassiveMode(rec, true);
                        else setPassiveMode(rec, false);
                    });
                } else {
                    alt.Player.all.forEach((rec) => {
                        if (rec.getSyncedMeta("gangwar")) setPassiveMode(rec, true);
                        else setPassiveMode(rec, false);
                    });
                }
            } else {
                if (zoneId) {
                    if (zoneId == player.getSyncedMeta("gangwar")) setPassiveMode(entity, false);
                    else setPassiveMode(entity, true);
                } else {
                    if (player.getSyncedMeta("gangwar")) setPassiveMode(entity, true);
                    else setPassiveMode(entity, false);
                }
            }
        }
    }
});
