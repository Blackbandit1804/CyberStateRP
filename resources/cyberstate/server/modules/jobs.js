module.exports = {
    Init: () => {
        DB.Query("SELECT * FROM jobs", (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                initJobUtils(result[i]);
            }

            alt.jobs = result;
            alt.log(`Работы загружены: ${i} шт.`);

            initJobsUtils();
        });
    }
}

function initJobsUtils() {
    alt.jobs.getBySqlId = (sqlId) => {
        for (var i = 0; i < alt.jobs.length; i++) {
            if (alt.jobs[i].sqlId == sqlId) return alt.jobs[i];
        }
        return null;
    };
}

function initJobUtils(job) {
    job.setName = (name) => {
        job.name = name;
        DB.Query("UPDATE jobs SET name=? WHERE id=?", [job.name, job.sqlId]);
    };
    job.setLevel = (level) => {
        job.level = Math.clamp(level, 1, 200);
        DB.Query("UPDATE jobs SET level=? WHERE id=?", [job.level, job.sqlId]);
    };
}
