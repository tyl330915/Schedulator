function getPreferenceColors(pref) {
    let time1 = "";
    let time2 = "";
    let day1, day2;
    dayTime1, dayTime2

    if (pref.includes("/")) {
        day1 = pref.split("/")[0];
        day2 = pref.split("/")[1].split(" ")[0];
        time1 = parseTimes(pref.split(" ")[1].split(":")[0]);
        dayTime1 = day1 + time1;
        dayTime2 = day2 + time1;
        return [dayTime1, dayTime2];
    } else {
        day1 = pref.split(" ")[0];
        time1 = parseTimes(pref.split(" ")[1].split(":")[0]);
        time2 = getDoubleClassSecondary(time1);
        dayTime1 = day1 + time1;
        dayTime2 = day1 + time2;
        return [dayTime1];
    }

};